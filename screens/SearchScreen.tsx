// screens/SearchScreen.tsx (Bản nâng cấp "Tìm kiếm thật" CÓ TABS)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SectionList, // 👈 Giữ SectionList
  FlatList, // 👈 Thêm FlatList
  Image,
  StatusBar,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { API_BASE_URL } from "../config";
import { getAssetImage } from "../utils/ImageManager";
import { Song, Artist, Album } from "../interfaces/data";
import { useDebounce } from "../utils/useDebounce";

type NavigationProp = StackNavigationProp<RootStackParamList>;

// ✅ MỚI: Thêm lại kiểu TabType
type TabType = "All" | "Tracks" | "Albums" | "Artists";

type SearchSection = {
  title: string;
  data: any[];
};

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // ✅ MỚI: Thêm lại state cho Tab
  const [activeTab, setActiveTab] = useState<TabType>("All");

  // State cho gợi ý ban đầu
  const [initialSuggestions, setInitialSuggestions] = useState<Song[]>([]);

  // ✅ MỚI: Thêm state cho từng loại kết quả
  const [artistsResult, setArtistsResult] = useState<Artist[]>([]);
  const [songsResult, setSongsResult] = useState<Song[]>([]);
  const [albumsResult, setAlbumsResult] = useState<Album[]>([]);
  // State cho tab "All" (SectionList)
  const [sectionedResults, setSectionedResults] = useState<SearchSection[]>([]);

  const debouncedQuery = useDebounce(searchQuery, 400);

  // Effect 1: Tải các gợi ý ban đầu (giữ nguyên)
  useEffect(() => {
    const fetchInitialSuggestions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/songs?_limit=5`);
        const data = (await response.json()) as Song[];
        setInitialSuggestions(data);
      } catch (error) {
        console.error("Lỗi tải gợi ý ban đầu:", error);
      }
    };
    fetchInitialSuggestions();
  }, []);

  // ✅ SỬA: Effect 2: Tải kết quả và lưu vào TẤT CẢ các state
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedQuery.length === 0) {
        setShowResults(false);
        setSectionedResults([]);
        setArtistsResult([]);
        setSongsResult([]);
        setAlbumsResult([]);
        return;
      }

      setLoading(true);
      setShowResults(true);
      try {
        const [artistsRes, songsRes, albumsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/artists?q=${debouncedQuery}&_limit=5`),
          fetch(`${API_BASE_URL}/songs?q=${debouncedQuery}&_limit=10`),
          fetch(`${API_BASE_URL}/albums?q=${debouncedQuery}&_limit=5`),
        ]);

        const artists: Artist[] = await artistsRes.json();
        const songs: Song[] = await songsRes.json();
        const albums: Album[] = await albumsRes.json();

        // 1. Set state riêng lẻ cho các tab "Tracks", "Artists", "Albums"
        setArtistsResult(artists);
        setSongsResult(songs);
        setAlbumsResult(albums);

        // 2. Xây dựng cấu trúc dữ liệu cho tab "All" (SectionList)
        const newResults: SearchSection[] = [];
        if (artists.length > 0) {
          newResults.push({ title: "Nghệ sĩ", data: artists });
        }
        if (songs.length > 0) {
          newResults.push({ title: "Bài hát", data: songs });
        }
        if (albums.length > 0) {
          newResults.push({ title: "Album", data: albums });
        }
        setSectionedResults(newResults);

      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedQuery]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    Keyboard.dismiss();
  };

  const handleSuggestionPress = (song: Song) => {
    navigation.navigate("Player", { song });
  };

  // --- CÁC HÀM RENDER ---
  // (Giữ nguyên các hàm renderArtistResult, renderSongResult, renderAlbumResult, renderSectionHeader)

  // Render suggestion item (ban đầu)
  const renderSuggestion = ({ item }: { item: Song }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item)}
    >
      <Feather name="trending-up" size={20} color="#888" style={{marginRight: 10}}/>
      <Text style={styles.suggestionText}>{item.title} - {item.artist}</Text>
    </TouchableOpacity>
  );
  
  // Render Artist
  const renderArtistResult = (item: Artist) => (
    <TouchableOpacity
      style={styles.artistResult}
      onPress={() =>
        navigation.navigate("Artist", {
          artist: {
            id: item.id,
            name: item.name,
            avatar: getAssetImage(item.avatarKey ?? ""),
          },
        })
      }
    >
      <Image source={getAssetImage(item.avatarKey ?? "")} style={styles.artistAvatar} />
      <View style={styles.artistInfo}>
        <Text style={styles.artistName}>{item.name}</Text>
        <View style={styles.followerRow}>
          <Ionicons name="person-outline" size={14} color="#888" />
          <Text style={styles.followers}> {item.followers}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render Song
  const renderSongResult = (item: Song) => (
    <TouchableOpacity
      style={styles.songResult}
      onPress={() => navigation.navigate("Player", { song: item })}
    >
      <Image source={getAssetImage(item.artworkKey ?? "")} style={styles.songArtwork} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <View style={styles.songMeta}>
          <Text style={styles.songArtist}>{item.artist}</Text>
        </View>
        <View style={styles.songStats}>
          <Ionicons name="play" size={12} color="#888" />
          <Text style={styles.statsText}> {item.plays}</Text>
          <Text style={styles.statsText}> • {item.duration}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  // Render Album
  const renderAlbumResult = (item: Album) => (
    <TouchableOpacity 
      style={styles.albumResult}
      onPress={() => navigation.navigate("SubscriptionPlans")}
    >
      <Image
        source={getAssetImage(item.artworkKey || "")}
        style={styles.songArtwork} // Dùng chung style
      />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
      </View>
    </TouchableOpacity>
  );

  // Hàm render chung cho SectionList (Tab "All")
  const renderResultItem = ({ item, section }: { item: any; section: SearchSection }) => {
    switch (section.title) {
      case "Nghệ sĩ":
        return renderArtistResult(item as Artist);
      case "Bài hát":
        return renderSongResult(item as Song);
      case "Album":
        return renderAlbumResult(item as Album);
      default:
        return null;
    }
  };
  // Render tiêu đề cho mỗi Section (Tab "All")
  const renderSectionHeader = ({ section: { title } }: { section: SearchSection }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  // ✅ MỚI: Mảng chứa các tab
  const tabs: TabType[] = ["All", "Tracks", "Albums", "Artists"];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        {/* ... (code search bar giữ nguyên) ... */}
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm bài hát, nghệ sĩ, album..."
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus={false}
            placeholderTextColor="#888"
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Ionicons name="close-circle" size={22} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* VÙNG HIỂN THỊ NỘI DUNG */}

      {/* Trạng thái 1: Đang loading */}
      {loading && (
        <ActivityIndicator size="large" color="#00D9FF" style={{marginTop: 20}} />
      )}

      {/* Trạng thái 2: Hiển thị gợi ý (mặc định) */}
      {!showResults && !loading && (
        <>
          <Text style={styles.suggestionTitle}>Gợi ý hàng đầu</Text>
          <FlatList
            data={initialSuggestions}
            renderItem={renderSuggestion}
            keyExtractor={(item) => item.id.toString()}
            style={styles.suggestionsList}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}

      {/* Trạng thái 3: Hiển thị kết quả tìm kiếm */}
      {showResults && !loading && (
        <View style={styles.resultsContainer}>
          {/* ✅ MỚI: Thêm lại TAB BAR */}
          <View style={styles.tabsContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ✅ MỚI: Render có điều kiện dựa trên activeTab */}
          
          {/* --- Tab "All" --- */}
          {activeTab === 'All' && (
            sectionedResults.length === 0 ? (
              <NoResultsView />
            ) : (
              <SectionList
                sections={sectionedResults}
                keyExtractor={(item) => item.id}
                renderItem={renderResultItem}
                renderSectionHeader={renderSectionHeader}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.resultsList}
                stickySectionHeadersEnabled={false}
              />
            )
          )}

          {/* --- Tab "Tracks" --- */}
          {activeTab === 'Tracks' && (
            <FlatList
              data={songsResult}
              renderItem={({ item }) => renderSongResult(item)}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={NoResultsView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultsList}
            />
          )}
          
          {/* --- Tab "Artists" --- */}
          {activeTab === 'Artists' && (
            <FlatList
              data={artistsResult}
              renderItem={({ item }) => renderArtistResult(item)}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={NoResultsView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultsList}
            />
          )}

          {/* --- Tab "Albums" --- */}
          {activeTab === 'Albums' && (
            <FlatList
              data={albumsResult}
              renderItem={({ item }) => renderAlbumResult(item)}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={NoResultsView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultsList}
            />
          )}

        </View>
      )}

    </SafeAreaView>
  );
}

// ✅ MỚI: Component hiển thị khi không có kết quả
const NoResultsView = () => (
  <View style={styles.noResultsContainer}>
    <Text style={styles.noResultsText}>Không tìm thấy kết quả</Text>
    <Text style={styles.noResultsSubText}>Hãy thử một từ khóa khác.</Text>
  </View>
);

// ✅ SỬA: Thêm lại styles cho Tabs
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: "#00D9FF",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: "#000",
  },

  // Suggestions styles
  suggestionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 15,
    marginBottom: 10,
    marginTop: 10,
  },
  suggestionsList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  suggestionText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },

  // No Results
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50, // Thêm margin
  },
  noResultsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  noResultsSubText: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
  },

  // Results styles
  resultsContainer: {
    flex: 1,
  },
  // ✅ MỚI: Thêm lại styles cho Tabs
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  tab: {
    marginRight: 30,
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#00D9FF",
  },
  tabText: {
    fontSize: 16,
    color: "#888",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#00D9FF",
    fontWeight: "600",
  },

  resultsList: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 10,
  },

  // (Các styles cho artist, song, album giữ nguyên)
  artistResult: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  artistAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  followerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  followers: {
    fontSize: 13,
    color: "#888",
  },

  songResult: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  songArtwork: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  songMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 13,
    color: "#888",
  },
  songStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsText: {
    fontSize: 12,
    color: "#888",
  },
  
  albumResult: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
});
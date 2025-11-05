// screens/HomeScreen.tsx
import React, { useState, useEffect } from "react"; // 👈 Thêm
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ImageBackground,
  ActivityIndicator, // 👈 Thêm
} from "react-native";
import { MainTabScreenProps, RootStackParamList } from "../navigation/types";
import { Chart, Album, Artist, Song } from "../interfaces/data"; // 👈 Thêm Song
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";

import { API_BASE_URL } from "../config"; // 👈 Thêm
import { AppImages, getAssetImage } from "../utils/ImageManager"; // 👈 Thêm

type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
type Props = MainTabScreenProps<"Home">;

// ❌ XÓA HẾT MOCK DATA (MOCK_SUGGESTIONS, MOCK_CHARTS, MOCK_ALBUMS, MOCK_ARTISTS)

export default function HomeScreen({ navigation }: Props) {
  const rootStackNavigation = useNavigation<RootStackNavigationProp>();

  // ✅ MỚI: Thêm State để lưu dữ liệu từ API
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [charts, setCharts] = useState<Chart[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);

  // ✅ MỚI: useEffect để gọi API
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [suggestionsRes, chartsRes, albumsRes, artistsRes] =
          await Promise.all([
            fetch(`${API_BASE_URL}/suggestions`),
            fetch(`${API_BASE_URL}/charts`),
            fetch(`${API_BASE_URL}/trending_albums`),
            fetch(`${API_BASE_URL}/popular_artists`),
          ]);

        setSuggestions(await suggestionsRes.json());
        setCharts(await chartsRes.json());
        setAlbums(await albumsRes.json());
        setArtists(await artistsRes.json());
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []); // [] = Chạy 1 lần

  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity>
        <Text style={styles.seeAll}>See all</Text>
      </TouchableOpacity>
    </View>
  );

  // ✅ SỬA: Dùng 'artworkKey'
  const renderSuggestionCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.suggestionCard}>
      <ImageBackground
        source={getAssetImage(item.artworkKey)} // 👈 SỬA
        style={styles.suggestionImage}
        imageStyle={{ borderRadius: 15 }}
      >
    
      </ImageBackground>
    </TouchableOpacity>
  );

  // ✅ SỬA: Dùng 'imageKey'
  const renderChartCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.chartCard}
      onPress={() =>
        rootStackNavigation.navigate("Playlist", {
          // Gửi ID của playlist (để PlaylistScreen tự fetch)
          playlistId: "playlist_top50_canada", // 👈 SỬA (key này phải có trong db.json)
          title: `${item.title} - ${item.subtitle}`,
          artwork: getAssetImage(item.imageKey), // 👈 SỬA
        })
      }
    >
      <LinearGradient colors={item.artwork} style={styles.chartGradient}>
        <Text style={styles.chartTitle}>{item.title}</Text>
        <Text style={styles.chartSubtitle}>{item.subtitle}</Text>
      </LinearGradient>
      <Text style={styles.chartDescription}>Daily chart-toppers update</Text>
    </TouchableOpacity>
  );

  // ✅ SỬA: Dùng 'artworkKey'
// ✅ SỬA: Đổi kiểu 'item' thành 'Album'
  // và thêm '|| ""' để xử lý trường hợp 'artworkKey' có thể
  // bị undefined
  const renderAlbumCard = ({ item }: { item: Album }) => (
    <TouchableOpacity style={styles.albumCard}>
      <Image
        source={getAssetImage(item.artworkKey || "")} // 👈 SỬA Ở ĐÂY
        style={styles.albumArtwork}
      />
      <Text style={styles.albumTitle}>{item.title}</Text>
      <Text style={styles.albumArtist}>{item.artist}</Text>
    </TouchableOpacity>
  );

// ✅ SỬA: Đổi kiểu 'item' thành 'Artist'
  // và thêm '|| ""' để xử lý trường hợp 'avatarKey' có thể
  // bị undefined
  const renderArtistCard = ({ item }: { item: Artist }) => (
    <View style={styles.artistCard}>
      <TouchableOpacity
        onPress={() =>
          rootStackNavigation.navigate("Artist", {
            artist: {
              id: item.id,
              name: item.name,
              avatar: getAssetImage(item.avatarKey || ""), // 👈 SỬA Ở ĐÂY
            },
          })
        }
      >
        <Image
          source={getAssetImage(item.avatarKey || "")} // 👈 SỬA Ở ĐÂY
          style={styles.artistAvatar}
        />
        <Text style={styles.artistName}>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
    </View>
  );
  // ✅ MỚI: Thêm màn hình loading
  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#00AFFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header (giữ nguyên, chỉ sửa avatar) */}
        <View style={styles.header}>
          <View>
           <Image 
        source={require('../assets/Home - Audio Listing/Image 36.png')} 
        style={{width : 100,height:50}}
        resizeMode="contain" // Cần thêm style để định rõ kích thước
    />
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>Ashley Scott</Text>
          </View>
          <View style={styles.headerIcons}>
            <Ionicons
              name="notifications-outline"
              size={26}
              color="black"
              style={{ marginRight: 15 }}
            />
            <Image source={AppImages.avatar_3} style={styles.avatar} />
          </View>
        </View>

        {/* Search Bar (giữ nguyên) */}
        <View style={styles.searchBar}>
          <FontAwesome name="search" size={18} color="#888" />
          <TextInput
            placeholder="What you want to listen to"
            style={styles.searchInput}
            placeholderTextColor="#888"
          />
        </View>

        {/* ✅ SỬA: Dùng state mới */}
        <Text style={[styles.sectionTitle, { marginBottom: 15 }]}>
          Suggestions for you
        </Text>
        <FlatList
          data={suggestions}
          renderItem={renderSuggestionCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 15 }}
        />

        {renderSectionHeader("Charts")}
        <FlatList
          data={charts}
          renderItem={renderChartCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 15 }}
        />

        {renderSectionHeader("Trending albums")}
        <FlatList
          data={albums}
          renderItem={renderAlbumCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 15 }}
        />

        {renderSectionHeader("Popular artists")}
        <FlatList
          data={artists}
          renderItem={renderArtistCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 15 }}
        />

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ... (const styles giữ nguyên)
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  container: {
    flex: 1,
    paddingLeft: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingRight: 15,
  },
  greeting: { fontSize: 16, color: "#888" },
  userName: { fontSize: 24, fontWeight: "bold" },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
    padding: 12,
    marginVertical: 20,
    marginRight: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: "#000",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 15,
    paddingRight: 15,
  },
  sectionTitle: { fontSize: 20, fontWeight: "bold" },
  seeAll: { fontSize: 14, color: "#00AFFF" },

  suggestionCard: {
    width: 160,
    height: 240,
    marginRight: 15,
  },
  suggestionImage: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  suggestionTextOverlay: {
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  suggestionTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  suggestionArtist: {
    color: "#FFF",
    fontSize: 14,
  },

  chartCard: {
    width: 140,
    marginRight: 15,
  },
  chartGradient: {
    width: 140,
    height: 140,
    borderRadius: 15,
    justifyContent: "center",
    padding: 10,
  },
  chartTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  chartSubtitle: {
    color: "#FFF",
    fontSize: 16,
  },
  chartDescription: {
    color: "#888",
    fontSize: 13,
    marginTop: 5,
  },

  albumCard: {
    width: 140,
    marginRight: 15,
  },
  albumArtwork: {
    width: 140,
    height: 140,
    borderRadius: 15,
  },
  albumTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 5,
  },
  albumArtist: {
    fontSize: 13,
    color: "#888",
  },

  artistCard: {
    width: 140,
    marginRight: 15,
    alignItems: "center",
  },
  artistAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  artistName: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
  followButton: {
    backgroundColor: "#282828",
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginTop: 10,
  },
  followButtonText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "bold",
  },
});

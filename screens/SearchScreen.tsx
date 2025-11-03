// screens/SearchScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
  Keyboard,
  ActivityIndicator, // 👈 MỚI
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { Song } from "../interfaces/data"; // 👈 MỚI
import { JAMENDO_API_URL, JAMENDO_CLIENT_ID } from "../config"; // 👈 MỚI

type NavigationProp = StackNavigationProp<RootStackParamList>;

// ❌ XÓA MOCK DATA

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  // 👈 MỚI: State cho loading và kết quả
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Song[]>([]);

  // 👈 MỚI: Hàm format thời gian (vì API trả về số)
  const formatTime = (millis: number) => {
    if (!millis) return "0:00";
    const totalSeconds = millis / 1000;
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // 👈 MỚI: Hàm gọi API tìm kiếm
  const handleSearch = async () => {
    if (searchQuery.length === 0) {
      setResults([]);
      setShowResults(false);
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setShowResults(true);
    setResults([]); // Xóa kết quả cũ

    try {
      const url = `${JAMENDO_API_URL}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&search=${searchQuery}&limit=20&imagesize=200`;

      const response = await fetch(url);
      const data = await response.json();

      // Ánh xạ dữ liệu Jamendo về interface 'Song' của bạn
      const mappedResults: Song[] = data.results.map((track: any) => ({
        id: track.id,
        title: track.name,
        artist: track.artist_name,
        artwork: track.image || "https://placehold.co/60x60/EEE/333?text=Music",
        durationMillis: track.duration * 1000,
        audioUrl: track.audio,

        // 👇 DÒNG ĐÃ SỬA LỖI
        plays: track.sharecount?.toString() ?? "0",
      }));

      setResults(mappedResults);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setShowResults(false);
    setResults([]);
    Keyboard.dismiss();
  };

  // ❌ BỎ: handleSuggestionPress và renderSuggestion
  // ❌ BỎ: renderArtistResult và tabs (để giữ cho ví dụ đơn giản)

  // 👈 SỬA: renderSongResult để dùng 'uri' và 'durationMillis'
  const renderSongResult = (item: Song) => (
    <TouchableOpacity
      style={styles.songResult}
      onPress={() =>
        navigation.navigate("Player", {
          song: item, // 👈 Gửi nguyên đối tượng song (có audioUrl)
          playlist: results,
        })
      }
    >
      <Image
        source={{ uri: item.artwork as string }} // 👈 SỬA: Dùng 'uri'
        style={styles.songArtwork}
      />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <View style={styles.songMeta}>
          <Text style={styles.songArtist}>{item.artist}</Text>
        </View>
        <View style={styles.songStats}>
          <Ionicons name="play" size={12} color="#888" />
          <Text style={styles.statsText}> {item.plays}</Text>
          <Text style={styles.statsText}>
            {" "}
            • {formatTime(item.durationMillis || 0)}
          </Text>
        </View>
      </View>
      <TouchableOpacity>
        <Feather name="more-horizontal" size={24} color="#888" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search songs on Jamendo..." // 👈 SỬA
            value={searchQuery}
            onChangeText={setSearchQuery} // 👈 SỬA
            autoFocus={false}
            placeholderTextColor="#888"
            returnKeyType="search" // 👈 MỚI
            onSubmitEditing={handleSearch} // 👈 MỚI: Bấm search trên bàn phím
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Ionicons name="close-circle" size={22} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ❌ BỎ: Show suggestions */}

      {/* Show results */}
      {showResults && (
        <View style={styles.resultsContainer}>
          {/* ❌ BỎ: Tabs */}

          {/* 👈 MỚI: Hiển thị loading */}
          {loading && (
            <ActivityIndicator
              size="large"
              color="#00D9FF"
              style={{ marginTop: 20 }}
            />
          )}

          {/* Results List */}
          {!loading && (
            <FlatList
              data={results} // 👈 SỬA
              renderItem={({ item }) => renderSongResult(item)} // 👈 SỬA
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultsList}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

// ... (const styles giữ nguyên y hệt)
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

  // Suggestions styles (Image 1)
  suggestionsList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  suggestionItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  suggestionText: {
    fontSize: 16,
    color: "#333",
  },

  // Results styles (Image 2)
  resultsContainer: {
    flex: 1,
  },
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

  // Artist result styles
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
  followBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  followBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },

  // Song result styles
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
});

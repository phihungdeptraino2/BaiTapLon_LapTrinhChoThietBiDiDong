// screens/PlaylistScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { RootStackScreenProps } from "../navigation/types";
import { Song } from "../interfaces/data";
import { Ionicons, Feather } from "@expo/vector-icons";

import { API_BASE_URL } from "../config";
import { getAssetImage } from "../utils/ImageManager";

type Props = RootStackScreenProps<"Playlist">;

// ──────────────────────────────
// Component hiển thị 1 bài hát
// ──────────────────────────────
const SongItem = ({ item, onPress }: { item: Song; onPress: () => void }) => (
  <TouchableOpacity style={styles.songItem} onPress={onPress}>
    <Image source={item.artwork} style={styles.songArt} />
    <View style={styles.songInfo}>
      <Text style={styles.songTitle}>{item.title}</Text>
      <View style={styles.songMeta}>
        <Ionicons name="play" size={12} color="#888" />
        <Text style={styles.songArtist}> {item.plays}</Text>
        <Text style={styles.songArtist}> • {item.duration}</Text>
      </View>
    </View>
    <TouchableOpacity>
      <Feather name="more-horizontal" size={24} color="#888" />
    </TouchableOpacity>
  </TouchableOpacity>
);

// ──────────────────────────────
// Màn hình chính PlaylistScreen
// ──────────────────────────────
export default function PlaylistScreen({ navigation, route }: Props) {
  const { title, artwork, playlistId } = route.params;

  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!playlistId) {
      console.error("❌ Không có playlistId được truyền vào PlaylistScreen!");
      setLoading(false);
      return;
    }

    const fetchPlaylistSongs = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_BASE_URL}/${playlistId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Song[] = await response.json();

        // Chuẩn hóa artwork
        const formattedSongs = data.map((song) => ({
          ...song,
          artwork: getAssetImage(song.artworkKey ?? ""),
        }));

        setSongs(formattedSongs);
      } catch (error) {
        console.error("⚠️ Lỗi khi tải dữ liệu playlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistSongs();
  }, [playlistId]);

  const handleSongPress = (song: Song) => {
    navigation.navigate("Player", { song });
  };

  // ──────────────────────────────
  // Header của playlist
  // ──────────────────────────────
  const PlaylistHeader = () => (
    <View style={styles.headerContainer}>
      <Image source={artwork} style={styles.playlistImage} />
      <Text style={styles.playlistTitle}>{title}</Text>
      <View style={styles.statsRow}>
        <Ionicons name="heart-outline" size={18} color="#1ED760" />
        <Text style={styles.playlistStats}> 1,234 • 05:10:18</Text>
      </View>
      <Text style={styles.subtitle}>Daily chart-toppers update</Text>

      <View style={styles.controls}>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={28} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="more-horizontal" size={28} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="shuffle" size={28} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => songs.length > 0 && handleSongPress(songs[0])}
        >
          <Ionicons name="play" size={32} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // ──────────────────────────────
  // Loading Screen
  // ──────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerScreen]}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header trên cùng */}
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="cast" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Danh sách bài hát */}
      <FlatList
        data={songs}
        renderItem={({ item }) => (
          <SongItem item={item} onPress={() => handleSongPress(item)} />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<PlaylistHeader />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// ──────────────────────────────
// Styles
// ──────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  centerScreen: {
    justifyContent: "center",
    alignItems: "center",
  },
  customHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerContainer: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  playlistImage: {
    width: 160,
    height: 160,
    borderRadius: 12,
    marginBottom: 15,
  },
  playlistTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  playlistStats: {
    fontSize: 14,
    color: "#888",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  songArt: {
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
    marginBottom: 4,
  },
  songMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  songArtist: {
    fontSize: 13,
    color: "#888",
  },
});

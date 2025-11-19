// screens/LibraryPlaylistDetailScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { Song } from "../interfaces/data";
import { getAssetImage } from "../utils/ImageManager";

type DetailRouteProp = RouteProp<RootStackParamList, "LibraryPlaylistDetail">;

// 1. DỮ LIỆU GIẢ LẬP
const MOCK_DATABASE_SONGS: Song[] = [
  {
    id: "12",
    title: "FLOWER",
    artist: "Jisoo",
    artworkKey: "image_872681",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    duration: "3:36",
    plays: "2.1M",
  },
  {
    id: "1",
    title: "Don't Start Now",
    artist: "Dua Lipa",
    artworkKey: "song_50",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "3:03",
    plays: "1.2B",
  },
  {
    id: "2",
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    artworkKey: "song_51",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "2:54",
    plays: "980M",
  },
  {
    id: "3",
    title: "Levitating",
    artist: "Dua Lipa",
    artworkKey: "song_52",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "3:23",
    plays: "500M",
  },
  {
    id: "4",
    title: "Peaches",
    artist: "Justin Bieber",
    artworkKey: "song_54",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    duration: "3:18",
    plays: "850M",
  },
  {
    id: "6",
    title: "Shape of You",
    artist: "Ed Sheeran",
    artworkKey: "search_song_102",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    duration: "3:53",
    plays: "3.1B",
  },
  {
    id: "7",
    title: "Blinding Lights",
    artist: "The Weeknd",
    artworkKey: "search_song_103",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    duration: "3:20",
    plays: "2.9B",
  },
  {
    id: "8",
    title: "Stay",
    artist: "Kid LAROI & Justin Bieber",
    artworkKey: "search_song_104",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    duration: "2:21",
    plays: "2.5B",
  },
  {
    id: "10",
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    artworkKey: "search_song_106",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    duration: "2:58",
    plays: "1.6B",
  },
  {
    id: "14",
    title: "Bad Habits",
    artist: "Ed Sheeran",
    artworkKey: "chart_32",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
    duration: "3:51",
    plays: "1.1B",
  },
  {
    id: "15",
    title: "Butter",
    artist: "BTS",
    artworkKey: "album_45",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
    duration: "2:44",
    plays: "800M",
  },
  {
    id: "20",
    title: "Drivers License",
    artist: "Olivia Rodrigo",
    artworkKey: "song_40",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    duration: "4:02",
    plays: "1.7B",
  },
];

// 2. COMPONENT ITEM BÀI HÁT
const SongItem = ({ item }: { item: Song }) => (
  <TouchableOpacity style={styles.songItem}>
    <Image
      source={
        item.artworkKey
          ? getAssetImage(item.artworkKey)
          : require("../assets/Home - Audio Listing/Suggestions for you.png")
      }
      style={styles.songArt}
    />
    <View style={styles.songInfo}>
      <Text style={styles.songTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <View style={styles.songMeta}>
        <Ionicons
          name="play"
          size={10}
          color="#6B7280"
          style={{ marginRight: 4 }}
        />
        <Text style={styles.songMetaText}>{item.plays || "0"}</Text>
        <View style={styles.metaDot} />
        <Text style={styles.songMetaText}>{item.duration}</Text>
      </View>
    </View>
    <TouchableOpacity>
      <Feather name="more-horizontal" size={24} color="#9CA3AF" />
    </TouchableOpacity>
  </TouchableOpacity>
);

export default function LibraryPlaylistDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<DetailRouteProp>();

  const { playlistId, title, artwork, artworkKey, artworkColor } = route.params;

  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [addingSongId, setAddingSongId] = useState<string | null>(null);

  useEffect(() => {
    fetchPlaylistSongs();
  }, [playlistId]);

  // --- LOGIC LẤY DỮ LIỆU ---
  const fetchPlaylistSongs = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // ✅ Lấy 3 bài đầu tiên làm mẫu
      const initialSongs = MOCK_DATABASE_SONGS.slice(0, 3);

      setSongs(initialSongs);
    } catch (error) {
      console.error("Error fetching playlist songs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSongsToAdd = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      // Lọc những bài chưa có trong playlist
      const currentIds = new Set(songs.map((s) => s.id));
      const available = MOCK_DATABASE_SONGS.filter(
        (s) => !currentIds.has(s.id)
      );
      setAllSongs(available);
    } catch (error) {
      console.error("Error fetching all songs:", error);
    }
  };

  const handleOpenAddModal = () => {
    fetchSongsToAdd();
    setAddModalVisible(true);
  };

  const handleAddSong = async (song: Song) => {
    try {
      setAddingSongId(song.id);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSongs((prev) => [...prev, song]);
      setAllSongs((prev) => prev.filter((s) => s.id !== song.id));
      setAddingSongId(null);
      
      // ✅ Đóng modal ngay sau khi thêm thành công
      setAddModalVisible(false);
      
      Alert.alert("Success", `Added "${song.title}" to playlist`);
    } catch (error) {
      Alert.alert("Error", "Failed to add song");
      setAddingSongId(null);
    }
  };

  // --- HEADER COMPONENT ---
  const PlaylistHeader = () => (
    <View style={styles.headerContainer}>
      {artworkKey ? (
        <Image
          source={getAssetImage(artworkKey)}
          style={styles.playlistImage}
        />
      ) : (
        <View
          style={[
            styles.playlistImagePlaceholder,
            { backgroundColor: artworkColor || "#9CA3AF" },
          ]}
        >
          <Text style={styles.artworkEmoji}>{artwork || "🎵"}</Text>
        </View>
      )}

      <Text style={styles.playlistTitle}>{title}</Text>

      <View style={styles.controls}>
        <TouchableOpacity>
          <Feather name="more-horizontal" size={28} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="shuffle" size={28} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playButton}
          onPress={() => Alert.alert("Play", "Playing playlist...")}
        >
          <Ionicons
            name="play"
            size={32}
            color="#FFF"
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  // --- ITEM TRONG MODAL ADD SONG ---
  const renderAddableSongItem = ({ item }: { item: Song }) => (
    <TouchableOpacity
      style={styles.addSongItem}
      onPress={() => handleAddSong(item)}
      disabled={addingSongId === item.id}
    >
      <Image
        source={
          item.artworkKey
            ? getAssetImage(item.artworkKey)
            : require("../assets/Home - Audio Listing/Image 45.png")
        }
        style={styles.addSongImage}
      />
      <View style={styles.addSongInfo}>
        <Text style={styles.addSongTitle}>{item.title}</Text>
        <Text style={styles.addSongArtist}>{item.artist}</Text>
      </View>

      {addingSongId === item.id ? (
        <ActivityIndicator size="small" color="#00AFFF" />
      ) : (
        <Ionicons name="add-circle-outline" size={28} color="#00AFFF" />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerScreen]}>
        <ActivityIndicator size="large" color="#00AFFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleOpenAddModal}>
          <Ionicons name="add" size={32} color="#00AFFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={songs}
        renderItem={({ item }) => <SongItem item={item} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<PlaylistHeader />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        ListEmptyComponent={
          <View style={styles.centerScreen}>
            <Text style={{ color: "#888", marginTop: 20 }}>No songs yet</Text>
            <TouchableOpacity onPress={handleOpenAddModal}>
              <Text
                style={{ color: "#00AFFF", fontWeight: "600", marginTop: 8 }}
              >
                Add Songs
              </Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* MODAL */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add to Playlist</Text>
            <TouchableOpacity onPress={() => setAddModalVisible(false)}>
              <Text style={styles.modalDone}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <Text style={styles.searchPlaceholder}>Search songs...</Text>
          </View>

          <FlatList
            data={allSongs}
            keyExtractor={(item) => item.id}
            renderItem={renderAddableSongItem}
            contentContainerStyle={{ padding: 16 }}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  centerScreen: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  playlistImage: {
    width: 200,
    height: 200,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  playlistImagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 20,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  artworkEmoji: { fontSize: 80 },
  playlistTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 16,
    textAlign: "center",
    color: "#111827",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 40,
    marginTop: 8,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    // ✅ ĐÃ XÓA CÁC THUỘC TÍNH ĐỔ BÓNG (SHADOW)
  },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  songArt: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 14,
    backgroundColor: "#F3F4F6",
  },
  songInfo: {
    flex: 1,
    justifyContent: "center",
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    color: "#000",
  },
  songMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  songMetaText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#9CA3AF",
    marginHorizontal: 6,
  },
  modalContainer: { flex: 1, backgroundColor: "#FFF" },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: { fontSize: 17, fontWeight: "700" },
  modalDone: { fontSize: 16, color: "#00AFFF", fontWeight: "600" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    margin: 16,
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  searchPlaceholder: { color: "#9CA3AF", fontSize: 15 },
  addSongItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F9FAFB",
  },
  addSongImage: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
  addSongInfo: { flex: 1 },
  addSongTitle: { fontSize: 15, fontWeight: "600", color: "#1F2937" },
  addSongArtist: { fontSize: 13, color: "#6B7280" },
});
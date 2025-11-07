// screens/LibraryScreen.tsx - HOÀN CHỈNH (SẠCH CODE)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Song, Playlist } from "../interfaces/data";
import { API_BASE_URL } from "../config";
import { getAssetImage } from "../utils/ImageManager";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";

// ======= INTERFACES =======
interface LibrarySong extends Omit<Song, "duration"> {
  duration?: string;
  artworkKey?: string;
  artworkColor?: string;
  artwork?: string;
  isFavorite?: boolean;
}

interface LibraryPlaylist extends Playlist {
  artist: string;
  artworkKey?: string;
  artworkColor?: string;
  artwork?: string;
}

interface LibraryItemProps {
  item: LibrarySong;
  onToggleFavorite?: (id: string) => void;
  onPress?: (song: LibrarySong) => void;
}

// ======= COMPONENT: LibraryItem =======
function LibraryItem({ item, onToggleFavorite, onPress }: LibraryItemProps) {
  return (
    <View style={styles.libraryItem}>
      <TouchableOpacity
        style={styles.itemPressableArea}
        onPress={() => onPress?.(item)}
      >
        {item.artworkKey ? (
          <Image
            source={getAssetImage(item.artworkKey)}
            style={styles.artworkImage}
          />
        ) : (
          <View
            style={[styles.artwork, { backgroundColor: item.artworkColor }]}
          >
            <Text style={styles.artworkEmoji}>{item.artwork}</Text>
          </View>
        )}

        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <View style={styles.itemMeta}>
            <Text style={styles.itemArtist}>{item.artist}</Text>
            <View style={styles.metaDot} />
            <Ionicons name="play" size={10} color="#6B7280" />
            <Text style={styles.itemStats}>{item.plays}</Text>
            <View style={styles.metaDot} />
            <Text style={styles.itemStats}>{item.duration}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {item.isFavorite !== undefined && (
        <TouchableOpacity onPress={() => onToggleFavorite?.(item.id)}>
          <Ionicons
            name={item.isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={item.isFavorite ? "#00D9FF" : "#9CA3AF"}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

// ======= COMPONENT: PlaylistItem =======
interface PlaylistItemProps {
  item: LibraryPlaylist;
  onPress?: () => void;
}

function PlaylistItem({ item, onPress }: PlaylistItemProps) {
  return (
    <TouchableOpacity style={styles.playlistItem} onPress={onPress}>
      {item.artworkKey ? (
        <Image
          source={getAssetImage(item.artworkKey)}
          style={styles.playlistArtworkImage}
        />
      ) : (
        <View
          style={[styles.playlistArtwork, { backgroundColor: item.artworkColor }]}
        >
          <Text style={styles.playlistArtworkEmoji}>{item.artwork}</Text>
        </View>
      )}
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistTitle}>{item.title}</Text>
        <View style={styles.playlistMeta}>
          <Text style={styles.playlistArtist}>{item.artist}</Text>
          <View style={styles.metaDot} />
          <Text style={styles.playlistArtist}>{item.songCount} songs</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

// ======= COMPONENT: LibraryScreen =======
export default function LibraryScreen() {
  type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<RootStackNavigationProp>();

  const [activeTab, setActiveTab] = useState<"main" | "playlists">("main");
  const [songs, setSongs] = useState<LibrarySong[]>([]);
  const [playlists, setPlaylists] = useState<LibraryPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [songsRes, playlistsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/library-songs`),
          fetch(`${API_BASE_URL}/library-playlists`),
        ]);
        const songsData = await songsRes.json();
        const playlistsData = await playlistsRes.json();

        setSongs(songsData);
        setPlaylists(playlistsData);

        const favIds = songsData
          .filter((s: LibrarySong) => s.isFavorite)
          .map((s: LibrarySong) => s.id);
        setFavorites(new Set(favIds));
      } catch (error) {
        console.error("Lỗi tải dữ liệu Library:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const tabs = [
    { key: "playlists", label: "Playlists" },
    { key: "new-tag", label: "New tag" },
    { key: "songs", label: "Songs" },
    { key: "albums", label: "Albums" },
    { key: "artists", label: "Artists" },
  ];

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handlePlaylistPress = () => setActiveTab("playlists");
  const handleBackPress = () => setActiveTab("main");

  const handleSongPress = (song: LibrarySong) => {
    navigation.navigate("Player", { song });
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { justifyContent: "center", alignItems: "center" }]}
      >
        <ActivityIndicator size="large" color="#00AFFF" />
      </SafeAreaView>
    );
  }

  if (activeTab === "playlists") {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Playlists</Text>
          <TouchableOpacity>
            <Ionicons name="scan-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Your playlists</Text>
          {playlists.map((playlist) => (
            <PlaylistItem key={playlist.id} item={playlist} />
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={32} color="#FFF" />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Library</Text>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={tab.key === "playlists" ? handlePlaylistPress : undefined}
          >
            <Text style={styles.tabText}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content}>
        {songs.map((item) => (
          <LibraryItem
            key={item.id}
            item={{ ...item, isFavorite: favorites.has(item.id) }}
            onToggleFavorite={handleToggleFavorite}
            onPress={handleSongPress}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ======= STYLES =======
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    flex: 1,
    textAlign: "center",
  },
  tabsContainer: {
    maxHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  libraryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 12,
  },
  itemPressableArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  artworkImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  artwork: {
    width: 56,
    height: 56,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  artworkEmoji: {
    fontSize: 24,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 4,
  },
  itemMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  itemArtist: {
    fontSize: 13,
    color: "#6B7280",
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#9CA3AF",
  },
  itemStats: {
    fontSize: 13,
    color: "#6B7280",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  playlistArtworkImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  playlistArtwork: {
    width: 56,
    height: 56,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  playlistArtworkEmoji: {
    fontSize: 24,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 4,
  },
  playlistMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  playlistArtist: {
    fontSize: 13,
    color: "#6B7280",
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1F2937",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

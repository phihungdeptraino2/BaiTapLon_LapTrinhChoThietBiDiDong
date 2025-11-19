import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Image,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Song, Playlist } from "../interfaces/data";
import { API_BASE_URL } from "../config";
import { getAssetImage } from "../utils/ImageManager";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
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

interface LibraryArtist {
  id: string;
  name: string;
  avatarKey?: string;
  followers: string;
}

interface LibraryTag {
  id: string;
  name: string;
  songCount: number;
  color: string;
}

interface LibraryAlbum {
  id: string;
  title: string;
  artist: string;
  artworkKey?: string;
  songs?: number;
}

interface LibraryItemProps {
  item: LibrarySong;
  onToggleFavorite?: (id: string) => void;
  onPress?: (song: LibrarySong) => void;
}

// ======= COMPONENTS =======
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

function PlaylistItem({
  item,
  onPress,
}: {
  item: LibraryPlaylist;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.playlistItem} onPress={onPress}>
      {item.artworkKey ? (
        <Image
          source={getAssetImage(item.artworkKey)}
          style={styles.playlistArtworkImage}
        />
      ) : (
        <View
          style={[
            styles.playlistArtwork,
            { backgroundColor: item.artworkColor },
          ]}
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

function AlbumItem({
  item,
  onPress,
}: {
  item: LibraryAlbum;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.albumItem} onPress={onPress}>
      {item.artworkKey ? (
        <Image
          source={getAssetImage(item.artworkKey)}
          style={styles.albumArtworkImage}
        />
      ) : (
        <View style={[styles.albumArtwork, { backgroundColor: "#9CA3AF" }]}>
          <Ionicons name="disc-outline" size={24} color="#FFFFFF" />
        </View>
      )}
      <View style={styles.albumInfo}>
        <Text style={styles.albumTitle}>{item.title}</Text>
        <Text style={styles.albumArtist}>{item.artist}</Text>
        <Text style={styles.albumSongs}>{item.songs || 0} songs</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

function ArtistItem({
  item,
  onPress,
}: {
  item: LibraryArtist;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.artistItem} onPress={onPress}>
      <Image
        source={getAssetImage(item.avatarKey || "artist_39")}
        style={styles.artistAvatar}
      />
      <View style={styles.artistInfo}>
        <Text style={styles.artistName}>{item.name}</Text>
        <Text style={styles.artistFollowers}>{item.followers} Followers</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

function TagItem({
  item,
  onPress,
}: {
  item: LibraryTag;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.tagItem, { backgroundColor: item.color }]}
      onPress={onPress}
    >
      <View>
        <Text style={styles.tagName}>{item.name}</Text>
        <Text style={styles.tagCount}>{item.songCount} songs</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

function AddModal({
  visible,
  onClose,
  onSelectPlaylist,
  onSelectArtist,
}: {
  visible: boolean;
  onClose: () => void;
  onSelectPlaylist: () => void;
  onSelectArtist: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>What would you like to add?</Text>

          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => {
              onSelectPlaylist();
              onClose();
            }}
          >
            <Ionicons name="list-outline" size={24} color="#00AFFF" />
            <View style={styles.modalOptionText}>
              <Text style={styles.modalOptionTitle}>Add Playlist</Text>
              <Text style={styles.modalOptionDesc}>Create a new playlist</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => {
              onSelectArtist();
              onClose();
            }}
          >
            <Ionicons name="person-outline" size={24} color="#00AFFF" />
            <View style={styles.modalOptionText}>
              <Text style={styles.modalOptionTitle}>Add Artist</Text>
              <Text style={styles.modalOptionDesc}>Follow a new artist</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modalOption,
              {
                borderTopWidth: 1,
                borderTopColor: "#E5E7EB",
                marginTop: 10,
                paddingTop: 10,
              },
            ]}
            onPress={onClose}
          >
            <Text style={styles.modalCancel}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ======= LibraryScreen =======
export default function LibraryScreen() {
  type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<RootStackNavigationProp>();

  // Mặc định tab là "playlists"
  const [activeTab, setActiveTab] = useState<
    "playlists" | "tags" | "songs" | "albums" | "artists"
  >("playlists");

  const [songs, setSongs] = useState<LibrarySong[]>([]);
  const [playlists, setPlaylists] = useState<LibraryPlaylist[]>([]);
  const [artists, setArtists] = useState<LibraryArtist[]>([]);
  const [albums, setAlbums] = useState<LibraryAlbum[]>([]);
  const [tags, setTags] = useState<LibraryTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [songsRes, playlistsRes, artistsRes, albumsRes] = await Promise.all(
        [
          fetch(`${API_BASE_URL}/library-songs`),
          fetch(`${API_BASE_URL}/library-playlists`),
          fetch(`${API_BASE_URL}/artists`),
          fetch(`${API_BASE_URL}/albums`),
        ]
      );

      const songsData = await songsRes.json();
      const playlistsData = await playlistsRes.json();
      const artistsData = await artistsRes.json();
      const albumsData = await albumsRes.json();

      setSongs(songsData);
      setPlaylists(playlistsData);
      setArtists(artistsData);
      setAlbums(albumsData);

      setTags([
        { id: "1", name: "Workout", songCount: 24, color: "#FF6B6B" },
        { id: "2", name: "Chill", songCount: 18, color: "#4ECDC4" },
        { id: "3", name: "Study", songCount: 32, color: "#95E1D3" },
      ]);

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

  // Load lại data khi quay lại màn hình (quan trọng để thấy playlist/artist mới tạo)
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const tabs = [
    { key: "playlists" as const, label: "Playlists", icon: "list-outline" },
    { key: "tags" as const, label: "New tag", icon: "pricetag-outline" },
    { key: "songs" as const, label: "Songs", icon: "musical-notes-outline" },
    { key: "albums" as const, label: "Albums", icon: "disc-outline" },
    { key: "artists" as const, label: "Artists", icon: "person-outline" },
  ];

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleSongPress = (song: LibrarySong) => {
    navigation.navigate("Player", { song: song as Song });
  };

  const handleAddPlaylist = () => {
    navigation.navigate("AddPlaylist");
  };

  const handleAddArtist = () => {
    navigation.navigate("AddArtist");
  };

  if (loading) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={["top", "left", "right", "bottom"]}
      >
        <ActivityIndicator size="large" color="#00AFFF" />
      </SafeAreaView>
    );
  }

  const getCurrentTitle = () => {
    switch (activeTab) {
      case "playlists":
        return "Your playlists";
      case "tags":
        return "Tags";
      case "songs":
        return "Your songs";
      case "albums":
        return "Your albums";
      case "artists":
        return "Your artists";
      default:
        return "";
    }
  };

  const renderContentItems = () => {
    switch (activeTab) {
      case "playlists":
        return (
          <>
            {playlists.map((playlist) => (
              <PlaylistItem
                key={playlist.id}
                item={playlist}
                onPress={() =>
                  // CHUYỂN HƯỚNG SANG MÀN HÌNH CHI TIẾT MỚI
                  navigation.navigate("LibraryPlaylistDetail", {
                    playlistId: playlist.id,
                    title: playlist.title,
                    artwork: playlist.artwork,
                    artworkKey: playlist.artworkKey,
                    artworkColor: playlist.artworkColor,
                  })
                }
              />
            ))}
          </>
        );
      case "tags":
        return (
          <>
            {tags.map((tag) => (
              <TagItem key={tag.id} item={tag} />
            ))}
          </>
        );
      case "songs":
        return (
          <>
            {songs.map((item) => (
              <LibraryItem
                key={item.id}
                item={{ ...item, isFavorite: favorites.has(item.id) }}
                onToggleFavorite={handleToggleFavorite}
                onPress={handleSongPress}
              />
            ))}
          </>
        );
      case "albums":
        return (
          <>
            {albums.map((album) => (
              <AlbumItem
                key={album.id}
                item={album}
                onPress={() => alert(`Album: ${album.title}`)}
              />
            ))}
          </>
        );
      case "artists":
        return (
          <>
            {artists.map((artist) => (
              <ArtistItem
                key={artist.id}
                item={artist}
                onPress={() =>
                  navigation.navigate("Artist", {
                    artist: {
                      id: artist.id,
                      name: artist.name,
                      avatar: artist.avatarKey,
                    },
                  })
                }
              />
            ))}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" translucent={false} />

      {/* Header Cố định */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Library</Text>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Tabs Cố định */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
          contentInsetAdjustmentBehavior="never"
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Ionicons
                name={tab.icon as any}
                size={16}
                color={activeTab === tab.key ? "#00AFFF" : "#9CA3AF"}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Nội dung cuộn */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 100 }}
        contentInsetAdjustmentBehavior="never"
      >
        <Text style={styles.sectionTitle}>{getCurrentTitle()}</Text>
        {renderContentItems()}
      </ScrollView>

      {/* Nút Add nổi */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      <AddModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSelectPlaylist={handleAddPlaylist}
        onSelectArtist={handleAddArtist}
      />
    </SafeAreaView>
  );
}

// ======= STYLES =======
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 56,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827", flex: 1 },

  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    flexGrow: 0,
  },
  tabsContent: { paddingHorizontal: 12, alignItems: "center" },
  tab: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  tabActive: { backgroundColor: "#E0F2FE" },
  tabText: { fontSize: 14, fontWeight: "500", color: "#6B7280" },
  tabTextActive: { color: "#00AFFF", fontWeight: "600" },

  content: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    paddingHorizontal: 16,
    marginBottom: 8,
    marginTop: 12,
  },

  libraryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemPressableArea: { flex: 1, flexDirection: "row", alignItems: "center" },
  artworkImage: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
  artwork: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  artworkEmoji: { fontSize: 24 },
  itemInfo: { flex: 1 },
  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 3,
  },
  itemMeta: { flexDirection: "row", alignItems: "center" },
  itemArtist: { fontSize: 12, color: "#6B7280", marginRight: 6 },
  metaDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#9CA3AF",
    marginHorizontal: 4,
  },
  itemStats: { fontSize: 12, color: "#6B7280", marginLeft: 4 },

  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  playlistArtworkImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  playlistArtwork: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  playlistArtworkEmoji: { fontSize: 24 },
  playlistInfo: { flex: 1 },
  playlistTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 3,
  },
  playlistMeta: { flexDirection: "row", alignItems: "center" },
  playlistArtist: { fontSize: 12, color: "#6B7280", marginRight: 6 },

  tagItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginVertical: 6,
    borderRadius: 12,
  },
  tagName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  tagCount: { fontSize: 12, color: "rgba(255,255,255,0.8)" },

  albumItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  albumArtworkImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  albumArtwork: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  albumInfo: { flex: 1 },
  albumTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  albumArtist: { fontSize: 12, color: "#6B7280", marginBottom: 2 },
  albumSongs: { fontSize: 11, color: "#9CA3AF" },

  artistItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  artistAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  artistInfo: { flex: 1 },
  artistName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  artistFollowers: { fontSize: 12, color: "#6B7280" },

  addButton: {
    position: "absolute",
    right: 20,
    bottom: 40,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#00AFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 20,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    marginBottom: 12,
  },
  modalOptionText: { flex: 1, marginLeft: 12 },
  modalOptionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  modalOptionDesc: { fontSize: 12, color: "#6B7280" },
  modalCancel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
    textAlign: "center",
    paddingVertical: 8,
  },
});

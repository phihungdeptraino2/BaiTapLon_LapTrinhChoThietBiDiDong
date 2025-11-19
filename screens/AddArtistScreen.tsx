// screens/AddArtistScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { getAssetImage } from "../utils/ImageManager";
import { API_BASE_URL } from "../config";

type AddArtistScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddArtist"
>;

interface ArtistItem {
  id: string;
  name: string;
  followers: string;
  avatarKey: string;
  verified?: boolean;
}

export default function AddArtistScreen() {
  const navigation = useNavigation<AddArtistScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState("");
  const [allArtists, setAllArtists] = useState<ArtistItem[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<ArtistItem[]>([]);
  const [followedArtists, setFollowedArtists] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchAllArtists();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setSearching(true);
      const filtered = allArtists.filter((artist) =>
        artist.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredArtists(filtered);
      setSearching(false);
    } else {
      setFilteredArtists(allArtists);
    }
  }, [searchQuery]);

  const fetchAllArtists = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/artists`);
      const data = await response.json();
      setAllArtists(data);
      setFilteredArtists(data);
    } catch (error) {
      console.error("Error fetching artists:", error);
      // Fallback: dùng mock data
      const mockArtists: ArtistItem[] = [
        {
          id: "artist_1",
          name: "Jennifer Wilson",
          followers: "65.1K",
          avatarKey: "artist_39",
          verified: true,
        },
        {
          id: "artist_2",
          name: "Elizabeth Hall",
          followers: "12.3K",
          avatarKey: "artist_40",
        },
        {
          id: "artist_3",
          name: "Mer Watson",
          followers: "1.234K",
          avatarKey: "search_artist_101",
        },
        {
          id: "artist_4",
          name: "Jessica Gonzalez",
          followers: "2.1M",
          avatarKey: "album_45",
        },
        {
          id: "artist_5",
          name: "Anthony Taylor",
          followers: "68M",
          avatarKey: "album_46",
        },
        {
          id: "artist_6",
          name: "Brian Bailey",
          followers: "93M",
          avatarKey: "song_47",
        },
      ];
      setAllArtists(mockArtists);
      setFilteredArtists(mockArtists);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowArtist = async (artist: ArtistItem) => {
    try {
      const isFollowed = followedArtists.has(artist.id);

      if (isFollowed) {
        // Unfollow
        const newSet = new Set(followedArtists);
        newSet.delete(artist.id);
        setFollowedArtists(newSet);

        Alert.alert("Success", `Unfollowed ${artist.name}`);
      } else {
        // Follow - lưu vào db.json
        const response = await fetch(`${API_BASE_URL}/followed-artists`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: artist.id,
            name: artist.name,
            followers: artist.followers,
            avatarKey: artist.avatarKey,
            verified: artist.verified,
          }),
        });

        if (response.ok) {
          const newSet = new Set(followedArtists);
          newSet.add(artist.id);
          setFollowedArtists(newSet);
          Alert.alert("Success", `Followed ${artist.name}!`);
        } else {
          Alert.alert("Error", "Failed to follow artist");
        }
      }
    } catch (error) {
      console.error("Error following artist:", error);
      Alert.alert("Error", "Failed to follow artist: " + error);
    }
  };

  const renderArtistItem = ({ item }: { item: ArtistItem }) => {
    const isFollowed = followedArtists.has(item.id);

    return (
      <View style={styles.artistItemContainer}>
        <Image
          source={getAssetImage(item.avatarKey)}
          style={styles.artistAvatar}
        />
        <View style={styles.artistInfo}>
          <View style={styles.artistNameRow}>
            <Text style={styles.artistName}>{item.name}</Text>
            {item.verified && (
              <Ionicons name="checkmark-circle" size={16} color="#00AFFF" />
            )}
          </View>
          <Text style={styles.artistFollowers}>{item.followers} Followers</Text>
        </View>
        <TouchableOpacity
          style={[styles.followButton, isFollowed && styles.followButtonActive]}
          onPress={() => handleFollowArtist(item)}
        >
          <Ionicons
            name={isFollowed ? "checkmark" : "add"}
            size={20}
            color={isFollowed ? "#00AFFF" : "#FFFFFF"}
          />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#00AFFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Follow Artists</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search artists..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Artists List */}
      {searching ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color="#00AFFF" />
        </View>
      ) : filteredArtists.length > 0 ? (
        <FlatList
          data={filteredArtists}
          keyExtractor={(item) => item.id}
          renderItem={renderArtistItem}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={48} color="#D1D5DB" />
          <Text style={styles.emptyStateText}>No artists found</Text>
          <Text style={styles.emptyStateDesc}>
            Try searching for a different artist
          </Text>
        </View>
      )}

      {/* Followed Summary */}
      {followedArtists.size > 0 && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            You followed {followedArtists.size} artist
            {followedArtists.size !== 1 ? "s" : ""}
          </Text>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 12,
    marginVertical: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 15,
    color: "#111827",
  },

  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  artistItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 6,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    gap: 12,
  },

  artistAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },

  artistInfo: {
    flex: 1,
  },

  artistNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },

  artistName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },

  artistFollowers: {
    fontSize: 12,
    color: "#6B7280",
  },

  followButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#00AFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  followButtonActive: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#00AFFF",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
  },

  emptyStateDesc: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
    textAlign: "center",
  },

  summaryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },

  summaryText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
    textAlign: "center",
  },

  doneButton: {
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#00AFFF",
    alignItems: "center",
  },

  doneButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

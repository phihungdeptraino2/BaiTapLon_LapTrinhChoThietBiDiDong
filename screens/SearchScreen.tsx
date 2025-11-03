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
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";

type NavigationProp = StackNavigationProp<RootStackParamList>;

// Mock data cho search suggestions
const SEARCH_SUGGESTIONS = [
  "Me",
  "me illum id aliquip",
  "me lorem",
  "Me Gonzalez",
  "Me irure esse",
  "Me Exercitation",
  "Me Sint aliquip duis deseru",
];

// Mock data cho search results
const SEARCH_RESULTS = {
  artists: [
    {
      id: "1",
      name: "Mer Watson",
      followers: "1.234K Followers",
      avatar: require("../assets/My Library/Image 101.png"),
      type: "artist",
    },
  ],
  songs: [
    {
      id: "2",
      title: "Me",
      artist: "Jessica Gonzalez",
      plays: "2.1M",
      duration: "3:36",
      artwork: require("../assets/My Library/Image 102.png"),
      type: "song",
    },
    {
      id: "3",
      title: "Me Inc",
      artist: "Anthony Taylor",
      plays: "68M",
      duration: "03:35",
      artwork: require("../assets/My Library/Image 103.png"),
      type: "song",
    },
    {
      id: "4",
      title: "Dozz me",
      artist: "Brian Bailey",
      plays: "93M",
      duration: "04:39",
      artwork: require("../assets/My Library/Image 104.png"),
      type: "song",
    },
    {
      id: "5",
      title: "Eastss me",
      artist: "Anthony Taylor",
      plays: "9M",
      duration: "07:48",
      artwork: require("../assets/My Library/Image 105.png"),
      type: "song",
    },
    {
      id: "6",
      title: "Me Ali",
      artist: "Pedro Moreno",
      plays: "23M",
      duration: "3:36",
      artwork: require("../assets/My Library/Image 106.png"),
      type: "song",
    },
    {
      id: "7",
      title: "Me quis a",
      artist: "Elena Jimenez",
      plays: "10M",
      duration: "06:22",
      artwork: require("../assets/My Library/Image 107.png"),
      type: "song",
    },
    {
      id: "8",
      title: "Me light",
      artist: "John Smith",
      plays: "81M",
      duration: "05:15",
      artwork: require("../assets/My Library/Image 107.png"),
      type: "song",
    },
  ],
};

type TabType = "All" | "Tracks" | "Albums" | "Artists";

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 0) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setShowResults(false);
    Keyboard.dismiss();
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowResults(true);
    Keyboard.dismiss();
  };

  const tabs: TabType[] = ["All", "Tracks", "Albums", "Artists"];

  // Render suggestion item (Image 1)
  const renderSuggestion = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item)}
    >
      <Text style={styles.suggestionText}>{item}</Text>
    </TouchableOpacity>
  );

  // Render artist result
  const renderArtistResult = (item: any) => (
    <TouchableOpacity
      style={styles.artistResult}
      onPress={() =>
        navigation.navigate("Artist", {
          artist: {
            id: item.id,
            name: item.name,
            avatar: item.avatar,
          },
        })
      }
    >
      <Image source={item.avatar} style={styles.artistAvatar} />
      <View style={styles.artistInfo}>
        <Text style={styles.artistName}>{item.name}</Text>
        <View style={styles.followerRow}>
          <Ionicons name="person-outline" size={14} color="#888" />
          <Text style={styles.followers}> {item.followers}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.followBtn}>
        <Text style={styles.followBtnText}>Follow</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Render song result
  const renderSongResult = (item: any) => (
    <TouchableOpacity
      style={styles.songResult}
      onPress={() =>
        navigation.navigate("Player", {
          song: {
            id: item.id,
            title: item.title,
            artist: item.artist,
            duration: item.duration,
            plays: item.plays,
            artwork: item.artwork,
          },
          playlist: SEARCH_RESULTS.songs.map((song) => ({
            id: song.id,
            title: song.title,
            artist: song.artist,
            duration: song.duration,
            plays: song.plays,
            artwork: song.artwork,
          })),
        })
      }
    >
      <Image source={item.artwork} style={styles.songArtwork} />
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
      <TouchableOpacity>
        <Feather name="more-horizontal" size={24} color="#888" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Render search results (Image 2)
  const renderSearchResult = ({ item }: { item: any }) => {
    if (item.type === "artist") {
      return renderArtistResult(item);
    }
    return renderSongResult(item);
  };

  const allResults = [...SEARCH_RESULTS.artists, ...SEARCH_RESULTS.songs];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="me"
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus={false}
            placeholderTextColor="#888"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Ionicons name="close-circle" size={22} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Show suggestions when typing (Image 1) */}
      {!showResults && (
        <FlatList
          data={SEARCH_SUGGESTIONS}
          renderItem={renderSuggestion}
          keyExtractor={(item, index) => index.toString()}
          style={styles.suggestionsList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Show results with tabs (Image 2) */}
      {showResults && (
        <View style={styles.resultsContainer}>
          {/* Tabs */}
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

          {/* Results List */}
          <FlatList
            data={allResults}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.resultsList}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

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

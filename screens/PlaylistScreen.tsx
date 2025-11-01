// screens/PlaylistScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { RootStackScreenProps } from "../navigation/types";
import { Song } from "../interfaces/data";
import { Ionicons, Feather } from "@expo/vector-icons";

const MOCK_SONGS: Song[] = [
  {
    id: "1",
    title: "FLOWER",
    artist: "Jessica Gonzalez",
    duration: "3:36",
    plays: "2.1M",
    artwork: require("../assets/Home - Audio Listing/Image 45.png"),
  },
  {
    id: "2",
    title: "Shape of You",
    artist: "Anthony Taylor",
    duration: "03:35",
    plays: "68M",
    artwork: require("../assets/Home - Audio Listing/Image 46.png"),
  },
  {
    id: "3",
    title: "Blinding Lights",
    artist: "Brian Bailey",
    duration: "04:39",
    plays: "93M",
    artwork: require("../assets/Home - Audio Listing/Image 47.png"),
  },
  {
    id: "4",
    title: "Levitating",
    artist: "Anthony Taylor",
    duration: "07:48",
    plays: "9M",
    artwork: require("../assets/Home - Audio Listing/Image 47.png"),
  },
  {
    id: "5",
    title: "Astronaut in the Ocean",
    artist: "Pedro Moreno",
    duration: "3:36",
    plays: "23M",
    artwork: require("../assets/Home - Audio Listing/Image 47.png"),
  },
  {
    id: "6",
    title: "Dynamite",
    artist: "Elena Jimenez",
    duration: "06:22",
    plays: "10M",
    artwork: require("../assets/Home - Audio Listing/Image 40.png"),
  },
];

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

type Props = RootStackScreenProps<"Playlist">;

export default function PlaylistScreen({ navigation, route }: Props) {
  const { title, artwork } = route.params;

  const handleSongPress = (song: Song) => {
    navigation.navigate("Player", {
      song,
      playlist: MOCK_SONGS,
    });
  };

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
          onPress={() => handleSongPress(MOCK_SONGS[0])}
        >
          <Ionicons name="play" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="cast" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={MOCK_SONGS}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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

// screens/ArtistScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from "react-native";
import { RootStackScreenProps } from "../navigation/types";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Song, Album } from "../interfaces/data";

type Props = RootStackScreenProps<"Artist">;

// Mock data cho bài hát Popular
const POPULAR_SONGS: Song[] = [
  {
    id: "1",
    title: "Let you Free",
    artist: "Ryan Young",
    duration: "3:36",
    plays: "2.1M",
    artwork: require("../assets/Playlist Details - Audio Listing/Image 50.png"),
    audioKey: "shape_of_you"
  },
  {
    id: "2",
    title: "Blinding Lights",
    artist: "Ryan Young",
    duration: "4:39",
    plays: "93M",
    artwork: require("../assets/Playlist Details - Audio Listing/Image 51.png"),
    audioKey: "shape_of_you"
  },
  {
    id: "3",
    title: "Levitating",
    artist: "Ryan Young",
    duration: "7:48",
    plays: "9M",
    artwork: require("../assets/Playlist Details - Audio Listing/Image 52.png"),
    audioKey: "shape_of_you"
  },
  {
    id: "4",
    title: "Astronaut in the Ocean",
    artist: "Ryan Young",
    duration: "3:36",
    plays: "23M",
    artwork: require("../assets/Playlist Details - Audio Listing/Image 54.png"),
    audioKey: "shape_of_you"
  },
  {
    id: "5",
    title: "Dynamite",
    artist: "Ryan Young",
    duration: "6:22",
    plays: "10M",
    artwork: require("../assets/Playlist Details - Audio Listing/Image 55.png"),
    audioKey: "shape_of_you"
  },
];

// Mock data cho Albums
const ARTIST_ALBUMS: Album[] = [
  {
    id: "1",
    title: "ME",
    artist: "Jessica Gonzalez",
    artwork: require("../assets/Artist Profile/Image 71.png"),
  },
  {
    id: "2",
    title: "Magna nost",
    artist: "Jessica Gonzalez",
    artwork: require("../assets/Artist Profile/Image 72.png"),
  },
  {
    id: "3",
    title: "Proident",
    artist: "Jessica",
    artwork: require("../assets/Artist Profile/Image 73.png"),
  },
];

// Mock data cho Fans also like
const FANS_ALSO_LIKE = [
  {
    id: "1",
    name: "Magna nost",
    artist: "Jessica Gonzalez",
    artwork: require("../assets/Artist Profile/Image 74.png"),
  },
  {
    id: "2",
    name: "Exercitatio",
    artist: "Brian Harris",
    artwork: require("../assets/Artist Profile/Image 75.png"),
  },
  {
    id: "3",
    name: "Tempor",
    artist: "Tyler Anderson",
    artwork: require("../assets/Artist Profile/Image 76.png"),
  },
];

export default function ArtistScreen({ navigation, route }: Props) {
  const { artist } = route.params;
  const [isFollowing, setIsFollowing] = useState(false);

  const SongItem = ({ item }: { item: Song }) => (
    <TouchableOpacity
      style={styles.songItem}
      onPress={() =>
        navigation.navigate("Player", { song: item, playlist: POPULAR_SONGS })
      }
    >
      <Image source={item.artwork} style={styles.songArtwork} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <View style={styles.songMeta}>
          <Ionicons name="play" size={12} color="#888" />
          <Text style={styles.songPlays}> {item.plays}</Text>
          <Text style={styles.songDuration}> • {item.duration}</Text>
        </View>
      </View>
      <TouchableOpacity>
        <Feather name="more-horizontal" size={24} color="#888" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const AlbumItem = ({ item }: { item: Album }) => (
    <View style={styles.albumItem}>
      <Image source={item.artwork} style={styles.albumArtwork} />
      <Text style={styles.albumTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.albumArtist} numberOfLines={1}>
        {item.artist}
      </Text>
    </View>
  );

  const FansAlsoLikeItem = ({ item }: { item: (typeof FANS_ALSO_LIKE)[0] }) => (
    <View style={styles.fansItem}>
      <Image source={item.artwork} style={styles.fansArtwork} />
      <Text style={styles.fansName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.fansArtist} numberOfLines={1}>
        {item.artist}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="more-horizontal" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Artist Info */}
        <View style={styles.artistInfo}>
          <Image source={artist.avatar} style={styles.artistAvatar} />
          <Text style={styles.artistName}>{artist.name}</Text>
          <Text style={styles.followers}>65.1K Followers</Text>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.followButton}
              onPress={() => setIsFollowing(!isFollowing)}
            >
              <Text style={styles.followButtonText}>
                {isFollowing ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.moreButton}>
              <Feather name="more-horizontal" size={20} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.shuffleButton}>
              <Ionicons name="shuffle" size={20} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Popular Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular</Text>
          {POPULAR_SONGS.map((song) => (
            <SongItem key={song.id} item={song} />
          ))}
        </View>

        {/* Albums Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Albums</Text>
          <FlatList
            data={ARTIST_ALBUMS}
            renderItem={({ item }) => <AlbumItem item={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Image
            source={require("../assets/Artist Profile/Image 73.png")}
            style={styles.aboutImage}
          />
          <Text style={styles.aboutText}>
            Do in cupidatat aute et in officia aute laboris est Lorem est nisi
            dolor consequat voluptate duis irure. Veniam quis amet irure cillum
            elit aliquip sunt cillum cillum do aliqua voluptate ad id.
          </Text>
          <TouchableOpacity>
            <Text style={styles.viewMore}>View more</Text>
          </TouchableOpacity>
        </View>

        {/* Fans Also Like Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fans also like</Text>
          <FlatList
            data={FANS_ALSO_LIKE}
            renderItem={({ item }) => <FansAlsoLikeItem item={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  artistInfo: {
    alignItems: "center",
    paddingVertical: 20,
  },
  artistAvatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 15,
  },
  artistName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  followers: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  followButton: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  shuffleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    paddingHorizontal: 15,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  songArtwork: {
    width: 50,
    height: 50,
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
  songPlays: {
    fontSize: 13,
    color: "#888",
  },
  songDuration: {
    fontSize: 13,
    color: "#888",
  },
  horizontalList: {
    paddingRight: 15,
  },
  albumItem: {
    width: 120,
    marginRight: 15,
  },
  albumArtwork: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  albumTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  albumArtist: {
    fontSize: 12,
    color: "#888",
  },
  aboutImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  viewMore: {
    fontSize: 14,
    color: "#00AFFF",
    fontWeight: "600",
  },
  fansItem: {
    width: 120,
    marginRight: 15,
  },
  fansArtwork: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  fansName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  fansArtist: {
    fontSize: 12,
    color: "#888",
  },
});

// screens/HomeScreen.tsx
import React from "react";
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
} from "react-native";
// 1. Import types mới
import { MainTabScreenProps, RootStackParamList } from "../navigation/types";
import { Chart, Album, Artist } from "../interfaces/data";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
// 2. Import LinearGradient
import { LinearGradient } from "expo-linear-gradient";

// 3. Định nghĩa kiểu cho navigation
type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
type Props = MainTabScreenProps<"Home">;

// 4. --- DỮ LIỆU MẪU (THAY BẰNG ẢNH CỦA BẠN) ---
const MOCK_AVATAR = require("../assets/Home - Audio Listing/Avatar 3.png");

const MOCK_SUGGESTIONS = [
  {
    id: "1",
    title: "Reflection",
    artist: "Christina Aguilera",
    artwork: require("../assets/Home - Audio Listing/Container 26.png"),
  },
  {
    id: "2",
    title: "In The Stars",
    artist: "Benson Boone",
    artwork: require("../assets/Home - Audio Listing/Container 27.png"),
  },
  {
    id: "3",
    title: "In The Stars",
    artist: "Benson Boone",
    artwork: require("../assets/Home - Audio Listing/Container 27.png"),
  },
  {
    id: "4",
    title: "In The Stars",
    artist: "Benson Boone",
    artwork: require("../assets/Home - Audio Listing/Container 27.png"),
  },
];

const MOCK_CHARTS: Chart[] = [
  {
    id: "1",
    title: "Top 50",
    subtitle: "Canada",
    artwork: ["#6E16B0", "#B0168C"], // Màu gradient
  },
  {
    id: "2",
    title: "Top 50",
    subtitle: "Global",
    artwork: ["#16A1B0", "#16B09F"], // Màu gradient
  },
  {
    id: "3",
    title: "Top 50",
    subtitle: "Daily",
    artwork: ["#B06216", "#B09616"], // Màu gradient
  },
];

const MOCK_ALBUMS: Album[] = [
  {
    id: "1",
    title: "ME",
    artist: "Jessica Gonzalez",
    artwork: require("../assets/Home - Audio Listing/Image 45.png"),
  },
  {
    id: "2",
    title: "Magna nost",
    artist: "Brian Thomas",
    artwork: require("../assets/Home - Audio Listing/Image 46.png"),
  },
];

const MOCK_ARTISTS: Artist[] = [
  {
    id: "1",
    name: "Jennifer Wilson",
    avatar: require("../assets/Home - Audio Listing/Image 39.png"),
  },
  {
    id: "2",
    name: "Elizabeth Hall",
    avatar: require("../assets/Home - Audio Listing/Image 40.png"),
  },
];
// ---------------------------------------------

export default function HomeScreen({ navigation }: Props) {
  const rootStackNavigation = useNavigation<RootStackNavigationProp>();

  // Hàm render tiêu đề section (với nút "See all")
  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity>
        <Text style={styles.seeAll}>See all</Text>
      </TouchableOpacity>
    </View>
  );

  // --- CÁC HÀM RENDER ITEM CHO FLATLIST ---

  const renderSuggestionCard = ({
    item,
  }: {
    item: (typeof MOCK_SUGGESTIONS)[0];
  }) => (
    <TouchableOpacity style={styles.suggestionCard}>
      <ImageBackground
        source={item.artwork}
        style={styles.suggestionImage}
        imageStyle={{ borderRadius: 15 }}
      >
        <View style={styles.suggestionTextOverlay}>
          <Text style={styles.suggestionTitle}>{item.title}</Text>
          <Text style={styles.suggestionArtist}>{item.artist}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderChartCard = ({ item }: { item: Chart }) => (
    <TouchableOpacity
      style={styles.chartCard}
      onPress={() =>
        rootStackNavigation.navigate("Playlist", {
          playlistId: item.id,
          title: `${item.title} - ${item.subtitle}`,
          artwork: require("../assets/Home - Audio Listing/Container 31.png"),
    
           // Truyền một ảnh đại diện
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

  const renderAlbumCard = ({ item }: { item: Album }) => (
    <TouchableOpacity style={styles.albumCard}>
      <Image source={item.artwork} style={styles.albumArtwork} />
      <Text style={styles.albumTitle}>{item.title}</Text>
      <Text style={styles.albumArtist}>{item.artist}</Text>
    </TouchableOpacity>
  );

  const renderArtistCard = ({ item }: { item: Artist }) => (
    <View style={styles.artistCard}>
      <Image source={item.avatar} style={styles.artistAvatar} />
      <Text style={styles.artistName}>{item.name}</Text>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
    </View>
  );
  // -----------------------------------------

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
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
            <Image source={MOCK_AVATAR} style={styles.avatar} />
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <FontAwesome name="search" size={18} color="#888" />
          <TextInput
            placeholder="What you want to listen to"
            style={styles.searchInput}
            placeholderTextColor="#888"
          />
        </View>

        {/* Section: Suggestions for you */}
        <Text style={[styles.sectionTitle, { marginBottom: 15 }]}>
          Suggestions for you
        </Text>
        <FlatList
          data={MOCK_SUGGESTIONS}
          renderItem={renderSuggestionCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 15 }}
        />

        {/* Section: Charts */}
        {renderSectionHeader("Charts")}
        <FlatList
          data={MOCK_CHARTS}
          renderItem={renderChartCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 15 }}
        />

        {/* Section: Trending albums */}
        {renderSectionHeader("Trending albums")}
        <FlatList
          data={MOCK_ALBUMS}
          renderItem={renderAlbumCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 15 }}
        />

        {/* Section: Popular artists */}
        {renderSectionHeader("Popular artists")}
        <FlatList
          data={MOCK_ARTISTS}
          renderItem={renderArtistCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 15 }}
        />

        {/* Thêm một khoảng trống ở dưới cùng */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// 5. --- STYLESHEET ĐÃ CẬP NHẬT ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  container: {
    flex: 1,
    paddingLeft: 15, // Chỉ padding trái, để list cuộn sát lề phải
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingRight: 15, // Header cần padding phải
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
    marginRight: 15, // Search bar cần padding phải
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

  // Suggestion Card
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
    backgroundColor: "rgba(0,0,0,0.2)", // Lớp phủ nhẹ để chữ dễ đọc
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

  // Chart Card
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

  // Album Card
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

  // Artist Card
  artistCard: {
    width: 140,
    marginRight: 15,
    alignItems: "center",
  },
  artistAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60, // Hình tròn
  },
  artistName: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 8,
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

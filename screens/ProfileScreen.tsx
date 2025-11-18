// screens/ProfileScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { RootStackScreenProps } from "../navigation/types";
import { Ionicons } from "@expo/vector-icons";
import { AppImages, getAssetImage } from "../utils/ImageManager";
// Xóa LinearGradient vì không dùng nữa

type Props = RootStackScreenProps<"Profile">;

// Dữ liệu giả lập cho playlist
const DUMMY_PLAYLISTS = [
  { id: "p1", name: "My Vibe", artwork: "album_1" },
  { id: "p2", name: "Roadtrip", artwork: "album_2" },
  { id: "p3", name: "Study Session", artwork: "album_3" },
  { id: "p4", name: "90s Hits", artwork: "album_4" },
];

export default function ProfileScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Đổi StatusBar về chữ đen */}
      <StatusBar barStyle="dark-content" />

      {/* Header (nền trắng, có viền) */}
      <View style={styles.header}>
        {/* Nút Back và Cài đặt */}
        <View style={styles.headerNav}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            {/* Đổi icon thành màu đen */}
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate("Settings")}
          >
            {/* Đổi icon thành màu đen */}
            <Ionicons name="settings-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Thông tin Avatar và Tên */}
        <View style={styles.profileInfoContainer}>
          <Image source={AppImages.avatar_4} style={styles.avatar} />
          <Text style={styles.userName}>Ashley Scott</Text>
        </View>

        {/* Thống kê */}
        <View style={styles.statsContainer}>
          <View style={styles.statBlock}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Playlists</Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statNumber}>84</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statNumber}>112</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Public Playlists</Text>

        {/* Nút tạo playlist mới */}
        <TouchableOpacity style={styles.playlistItem}>
          <View style={[styles.playlistArtwork, styles.addCard]}>
            <Ionicons name="add" size={40} color="#888" />
          </View>
          <Text style={styles.playlistTitle}>Create Playlist</Text>
        </TouchableOpacity>

        {/* Danh sách Playlist */}
        {DUMMY_PLAYLISTS.map((item) => (
          <TouchableOpacity key={item.id} style={styles.playlistItem}>
            <Image
              source={getAssetImage(item.artwork)}
              style={styles.playlistArtwork}
            />
            <Text style={styles.playlistTitle}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// STYLES ĐÃ ĐƯỢC CẬP NHẬT VỀ NỀN TRẮNG
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Nền trắng
  },
  header: {
    backgroundColor: "#FFFFFF", // Nền trắng
    paddingTop: 50, // Dành cho Status Bar
    paddingHorizontal: 15,
    paddingBottom: 20,
    borderBottomWidth: 1, // Thêm viền
    borderBottomColor: "#F0F0F0",
  },
  headerNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerButton: {
    padding: 5,
  },
  profileInfoContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000", // Chữ đen
    marginTop: 15,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 30,
    marginTop: 20,
  },
  statBlock: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000", // Chữ đen
  },
  statLabel: {
    fontSize: 13,
    color: "#888888", // Màu xám
    marginTop: 4,
  },
  scrollContainer: {
    paddingTop: 20,
    paddingHorizontal: 15,
    paddingBottom: 40,
    backgroundColor: "#FFFFFF", // Nền trắng
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000", // Chữ đen
    marginBottom: 15,
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  playlistArtwork: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  addCard: {
    backgroundColor: "#F0F0F0", // Nền xám nhạt
    justifyContent: "center",
    alignItems: "center",
  },
  playlistTitle: {
    fontSize: 16,
    color: "#000000", // Chữ đen
    marginLeft: 15,
  },
});
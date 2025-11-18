// screens/SettingsScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar, // Thêm StatusBar
} from "react-native";
import { RootStackScreenProps } from "../navigation/types";
import { Ionicons } from "@expo/vector-icons";

type Props = RootStackScreenProps<"Settings">;

export default function SettingsScreen({ navigation }: Props) {
  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: () => {
            // Reset toàn bộ navigation stack về màn hình Welcome
            navigation.reset({
              index: 0,
              routes: [{ name: "Welcome" }],
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Đặt StatusBar về chữ đen */}
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Nhóm Account */}
        <Text style={styles.sectionTitle}>Tài khoản</Text>
        <SettingItem
          icon="person-outline"
          text="Chỉnh sửa hồ sơ"
          onPress={() => navigation.navigate("EditProfile")}
        />
        <SettingItem icon="key-outline" text="Thay đổi mật khẩu" onPress={() => {}} />

        {/* Nhóm Ứng dụng */}
        <Text style={styles.sectionTitle}>Ứng dụng</Text>
        <SettingItem
          icon="notifications-outline"
          text="Thông báo"
          onPress={() => {}}
        />
        <SettingItem icon="moon-outline" text="Giao diện" onPress={() => {}} />
        <SettingItem
          icon="information-circle-outline"
          text="Giới thiệu"
          onPress={() => {}}
        />

        {/* Đăng xuất */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Component phụ cho các mục cài đặt
function SettingItem({
  icon,
  text,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  text: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Ionicons name={icon} size={22} color="#444" style={styles.itemIcon} />
      <Text style={styles.itemText}>{text}</Text>
      <Ionicons name="chevron-forward" size={22} color="#BDBDBD" />
    </TouchableOpacity>
  );
}

// STYLES ĐÃ ĐƯỢC CẬP NHẬT VỀ NỀN TRẮNG
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Nền trắng
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0", // Viền xám nhạt
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000", // Chữ đen
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    paddingBottom: 40,
    backgroundColor: "#FFFFFF", // Nền trắng
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#888", // Chữ xám
    paddingHorizontal: 20,
    paddingTop: 25,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9", // Nền item xám rất nhạt
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0", // Viền xám nhạt
  },
  itemIcon: {
    marginRight: 15,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: "#000", // Chữ đen
  },
  logoutButton: {
    margin: 20,
    marginTop: 40,
    backgroundColor: "#FFF", // Nền trắng
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF453A", // Viền đỏ
  },
  logoutButtonText: {
    color: "#FF453A", // Chữ đỏ
    fontSize: 16,
    fontWeight: "bold",
  },
});
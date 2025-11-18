// screens/EditProfileScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView
} from "react-native";
import { RootStackScreenProps } from "../navigation/types";
import { Ionicons } from "@expo/vector-icons";
import { AppImages } from "../utils/ImageManager";

type Props = RootStackScreenProps<"EditProfile">;

export default function EditProfileScreen({ navigation }: Props) {
  const [name, setName] = useState("Ashley Scott");
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    if (!name) {
      Alert.alert("Lỗi", "Tên không được để trống.");
      return;
    }
    
    setLoading(true);
    // Giả lập lưu API
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Thành công", "Hồ sơ đã được cập nhật.");
      navigation.goBack();
    }, 1500);
  };

  const handleChangePhoto = () => {
    // TODO: Thêm logic chọn ảnh (ImagePicker)
    Alert.alert("Thông báo", "Chức năng thay đổi ảnh đang được phát triển!");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
        {/* Nút Save (có trạng thái loading) */}
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#00AFFF" />
          ) : (
            <Text style={styles.saveText}>Lưu</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Avatar */}
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={handleChangePhoto}
        >
          <Image source={AppImages.avatar_4} style={styles.avatar} />
          <View style={styles.cameraIcon}>
            <Ionicons name="camera" size={22} color="#FFF" />
          </View>
        </TouchableOpacity>

        {/* Form */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tên</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Tên hiển thị của bạn"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  headerButton: {
    width: 60,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  saveText: {
    fontSize: 16,
    color: "#00AFFF", // Màu xanh dương
    fontWeight: "bold",
  },
  container: {
    padding: 20,
    alignItems: "center",
  },
  avatarContainer: {
    marginTop: 20,
    marginBottom: 40,
    position: "relative",
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#00AFFF",
    padding: 8,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  formGroup: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: "#000",
  },
});
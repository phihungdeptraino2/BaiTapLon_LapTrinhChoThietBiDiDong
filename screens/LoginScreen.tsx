import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView, // ✅ Mới
  Platform, // ✅ Mới
  ScrollView, // ✅ Mới
  Image, // ✅ Mới
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RootStackScreenProps } from "../navigation/types";

export default function LoginScreen({
  navigation,
}: RootStackScreenProps<"Login">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // TODO: Thêm logic đăng nhập thật
    if (email && password) {
      Alert.alert("Đăng nhập thành công!", "Chuyển hướng đến trang Home...");
      navigation.replace("Main", { screen: "Home" });
    } else {
      Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ✅ KeyboardAvoidingView bọc ngoài cùng */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* ✅ ScrollView giúp cuộn khi bàn phím hiện lên */}
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Nút Back */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={32} color="#1F2937" />
          </TouchableOpacity>

          {/* ✅ Thêm Logo/Ảnh minh họa */}
          <View style={styles.logoContainer}>
            <Ionicons name="musical-notes" size={80} color="#00AFFF" />
            <Text style={styles.appName}>MyMusic App</Text>
          </View>

          <Text style={styles.title}>Chào mừng trở lại!</Text>
          <Text style={styles.subtitle}>Vui lòng đăng nhập để tiếp tục</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#9CA3AF"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#9CA3AF"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <TouchableOpacity style={styles.forgotPassButton}>
            <Text style={styles.forgotPassText}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>Đăng nhập</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.replace("Register")}>
              <Text style={styles.linkText}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingBottom: 30, // Để không bị sát đáy khi cuộn
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 20, // Đã chỉnh lại cho hợp lý hơn khi có scrollview
    left: 20,
    zIndex: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 80,
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00AFFF",
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 40,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  forgotPassButton: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  forgotPassText: {
    color: "#00AFFF",
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: "#00AFFF",
    height: 56,
    borderRadius: 30, // Bo tròn hơn
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#00AFFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5, // Bóng đổ trên Android
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    color: "#6B7280",
  },
  linkText: {
    fontSize: 16,
    color: "#00AFFF",
    fontWeight: "bold",
  },
});

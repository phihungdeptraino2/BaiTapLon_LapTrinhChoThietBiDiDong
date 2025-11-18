// screens/WelcomeScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Image,
} from "react-native";

import { RootStackScreenProps } from "../navigation/types";

const BACKGROUND_IMAGE = require("../assets/Launch Screen/Image 30.png");

type Props = RootStackScreenProps<"Welcome">;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <ImageBackground
      source={BACKGROUND_IMAGE}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={{ alignItems: "center", marginTop: 100 }}>
          <Image
            source={require("../assets/Launch Screen - Premium/Image 113.png")}
            style={{ width: 100, height: 100 }}
            resizeMode="contain"
          ></Image>
        </View>
        <View style={{ marginTop: 100 }}>
          <View style={styles.midtomContainer}>
            <Text style={styles.title}>Your music</Text>
          </View>
          <View style={styles.midtomContainer}>
            <Text style={styles.title}>Your </Text>
          </View>
          <View style={styles.midtomContainer}>
            <Text style={styles.title}>artists </Text>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[styles.button, styles.createButton]}
            // ĐÃ SỬA: Điều hướng đến màn hình Đăng ký
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.createButtonText}>Create an account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            // ĐÃ SỬA: Điều hướng đến màn hình Đăng nhập
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginButtonText}>
              I already have an account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 20,
  },
  midtomContainer: { alignItems: "center" },
  bottomContainer: { paddingBottom: 30 },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#FFFFFF",
    lineHeight: 50,
    alignItems: "center",
  },
  button: {
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 15,
  },
  createButton: { backgroundColor: "#282828" },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginButton: { backgroundColor: "#EBFBFF" },
  loginButtonText: {
    color: "#00AFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
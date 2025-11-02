// screens/WelcomeScreenPremium.tsx
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

const BACKGROUND_IMAGE = require("../assets/Launch Screen - Premium/Image 112.png");

type Props = RootStackScreenProps<"WelcomePremium">;

export default function WelcomeScreenPremium({ navigation }: Props) {
  return (
    <ImageBackground
      source={BACKGROUND_IMAGE}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {/* Logo/Icon ở giữa */}
        <View style={styles.centerContainer}>
          <Image
            source={require("../assets/Launch Screen - Premium/Image 113.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Text Welcome to Premium */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome to</Text>
          <Text style={styles.title}>Premium</Text>
          <View style={styles.dotsContainer}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Button ở dưới */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.replace("Main", { screen: "Home" })}
          >
            <Text style={styles.buttonText}>Start listening</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 44,
  },
  dotsContainer: {
    flexDirection: "row",
    marginTop: 20,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  bottomContainer: {
    paddingBottom: 30,
  },
  button: {
    backgroundColor: "#1E1E1E",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
// screens/LibraryScreen.tsx
import React from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";

export default function LibraryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Library Screen</Text>
      <Text>Demo</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

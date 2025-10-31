// screens/FeedScreen.tsx
import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';

export default function FeedScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Feed Screen</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  text: { 
    fontSize: 20, 
    fontWeight: 'bold' 
  }
});
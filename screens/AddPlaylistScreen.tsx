// screens/AddPlaylistScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import { API_BASE_URL } from "../config";

type AddPlaylistScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddPlaylist"
>;

const emojis = ["🎸", "🎵", "🎤", "🎹", "🎼", "🎧", "🎺", "🥁", "🎻", "📻"];
const colors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA15E",
  "#BC6C25",
  "#7209B7",
  "#3A0CA3",
  "#FF006E",
];

export default function AddPlaylistScreen() {
  const navigation = useNavigation<AddPlaylistScreenNavigationProp>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(emojis[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [loading, setLoading] = useState(false);

  const handleAddPlaylist = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a playlist name");
      return;
    }

    setLoading(true);
    try {
      const newPlaylist = {
        id: Date.now().toString(),
        title: title.trim(),
        artist: description.trim() || "My Playlist",
        songCount: 0,
        artwork: selectedEmoji,
        artworkColor: selectedColor,
        createdAt: new Date().toISOString(),
      };

      // Gửi POST request đến backend để lưu vào db.json
      const response = await fetch(`${API_BASE_URL}/library-playlists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPlaylist),
      });

      if (response.ok) {
        Alert.alert("Success", "Playlist created successfully!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert("Error", "Failed to create playlist");
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
      Alert.alert("Error", "Failed to create playlist: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Playlist</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Preview */}
        <View style={styles.previewSection}>
          <View
            style={[
              styles.previewArtwork,
              { backgroundColor: selectedColor },
            ]}
          >
            <Text style={styles.previewEmoji}>{selectedEmoji}</Text>
          </View>
          <Text style={styles.previewTitle}>{title || "New Playlist"}</Text>
          <Text style={styles.previewDesc}>{description || "My Playlist"}</Text>
        </View>

        {/* Form */}
        <View style={styles.formSection}>
          <Text style={styles.label}>Playlist Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter playlist name"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />
          <Text style={styles.counter}>{title.length}/50</Text>

          <Text style={[styles.label, { marginTop: 20 }]}>Description</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Add a description (optional)"
            placeholderTextColor="#9CA3AF"
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={200}
          />
          <Text style={styles.counter}>{description.length}/200</Text>

          {/* Emoji Selector */}
          <Text style={[styles.label, { marginTop: 20 }]}>Choose Icon</Text>
          <View style={styles.emojiGrid}>
            {emojis.map((emoji, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.emojiButton,
                  selectedEmoji === emoji && styles.emojiButtonActive,
                ]}
                onPress={() => setSelectedEmoji(emoji)}
              >
                <Text style={styles.emoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Color Selector */}
          <Text style={[styles.label, { marginTop: 20 }]}>Choose Color</Text>
          <View style={styles.colorGrid}>
            {colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorButton,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorButtonActive,
                ]}
                onPress={() => setSelectedColor(color)}
              >
                {selectedColor === color && (
                  <Ionicons name="checkmark" size={24} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.createButton}
            onPress={handleAddPlaylist}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="add" size={20} color="#FFFFFF" />
                <Text style={styles.createButtonText}>Create Playlist</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },

  content: {
    flex: 1,
    paddingBottom: 40,
  },

  previewSection: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  previewArtwork: {
    width: 120,
    height: 120,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  previewEmoji: {
    fontSize: 48,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
    textAlign: "center",
  },
  previewDesc: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },

  formSection: {
    paddingHorizontal: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },

  counter: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 4,
    textAlign: "right",
  },

  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  emojiButton: {
    width: "18%",
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  emojiButtonActive: {
    borderColor: "#00AFFF",
    backgroundColor: "#E0F2FE",
  },
  emoji: {
    fontSize: 32,
  },

  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 40,
  },
  colorButton: {
    width: "22%",
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "transparent",
  },
  colorButtonActive: {
    borderColor: "#1F2937",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  buttonSection: {
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 20,
  },

  cancelButton: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B7280",
  },

  createButton: {
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#00AFFF",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: "#00AFFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
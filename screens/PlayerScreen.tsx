// screens/PlayerScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { RootStackScreenProps } from "../navigation/types";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

type Props = RootStackScreenProps<"Player">;

export default function PlayerScreen({ navigation, route }: Props) {
  const { song } = route.params;
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(6); // giây
  const [duration] = useState(188); // 3:08 = 188 giây
  const [isLiked, setIsLiked] = useState(false);
  const BACKGROUND_IMAGE = require("../assets/Play an Audio/Image 58.png");

  // Giả lập progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) return 0;
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = currentTime / duration;

  // Hàm tạo Waveform Bars
  const generateWaveform = () => {
    const bars = 40;
    const waveformBars = [];
    for (let i = 0; i < bars; i++) {
      const height = Math.random() * 25 + 35;
      const isActive = i / bars <= progress;
      waveformBars.push(
        <View
          key={i}
          style={[
            styles.waveformBar,
            {
              height: height,
              backgroundColor: isActive ? "white" : "rgba(255,255,255,0.4)",
            },
          ]}
        />
      );
    }
    return waveformBars;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={BACKGROUND_IMAGE}
        style={styles.background}
        // 💥 SỬA ĐỔI: XOÁ blurRadius={10} để ảnh hiển thị rõ nét
        resizeMode="cover"
      >
        <LinearGradient
          // Giữ nguyên gradient để làm tối phần dưới cho dễ đọc
          colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-down" size={32} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerText}>Play</Text>
              <TouchableOpacity>
                <Feather name="more-horizontal" size={28} color="white" />
              </TouchableOpacity>
            </View>

            {/* View này chiếm hết không gian còn lại để đẩy nội dung xuống cuối */}
            <View style={{ flex: 1 }} />

            {/* Song Info */}
            <View style={styles.infoContainer}>
              <Text style={styles.songTitle}>{song.title}</Text>
              <Text style={styles.artistName}>{song.artist}</Text>
            </View>

            {/* Waveform */}
            {/* 💥 SỬA ĐỔI: Đưa margin/padding horizontal vào styles.waveformProgressRow */}
            <View style={styles.waveformProgressRow}>
              <View style={styles.waveformContainer}>
                <View style={styles.waveform}>{generateWaveform()}</View>
              </View>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </View>
            </View>

            {/* Controls */}
            <View style={styles.controls}>
              <TouchableOpacity>
                <Ionicons name="shuffle" size={24} color="white" />
              </TouchableOpacity>

              <TouchableOpacity>
                <Ionicons name="play-skip-back" size={36} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.playButton}
                onPress={() => setIsPlaying(!isPlaying)}
              >
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={40}
                  color="#000"
                />
              </TouchableOpacity>

              <TouchableOpacity>
                <Ionicons name="play-skip-forward" size={36} color="white" />
              </TouchableOpacity>

              <TouchableOpacity>
                <Feather name="more-horizontal" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Bottom Actions */}
            <View style={styles.bottomActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setIsLiked(!isLiked)}
              >
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={24}
                  color={isLiked ? "#1ED760" : "white"}
                />
                <Text style={styles.actionText}>12K</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble-outline" size={24} color="white" />
                <Text style={styles.actionText}>450</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="arrow-redo-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24, // Giữ nguyên padding ngang
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  infoContainer: {
    alignItems: "flex-start",
    marginBottom: 20,
    paddingHorizontal: 4,
    marginLeft: 10,
  },
  songTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    marginBottom: 6,
  },
  artistName: {
    fontSize: 18,
    color: "rgba(255,255,255,0.8)",
  },

  waveformProgressRow: {
    marginBottom: 40,
    // 💥 SỬA ĐỔI: THÊM paddingHorizontal để tạo margin 2 bên cho thanh nhạc
    paddingHorizontal: 15,
  },
  waveformContainer: {
    // XOÁ paddingHorizontal cũ ở đây
  },
  waveform: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 60,
    // XOÁ paddingHorizontal cũ ở đây
    marginBottom: 5,
  },
  waveformBar: {
    width: 3,
    borderRadius: 1,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    // XOÁ paddingHorizontal cũ ở đây
  },
  timeText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
  },

  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 60,
    paddingHorizontal: 20,
  },
  playButton: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  shareButton: {
    padding: 10,
  },
});

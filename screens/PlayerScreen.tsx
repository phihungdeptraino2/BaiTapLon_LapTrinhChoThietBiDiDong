// screens/PlayerScreen.tsx (Đã nâng cấp Audio)
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
  ActivityIndicator, // ✅ THÊM
} from "react-native";
import { RootStackScreenProps } from "../navigation/types";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// ✅ 1. Import Audio từ expo-av
import { Audio } from "expo-av";
// ✅ 2. Import hàm quản lý audio
import { getAssetAudio } from "../utils/AudioManager";
import { getAssetImage } from "../utils/ImageManager"; // ✅ Import ImageManager

const { width, height } = Dimensions.get("window");

type Props = RootStackScreenProps<"Player">;

export default function PlayerScreen({ navigation, route }: Props) {
  const { song } = route.params;

  // ✅ 3. Thêm state cho 'sound object' và 'loading'
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ 4. Sửa state mặc định
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // Bắt đầu từ 0
  const [duration, setDuration] = useState(1); // Bắt đầu từ 1 (tránh lỗi chia cho 0)
  const [isLiked, setIsLiked] = useState(false);

  // ✅ 5. Lấy ảnh nền động từ 'song.artworkKey'
  const BACKGROUND_IMAGE = getAssetImage(song.artworkKey ?? "");

  // ✅ 6. XÓA BỎ useEffect GIẢ LẬP CŨ

  // ✅ 7. useEffect để TẢI VÀ PHÁT NHẠC khi component được mở
  useEffect(() => {
    const loadSound = async () => {
      setIsLoading(true);
      
      // Lấy đường dẫn file audio từ AudioManager
      const audioAsset = getAssetAudio(song.audioKey);

      if (!audioAsset) {
        console.error("Không tìm thấy file audio cho key:", song.audioKey);
        setIsLoading(false);
        return;
      }

      try {
        // Cấu hình audio
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          staysActiveInBackground: true, // Cho phép phát nhạc nền
          playThroughEarpieceAndroid: false,
        });

        // Tải file nhạc
        const { sound } = await Audio.Sound.createAsync(
          audioAsset,
          { shouldPlay: true } // Yêu cầu phát ngay sau khi tải
        );
        
        setSound(sound);
        setIsPlaying(true);

        // ✅ 8. CẬP NHẬT TRẠNG THÁI (Progress bar thật)
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            setDuration(status.durationMillis || 1);
            setCurrentTime(status.positionMillis || 0);

            // Tự động phát lại khi hết bài (tùy chọn)
            if (status.didJustFinish) {
              sound.replayAsync();
            }
          }
        });
        
      } catch (error) {
        console.error("Lỗi khi tải sound:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSound();

    // ✅ 9. Cleanup: Dỡ tải (unload) file nhạc khi thoát màn hình
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [song.audioKey]); // Chỉ chạy lại khi bài hát thay đổi

  // ✅ 10. Sửa hàm formatTime (giờ chúng ta dùng mili-giây)
  const formatTime = (millis: number) => {
    const totalSeconds = millis / 1000;
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = duration > 1 ? currentTime / duration : 0;

  // ✅ 11. Hàm Play/Pause mới
  const onPlayPausePress = async () => {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    // State isPlaying sẽ tự động cập nhật nhờ 'setOnPlaybackStatusUpdate'
  };

  // Hàm tạo Waveform (giữ nguyên)
  const generateWaveform = () => {
    const bars = 40;
    const waveformBars = [];
    for (let i = 0; i < bars; i++) {
      // (Bạn có thể làm thanh sóng "thật" bằng cách phân tích
      // dữ liệu âm thanh, nhưng random vẫn ổn cho bài tập)
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
  
  // ✅ 12. Thêm màn hình Loading
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={BACKGROUND_IMAGE} // ✅ Đã dùng ảnh động
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
          style={styles.gradient}
        >
          <SafeAreaView style={styles.safeArea}>
            {/* Header (giữ nguyên) */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-down" size={32} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerText}>Play</Text>
              <TouchableOpacity>
                <Feather name="more-horizontal" size={28} color="white" />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }} />

            {/* Song Info (giữ nguyên) */}
            <View style={styles.infoContainer}>
              <Text style={styles.songTitle}>{song.title}</Text>
              <Text style={styles.artistName}>{song.artist}</Text>
            </View>

            {/* Waveform (giữ nguyên, giờ nó sẽ chạy bằng data thật) */}
            <View style={styles.waveformProgressRow}>
              <View style={styles.waveformContainer}>
                <View style={styles.waveform}>{generateWaveform()}</View>
              </View>
              <View style={styles.timeContainer}>
                {/* ✅ Dùng state thật */}
                <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </View>
            </View>

            {/* Controls (giữ nguyên) */}
            <View style={styles.controls}>
              <TouchableOpacity>
                <Ionicons name="shuffle" size={24} color="white" />
              </TouchableOpacity>

              <TouchableOpacity>
                <Ionicons name="play-skip-back" size={36} color="white" />
              </TouchableOpacity>

              {/* ✅ 13. Kết nối hàm Play/Pause thật */}
              <TouchableOpacity
                style={styles.playButton}
                onPress={onPlayPausePress}
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

            {/* Bottom Actions (giữ nguyên) */}
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

// ... (const styles giữ nguyên)
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
    paddingHorizontal: 15,
  },
  waveformContainer: {},
  waveform: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 60,
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
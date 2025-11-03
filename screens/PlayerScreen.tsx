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
  ActivityIndicator, // 👈 MỚI: Thêm vòng xoay loading
} from "react-native";
import { RootStackScreenProps } from "../navigation/types";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// 👈 MỚI: Import thư viện Audio
import { Audio, AVPlaybackStatus } from 'expo-av';

// 👈 MỚI: Import trình quản lý file local (cho các màn hình cũ)
// Hãy đảm bảo đường dẫn này đúng với cấu trúc dự án của bạn
import { AppAudio } from "../utils/AudioManager";
import { AppImages } from "../utils/ImageManager";

const { width } = Dimensions.get("window");

type Props = RootStackScreenProps<"Player">;

export default function PlayerScreen({ navigation, route }: Props) {
  const { song } = route.params;

  // ❌ XÓA: State giả lập cũ
  // const [isPlaying, setIsPlaying] = useState(true);
  // const [currentTime, setCurrentTime] = useState(6);
  // const [duration] = useState(188);

  // ✅ MỚI: State thật để quản lý âm thanh
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0); // Sẽ tính bằng milliseconds
  const [duration, setDuration] = useState(0); // Sẽ tính bằng milliseconds
  const [isLiked, setIsLiked] = useState(false);

  // ❌ XÓA: useEffect giả lập progress cũ
  // useEffect(() => { ... }, [isPlaying, duration]);

  // ✅ MỚI: useEffect để TẢI, PHÁT và DỌN DẸP file nhạc
  useEffect(() => {
    async function loadSound() {
      setIsLoading(true);

      let soundSource: any = null;
      let durationMs: number = 0;

      // ==============================================
      // 🚀 LOGIC "THÔNG MINH" ĐỂ CHỌN NGUỒN NHẠC
      // ==============================================

      if (song.audioUrl) {
        // --- TRƯỜNG HỢP 1: Dùng API (từ SearchScreen) ---
        console.log("Loading from URL:", song.audioUrl);
        soundSource = { uri: song.audioUrl };
        durationMs = song.durationMillis || 0;
      } else if ((song as any).audioKey) {
        // --- TRƯỜNG HỢP 2: Dùng json-server + key (từ HomeScreen) ---
        console.log("Loading from local key:", (song as any).audioKey);
        const audioKey = (song as any).audioKey as keyof typeof AppAudio;
        soundSource = AppAudio[audioKey];
        // (Với file local, chúng ta sẽ để 'expo-av' tự phát hiện duration)
      } else {
        // --- TRƯỜNG HỢP 3: (Mock data cũ) Không có nguồn nhạc ---
        console.warn(
          "Không tìm thấy nguồn nhạc (audioUrl hoặc audioKey). Sẽ không phát nhạc."
        );
        setIsLoading(false);
        // Giả lập duration từ mock data cũ nếu có
        if (song.duration) {
          const parts = song.duration.split(":").map(Number);
          setDuration((parts[0] * 60 + parts[1]) * 1000);
        }
        return;
      }

      // ==============================================

      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        const { sound, status } = await Audio.Sound.createAsync(
          soundSource, // 👈 Dùng nguồn nhạc linh hoạt
          { shouldPlay: true } // Tự động phát khi tải xong
        );

        setSound(sound);
        setIsPlaying(true);

        if (status.isLoaded) {
          // Lấy duration linh hoạt
          setDuration(durationMs > 0 ? durationMs : status.durationMillis || 0);
        }

        // Lắng nghe các cập nhật về trạng thái (play, pause, thời gian)
        sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      } catch (e) {
        console.error("Lỗi khi tải nhạc:", e);
      }
      setIsLoading(false);
    }

    loadSound();

    // Hàm dọn dẹp (rất quan trọng): Chạy khi màn hình này bị đóng
    return () => {
      console.log("Unloading Sound");
      sound?.unloadAsync();
    };
  }, [song.id]); // Tải lại nhạc nếu 'song.id' thay đổi

  // ✅ MỚI: Hàm được gọi mỗi khi có cập nhật (play, pause, time)
 const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    setIsPlaying(status.isPlaying);
    setCurrentTime(status.positionMillis);

    // Tự động replay khi hết bài (có thể xóa nếu không muốn)
    if (status.didJustFinish) {
      sound?.replayAsync();
    }
  };

  // ✅ MỚI: Hàm Play/Pause chuẩn
  const onPlayPausePress = async () => {
    if (!sound) return; // Không làm gì nếu nhạc chưa tải

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    // State isPlaying sẽ tự cập nhật nhờ onPlaybackStatusUpdate
  };

  // ✅ SỬA: Hàm format thời gian (từ Milliseconds)
  const formatTime = (millis: number) => {
    const totalSeconds = millis / 1000;
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // ✅ SỬA: Tính progress từ state thật (milliseconds)
  const progress = duration > 0 ? currentTime / duration : 0;

  // ✅ MỚI: LOGIC "THÔNG MINH" CHO ẢNH
  let artworkSource: any;
  if (typeof song.artwork === "string") {
    // TRƯỜNG HỢP 1: Dùng API (artwork là URL)
    artworkSource = { uri: song.artwork };
  } else if ((song as any).artworkKey) {
    // TRƯỜNG HỢP 2: Dùng json-server + key
    artworkSource =
      AppImages[(song as any).artworkKey as keyof typeof AppImages];
  } else {
    // TRƯỜNG HỢP 3: Dùng mock data cũ (artwork là require())
    artworkSource = song.artwork;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={artworkSource} // 👈 SỬA: Dùng nguồn ảnh linh hoạt
        style={styles.background}
        blurRadius={30}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}
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

            {/* Album Art */}
            <View style={styles.artworkContainer}>
              <ImageBackground
                source={artworkSource} // 👈 SỬA: Dùng nguồn ảnh linh hoạt
                style={styles.artwork}
                imageStyle={styles.artworkImage}
              >
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.3)"]}
                  style={styles.artworkGradient}
                />
              </ImageBackground>
            </View>

            {/* Song Info */}
            <View style={styles.infoContainer}>
              <Text style={styles.songTitle}>{song.title}</Text>
              <Text style={styles.artistName}>{song.artist}</Text>
            </View>

            {/* Progress Bar (giờ đã dùng state thật) */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${progress * 100}%` }]}
                />
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

              {/* 👈 SỬA: Nút Play/Pause chính */}
              <TouchableOpacity
                style={styles.playButton}
                onPress={onPlayPausePress} // 👈 SỬA
                disabled={isLoading} // 👈 MỚI: Vô hiệu hóa khi đang tải
              >
                {isLoading ? (
                  <ActivityIndicator size="large" color="#000" />
                ) : (
                  <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={40}
                    color="#000"
                  />
                )}
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
              {/* ... (Các nút action giữ nguyên) ... */}
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

// ... (const styles giữ nguyên y hệt file gốc của bạn)
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
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  headerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  artworkContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  artwork: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 12,
    overflow: "hidden",
  },
  artworkImage: {
    borderRadius: 12,
  },
  artworkGradient: {
    flex: 1,
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  artistName: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "white",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  timeText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionText: {
    color: "white",
    fontSize: 14,
  },
  shareButton: {
    padding: 10,
  },
});

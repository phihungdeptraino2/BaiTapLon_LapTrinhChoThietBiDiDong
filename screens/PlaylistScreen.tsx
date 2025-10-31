// screens/PlaylistScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
// 1. Import types
import { RootStackScreenProps } from '../navigation/types';
import { Song } from '../interfaces/data';
import { Ionicons, Feather } from '@expo/vector-icons';

// 2. ✅ THAY THẾ DỮ LIỆU MẪU VÀ TÊN ẢNH
const MOCK_SONGS: Song[] = [
  {
    id: '1', title: 'FLOWER', artist: 'Jessica Gonzalez', duration: '3:36',
    artwork: require('../assets/Home - Audio Listing/Image 45.png'),
  },
  {
    id: '2', title: 'FLOWER', artist: 'Jessica Gonzalez', duration: '3:36',
    artwork: require('../assets/Home - Audio Listing/Image 45.png'),
  },
    {
    id: '3', title: 'FLOWER', artist: 'Jessica Gonzalez', duration: '3:36',
    artwork: require('../assets/Home - Audio Listing/Image 45.png'),
  },
  // ... thêm các bài hát khác
];

// Component cho bài hát
const SongItem = ({ item }: { item: Song }) => (
  <View style={styles.songItem}>
    <Image source={item.artwork} style={styles.songArt} />
    <View style={styles.songInfo}>
      <Text style={styles.songTitle}>{item.title}</Text>
      <Text style={styles.songArtist}>{item.artist} • {item.duration}</Text>
    </View>
    <Feather name="more-horizontal" size={24} color="#888" />
  </View>
);

// 3. Định nghĩa props
type Props = RootStackScreenProps<'Playlist'>;

export default function PlaylistScreen({ navigation, route }: Props) {
  // 4. Lấy dữ liệu được truyền từ HomeScreen
  const { title, artwork } = route.params;

  const PlaylistHeader = () => (
    <View style={styles.headerContainer}>
      <Image source={artwork} style={styles.playlistImage} />
      <Text style={styles.playlistTitle}>{title}</Text>
      <Text style={styles.playlistStats}>1,234 • 05:10:18</Text>
      <View style={styles.controls}>
        {/* ... (các nút controls) ... */}
        <TouchableOpacity style={styles.playButton}>
          <Ionicons name="play" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Feather name="cast" size={24} color="black" />
      </View>
      <FlatList
        data={MOCK_SONGS}
        renderItem={SongItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<PlaylistHeader />}
      />
    </SafeAreaView>
  );
}

// (Dán Styles từ hướng dẫn trước vào đây...)
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  headerContainer: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  playlistImage: {
    width: 180,
    height: 180,
    borderRadius: 20,
    marginBottom: 15,
  },
  playlistTitle: { fontSize: 24, fontWeight: 'bold' },
  playlistStats: { fontSize: 14, color: '#888', marginVertical: 8 },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '80%',
    marginTop: 15,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  songArt: { width: 50, height: 50, borderRadius: 5, marginRight: 10 },
  songInfo: { flex: 1 },
  songTitle: { fontSize: 16, fontWeight: '500' },
  songArtist: { fontSize: 14, color: '#888' },
});
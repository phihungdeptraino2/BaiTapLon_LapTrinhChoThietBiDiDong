// screens/LibraryScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Song, Playlist, Artist } from '../interfaces/data';

// Extend interfaces for Library-specific needs
interface LibrarySong extends Omit<Song, 'duration'> {
  duration?: string;
  artworkColor?: string;
  isFavorite?: boolean;
  isPlaylist?: boolean;
  songCount?: number;
}

interface LibraryPlaylist extends Playlist {
  artist: string;
  artworkColor?: string;
}

// Sample data
const artistData: Artist & { followers: string; isFollowing: boolean } = {
  id: '1',
  name: 'Mer Watson',
  avatar: '👩',
  followers: '1,234K',
  isFollowing: false,
};

const songsData: LibrarySong[] = [
  {
    id: '1',
    title: 'FLOWER',
    artist: 'Jessica Gonzalez',
    plays: '2.1M',
    duration: '3:36',
    artwork: '🎵',
    artworkColor: '#8B5CF6',
    isFavorite: true,
  },
  {
    id: '2',
    title: 'Shape of You',
    artist: 'Anthony Taylor',
    plays: '68M',
    duration: '03:35',
    artwork: '🎸',
    artworkColor: '#EC4899',
    isFavorite: true,
  },
  {
    id: '3',
    title: 'Blinding Lights',
    artist: 'Ashley Scott',
    songCount: 4,
    artwork: '🎤',
    artworkColor: '#000',
    isPlaylist: true,
  },
  {
    id: '4',
    title: 'Levitating',
    artist: 'Anthony Taylor',
    plays: '9M',
    duration: '07:48',
    artwork: '⚡',
    artworkColor: '#6366F1',
    isFavorite: true,
  },
  {
    id: '5',
    title: 'Astronaut in the Ocean',
    artist: 'Pedro Moreno',
    plays: '23M',
    duration: '3:36',
    artwork: '🚀',
    artworkColor: '#F97316',
    isFavorite: true,
  },
  {
    id: '6',
    title: 'Dynamite',
    artist: 'Elena Jimenez',
    plays: '10M',
    duration: '06:22',
    artwork: '💥',
    artworkColor: '#F59E0B',
    isFavorite: true,
  },
];

const playlistsData: LibraryPlaylist[] = [
  {
    id: '1',
    title: 'Lorem ipsum nulla',
    artist: 'Ashley Scott',
    songCount: 12,
    artwork: '🎸',
    artworkColor: '#DC2626',
  },
  {
    id: '2',
    title: 'My Favorites',
    artist: 'Jose Garcia',
    songCount: 4,
    artwork: '👨',
    artworkColor: '#E5E7EB',
  },
];

interface LibraryItemProps {
  item: LibrarySong;
  onToggleFavorite?: (id: string) => void;
  onPress?: () => void;
}

function LibraryItem({ item, onToggleFavorite, onPress }: LibraryItemProps) {
  if (item.isPlaylist) {
    return (
      <TouchableOpacity style={styles.libraryItem} onPress={onPress}>
        <View style={[styles.artwork, { backgroundColor: item.artworkColor }]}>
          <Text style={styles.artworkEmoji}>{item.artwork}</Text>
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <View style={styles.itemMeta}>
            <Text style={styles.itemArtist}>{item.artist}</Text>
            <View style={styles.metaDot} />
            <Text style={styles.itemArtist}>{item.songCount} songs</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.libraryItem}>
      <View style={[styles.artwork, { backgroundColor: item.artworkColor }]}>
        <Text style={styles.artworkEmoji}>{item.artwork}</Text>
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <View style={styles.itemMeta}>
          <Text style={styles.itemArtist}>{item.artist}</Text>
          <View style={styles.metaDot} />
          <Ionicons name="play" size={10} color="#6B7280" />
          <Text style={styles.itemStats}>{item.plays}</Text>
          <View style={styles.metaDot} />
          <Text style={styles.itemStats}>{item.duration}</Text>
        </View>
      </View>
      {item.isFavorite !== undefined && (
        <TouchableOpacity onPress={() => onToggleFavorite?.(item.id)}>
          <Ionicons 
            name={item.isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={item.isFavorite ? "#00D9FF" : "#9CA3AF"} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

interface PlaylistItemProps {
  item: LibraryPlaylist;
  onPress?: () => void;
}

function PlaylistItem({ item, onPress }: PlaylistItemProps) {
  return (
    <TouchableOpacity style={styles.playlistItem} onPress={onPress}>
      <View style={[styles.playlistArtwork, { backgroundColor: item.artworkColor }]}>
        <Text style={styles.playlistArtworkEmoji}>{item.artwork}</Text>
      </View>
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistTitle}>{item.title}</Text>
        <View style={styles.playlistMeta}>
          <Text style={styles.playlistArtist}>{item.artist}</Text>
          <View style={styles.metaDot} />
          <Text style={styles.playlistArtist}>{item.songCount} songs</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState<'main' | 'playlists'>('main');
  const [isFollowing, setIsFollowing] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(songsData.filter(s => s.isFavorite).map(s => s.id))
  );

  const tabs = [
    { key: 'playlists', label: 'Playlists' },
    { key: 'new-tag', label: 'New tag' },
    { key: 'songs', label: 'Songs' },
    { key: 'albums', label: 'Albums' },
    { key: 'artists', label: 'Artists' },
  ];

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handlePlaylistPress = () => {
    setActiveTab('playlists');
  };

  const handleBackPress = () => {
    setActiveTab('main');
  };

  if (activeTab === 'playlists') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Playlists</Text>
          <TouchableOpacity>
            <Ionicons name="scan-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Your playlists</Text>
          {playlistsData.map(playlist => (
            <PlaylistItem key={playlist.id} item={playlist} />
          ))}
        </ScrollView>

        {/* Add Button */}
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={32} color="#FFF" />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Library</Text>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
          >
            <Text style={styles.tabText}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content}>
        {/* Artist Card */}
        <View style={styles.artistCard}>
          <View style={styles.artistInfo}>
            <View style={styles.artistAvatar}>
              <Text style={styles.artistAvatarEmoji}>{artistData.avatar}</Text>
            </View>
            <View>
              <Text style={styles.artistName}>{artistData.name}</Text>
              <View style={styles.followersRow}>
                <Ionicons name="people-outline" size={12} color="#6B7280" />
                <Text style={styles.followersText}>{artistData.followers} Followers</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.followButton, isFollowing && styles.followingButton]}
            onPress={() => setIsFollowing(!isFollowing)}
          >
            <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Library Items */}
        {songsData.map(item => (
          <LibraryItem
            key={item.id}
            item={{
              ...item,
              isFavorite: favorites.has(item.id),
            }}
            onToggleFavorite={handleToggleFavorite}
            onPress={item.isPlaylist ? handlePlaylistPress : undefined}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  tabsContainer: {
    maxHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  artistCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 8,
  },
  artistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  artistAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FCD34D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  artistAvatarEmoji: {
    fontSize: 28,
  },
  artistName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  followersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  followersText: {
    fontSize: 13,
    color: '#6B7280',
  },
  followButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followingButton: {
    backgroundColor: '#F3F4F6',
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  followingButtonText: {
    color: '#1F2937',
  },
  libraryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 12,
  },
  artwork: {
    width: 56,
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  artworkEmoji: {
    fontSize: 24,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemArtist: {
    fontSize: 13,
    color: '#6B7280',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#9CA3AF',
  },
  itemStats: {
    fontSize: 13,
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  playlistArtwork: {
    width: 56,
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistArtworkEmoji: {
    fontSize: 24,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  playlistMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playlistArtist: {
    fontSize: 13,
    color: '#6B7280',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
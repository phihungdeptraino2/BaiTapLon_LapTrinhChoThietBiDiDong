// navigation/types.ts
import { StackScreenProps } from '@react-navigation/stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native'; // Cần cho lồng nhau
import { Song } from '../interfaces/data';
/**
 * Định nghĩa cho Bottom Tab Navigator
 */
export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Feed: undefined;
  Library: undefined;
};

/**
 * Định nghĩa cho Root Stack Navigator
 */
export type RootStackParamList = {
  Welcome: undefined;
  Main: NavigatorScreenParams<MainTabParamList>; // Lồng MainTabParamList vào đây
  Playlist: {
    playlistId: string;
    title: string;
    artwork: any;
  };
  Player: {
    song: Song;
    playlist: Song[];
  };
};

/**
 * Kiểu props tiện lợi cho các màn hình RootStack
 */
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

/**
 * Kiểu props tiện lợi cho các màn hình MainTab
 */
export type MainTabScreenProps<T extends keyof MainTabParamList> =
  BottomTabScreenProps<MainTabParamList, T>;
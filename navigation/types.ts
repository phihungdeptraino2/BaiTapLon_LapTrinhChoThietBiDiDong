// navigation/types.ts - CẬP NHẬT
import { StackScreenProps } from "@react-navigation/stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import { Song } from "../interfaces/data";

/**
 * Định nghĩa cho Bottom Tab Navigator
 */
export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Feed: undefined;
  Library: undefined;
  Premium: undefined;
};

/**
 * Định nghĩa cho Root Stack Navigator
 */
export type RootStackParamList = {
  Welcome: undefined;
  WelcomePremium: undefined;
  SubscriptionPlans: undefined;
  Login: undefined;
  Register: undefined;
  Payment: undefined;
  Profile: undefined;
  Settings: undefined;
  EditProfile: undefined;
  AddPlaylist: undefined;
  AddArtist: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  LibraryPlaylistDetail: {
    playlistId: string;
    title: string;
    artwork?: string;
    artworkKey?: string;
    artworkColor?: string;
  };
  Playlist: {
    playlistId: string;
    title: string;
    artwork: any;
  };
  Player: {
    song: Song;
    playlist?: Song[];
  };
  Artist: {
    artist: {
      id: string;
      name: string;
      avatar: any;
    };
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

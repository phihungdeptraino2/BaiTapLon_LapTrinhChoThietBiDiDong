// App.tsx - CẬP NHẬT
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// 1. Import types và các bộ điều hướng
import { RootStackParamList } from "./navigation/types";
import MainTabNavigator from "./navigation/MainTabNavigator";

// 2. Import các màn hình trong RootStack
import WelcomeScreen from "./screens/WelcomeScreen";
import WelcomeScreenPremium from "./screens/WelcomeScreenPremium";
import PlaylistScreen from "./screens/PlaylistScreen";
import PlayerScreen from "./screens/PlayerScreen";
import ArtistScreen from "./screens/ArtistScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import PaymentScreen from "./screens/PaymentScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import AddPlaylistScreen from "./screens/AddPlaylistScreen";
import AddArtistScreen from "./screens/AddArtistScreen";
import LibraryPlaylistDetailScreen from "./screens/LibraryPlaylistDetailScreen";
// 3. Khởi tạo RootStack
const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Các màn hình không có Tab Bar */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="WelcomePremium" component={WelcomeScreenPremium} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />

        {/* Màn hình thêm playlist và artist */}
        <Stack.Screen name="AddPlaylist" component={AddPlaylistScreen} />
        <Stack.Screen name="AddArtist" component={AddArtistScreen} />

        {/* Màn hình Playlist */}
        <Stack.Screen name="Playlist" component={PlaylistScreen} />

        {/* Nhóm màn hình có Tab Bar */}
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen
          name="Player"
          component={PlayerScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Artist"
          component={ArtistScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LibraryPlaylistDetail"
          component={LibraryPlaylistDetailScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

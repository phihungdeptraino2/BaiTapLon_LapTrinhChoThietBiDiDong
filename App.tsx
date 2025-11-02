// App.tsx
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// 1. Import types và các bộ điều hướng
import { RootStackParamList } from "./navigation/types";
import MainTabNavigator from "./navigation/MainTabNavigator";

// 2. Import các màn hình trong RootStack
import WelcomeScreen from "./screens/WelcomeScreen";
import WelcomeScreenPremium from "./screens/WelcomeScreenPremium";
import SubscriptionPlansScreen from "./screens/SubscriptionPlansScreen";
import PlaylistScreen from "./screens/PlaylistScreen";
import PlayerScreen from "./screens/PlayerScreen";
import ArtistScreen from "./screens/ArtistScreen";
// 3. Khởi tạo RootStack
const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="WelcomePremium" // Bắt đầu từ màn hình Welcome
        // initialRouteName="WelcomePremium" // test màn hình WelcomePremium
        // initialRouteName="SubscriptionPlans" // test màn hình SubscriptionPlans
        
        screenOptions={{
          headerShown: false, // Ẩn header cho toàn bộ Stack
        }}
      >
        {/* Các màn hình không có Tab Bar */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="WelcomePremium" component={WelcomeScreenPremium} />
        <Stack.Screen name="SubscriptionPlans" component={SubscriptionPlansScreen} />

        {/* Màn hình này sẽ hiển thị trên cùng, che cả Tab Bar */}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

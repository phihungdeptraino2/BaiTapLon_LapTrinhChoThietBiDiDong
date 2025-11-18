// navigation/MainTabNavigator.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from "./types";
import { Ionicons } from "@expo/vector-icons"; // Import icons

// Import các màn hình cho tab
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import FeedScreen from "../screens/FeedScreen";
import LibraryScreen from "../screens/LibraryScreen";
// <--- 1. IMPORT MÀN HÌNH MỚI
import SubscriptionPlansScreen from "../screens/SubscriptionPlansScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Ẩn header của tab
        tabBarActiveTintColor: "#00AFFF", // Màu icon khi active
        tabBarInactiveTintColor: "#888", // Màu icon khi inactive
        tabBarShowLabel: false, // Ẩn chữ (Home, Search...)
        tabBarStyle: {
          backgroundColor: "#FFFFFF", // Màu nền tab bar
          borderTopWidth: 0, // Bỏ đường viền
        },
        // Hàm định nghĩa icon
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>["name"];
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Feed") {
            iconName = focused ? "compass" : "compass-outline";
          } else if (route.name === "Library") {
            iconName = focused ? "library" : "library-outline";
          } else if (route.name === "Premium") {
            iconName = focused ? "diamond" : "diamond-outline";
          } else {
            iconName = "alert-circle"; // Icon lỗi
          }
            return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="Premium" component={SubscriptionPlansScreen} />
    </Tab.Navigator>
  );
}

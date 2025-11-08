// screens/SubscriptionPlansScreen.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { RootStackScreenProps } from "../navigation/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 40;

type Props = RootStackScreenProps<"SubscriptionPlans">;

// Dữ liệu các gói đăng ký
const PLANS = [
  {
    id: 1,
    name: "Premium",
    freeText: "Free for 1 month",
    price: "$12.99/ month",
    features: [
      "Ad-free listening",
      "Download to listen offline",
      "Access full catalog Premium",
      "High sound quality",
      "Cancel anytime",
    ],
  },
  {
    id: 2,
    name: "Premium Plus",
    freeText: "Free for 2 months",
    price: "$19.99/ month",
    features: [
      "All Premium features",
      "Unlimited skips",
      "Exclusive content access",
      "Priority customer support",
      "Family sharing (up to 6 members)",
    ],
  },
  {
    id: 3,
    name: "Premium Family",
    freeText: "Free for 1 month",
    price: "$24.99/ month",
    features: [
      "All Premium Plus features",
      "Up to 6 family members",
      "Individual accounts for each member",
      "Parental controls",
      "Shared playlists",
    ],
  },
];

export default function SubscriptionPlansScreen({ navigation }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / CARD_WIDTH);
    setActiveIndex(index);
  };

  return (
    <LinearGradient
      colors={["#8B5CF6", "#EC4899"]} // Purple to Pink gradient
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Unlimited</Text>
          <Text style={styles.headerTitle}>music selections</Text>
        </View>

        {/* Scrollable Cards */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + 20}
          snapToAlignment="center"
          contentContainerStyle={styles.cardsContainer}
        >
          {PLANS.map((plan, index) => (
            <View key={plan.id} style={styles.cardWrapper}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.planTitle}>{plan.name}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.freeText}>{plan.freeText}</Text>
                    <Text style={styles.priceText}>{plan.price}</Text>
                  </View>
                </View>

                {/* Features List */}
                <View style={styles.featuresList}>
                  {plan.features.map((feature, idx) => (
                    <FeatureItem key={idx} text={feature} />
                  ))}
                </View>

                {/* Subscribe Button */}
                <TouchableOpacity
                  style={styles.subscribeButton}
                  onPress={() => navigation.navigate("WelcomePremium")}
                >
                  <Text style={styles.subscribeButtonText}>Subscribe now</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Dots Indicator */}
        <View style={styles.dotsContainer}>
          {PLANS.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, activeIndex === index && styles.dotActive]}
            />
          ))}
        </View>

        {/* Back Home Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.replace("Main", { screen: "Home" })}
        >
          <Text style={styles.backButtonText}>Back home</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

// Feature Item Component
function FeatureItem({ text }: { text: string }) {
  return (
    <View style={styles.featureItem}>
      <Ionicons name="checkmark" size={20} color="#8B5CF6" />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 40,
  },
  cardsContainer: {
    paddingHorizontal: 20,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 400,
  },
  cardHeader: {
    marginBottom: 20,
  },
  planTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E1E1E",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  freeText: {
    fontSize: 14,
    color: "#8B5CF6",
    fontWeight: "600",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E1E1E",
  },
  featuresList: {
    marginBottom: 24,
    flex: 1,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureText: {
    fontSize: 15,
    color: "#4B5563",
    marginLeft: 12,
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: "#1E1E1E",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  subscribeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 30,
    marginBottom: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  dotActive: {
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    alignItems: "center",
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

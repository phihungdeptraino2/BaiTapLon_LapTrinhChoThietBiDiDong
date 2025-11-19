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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; // Import thêm icon

import { MainTabScreenProps } from "../navigation/types";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 60; // Giảm width một chút để lộ card bên cạnh nhiều hơn

type Props = MainTabScreenProps<"Premium">;

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
      "Family sharing (6 members)",
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
      "Individual accounts",
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
    const index = Math.round(scrollPosition / (CARD_WIDTH + 20));
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* ✨ TRANG TRÍ 1: Background Blobs (Hình tròn mờ làm nền) */}
      <View style={styles.blobTopLeft} />
      <View style={styles.blobBottomRight} />
      {/* ------------------------------------------------------ */}

      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          {/* ✨ TRANG TRÍ 2: Thêm icon Diamond */}
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="crown-outline"
              size={40}
              color="#8B5CF6"
            />
          </View>
          <Text style={styles.headerTitle}>Unlock Unlimited</Text>
          <Text style={styles.headerSubtitle}>Music Selections</Text>
        </View>

        {/* Scrollable Cards */}
        <View style={{ height: 460 }}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH + 20}
            snapToAlignment="center" // Canh giữa để đẹp hơn
            contentContainerStyle={styles.cardsContainer}
          >
            {PLANS.map((plan) => (
              <View key={plan.id} style={styles.cardWrapper}>
                <LinearGradient
                  // Màu gradient nhẹ nhàng hơn (opacity 0.85)
                  colors={[
                    "rgba(139, 92, 246, 0.85)",
                    "rgba(236, 72, 153, 0.85)",
                  ]}
                  style={styles.card}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {/* Icon trang trí mờ trong thẻ */}
                  <Ionicons
                    name="musical-notes"
                    size={100}
                    color="rgba(255,255,255,0.1)"
                    style={styles.cardDecorIcon}
                  />

                  <View style={styles.cardHeader}>
                    <Text style={styles.planTitleCard}>{plan.name}</Text>
                    <View style={styles.priceTag}>
                      <Text style={styles.priceTextCard}>{plan.price}</Text>
                    </View>
                    <Text style={styles.freeTextCard}>{plan.freeText}</Text>
                  </View>

                  <View style={styles.featuresList}>
                    {plan.features.map((feature, idx) => (
                      <FeatureItem
                        key={idx}
                        text={feature}
                        textColor="#FFFFFF"
                        iconColor="#FFFFFF"
                      />
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.subscribeButton}
                    onPress={() => navigation.getParent()?.navigate("Payment")}
                  >
                    <Text style={styles.subscribeButtonText}>Get Started</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Dots Indicator */}
        <View style={styles.dotsContainer}>
          {PLANS.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, activeIndex === index && styles.dotActive]}
            />
          ))}
        </View>

        {/* ✨ TRANG TRÍ 3: Footer Links & Back Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>No thanks, back to Home</Text>
          </TouchableOpacity>

          <View style={styles.legalLinks}>
            <Text style={styles.legalText}>Restore purchases</Text>
            <View style={styles.divider} />
            <Text style={styles.legalText}>Terms & Conditions</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function FeatureItem({
  text,
  textColor,
  iconColor,
}: {
  text: string;
  textColor: string;
  iconColor: string;
}) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.checkCircle}>
        <Ionicons name="checkmark" size={12} color="#8B5CF6" />
      </View>
      <Text style={[styles.featureText, { color: textColor }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    overflow: "hidden", // Để cắt các blob hình tròn
  },
  // --- BACKGROUND BLOBS ---
  blobTopLeft: {
    position: "absolute",
    top: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(139, 92, 246, 0.08)", // Màu tím rất nhạt
  },
  blobBottomRight: {
    position: "absolute",
    bottom: -50,
    right: -50,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: "rgba(236, 72, 153, 0.08)", // Màu hồng rất nhạt
  },
  // -----------------------

  contentContainer: {
    flex: 1,
    paddingTop: 60,
    justifyContent: "space-between", // Cân đối header và footer
    paddingBottom: 30,
  },

  // HEADER
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  iconContainer: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    borderRadius: 50,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headerSubtitle: {
    fontSize: 32,
    fontWeight: "800", // Font cực đậm
    color: "#1F2937",
    textAlign: "center",
  },

  // CARDS
  cardsContainer: {
    paddingHorizontal: 30, // Padding 2 bên để căn giữa snap
    paddingVertical: 10,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: 20,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    height: 420,
    justifyContent: "space-between",
    shadowColor: "#8B5CF6", // Shadow màu tím
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    overflow: "hidden",
  },
  cardDecorIcon: {
    position: "absolute",
    bottom: -20,
    right: -20,
    transform: [{ rotate: "-15deg" }],
  },
  cardHeader: {
    marginBottom: 10,
  },
  planTitleCard: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  freeTextCard: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  priceTag: {
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  priceTextCard: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  featuresList: {
    flex: 1,
    justifyContent: "center",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
  },

  subscribeButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  subscribeButtonText: {
    color: "#8B5CF6",
    fontSize: 16,
    fontWeight: "800", // Chữ đậm hơn
    textTransform: "uppercase",
  },

  // DOTS
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5E7EB", // Màu xám nhạt
  },
  dotActive: {
    backgroundColor: "#8B5CF6", // Màu tím khi active
    width: 24, // Kéo dài dot active
  },

  // FOOTER
  footer: {
    alignItems: "center",
    gap: 16,
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    color: "#4B5563",
    fontSize: 15,
    fontWeight: "600",
  },
  legalLinks: {
    flexDirection: "row",
    alignItems: "center",
  },
  legalText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 10,
  },
});

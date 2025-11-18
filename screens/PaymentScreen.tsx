// screens/PaymentScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator, // Thêm spinner
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RootStackScreenProps } from "../navigation/types";

type Props = RootStackScreenProps<"Payment">;

export default function PaymentScreen({ navigation }: Props) {
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Hàm định dạng ô nhập liệu ---

  const handleCardNumberChange = (text: string) => {
    // Xóa tất cả ký tự không phải số
    const numericText = text.replace(/\D/g, "");
    // Thêm dấu cách mỗi 4 chữ số
    const formatted = numericText.match(/.{1,4}/g)?.join(" ") || "";
    // Giới hạn 16 số + 3 dấu cách
    setCardNumber(formatted.substring(0, 19));
  };

  const handleExpiryChange = (text: string) => {
    const numericText = text.replace(/\D/g, "");
    
    // Tự động thêm "/"
    if (numericText.length >= 3) {
      setExpiry(
        `${numericText.substring(0, 2)}/${numericText.substring(2, 4)}`
      );
    } 
    // Nếu người dùng xóa "/"
    else if (numericText.length === 2 && expiry.length === 3) {
      setExpiry(numericText);
    }
    // Cho phép nhập 2 số đầu
    else if (numericText.length <= 2) {
      setExpiry(numericText);
    }
  };

  const handleCvcChange = (text: string) => {
    // CVC thường có 3-4 số
    setCvc(text.replace(/\D/g, "").substring(0, 4));
  };

  // --- Hàm xử lý thanh toán ---

  const handlePayment = () => {
    if (!cardHolder || !cardNumber || !expiry || !cvc) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin thanh toán.");
      return;
    }
    if (cardNumber.length < 19) {
      Alert.alert("Lỗi", "Số thẻ không hợp lệ.");
      return;
    }
    if (expiry.length < 5) {
      Alert.alert("Lỗi", "Ngày hết hạn không hợp lệ.");
      return;
    }

    // Bắt đầu loading
    setLoading(true);

    // --- Giả lập gọi API thanh toán (mất 2 giây) ---
    setTimeout(() => {
      // Dừng loading
      setLoading(false);

      // Thông báo thành công và điều hướng
      Alert.alert(
        "Thanh toán thành công!",
        "Chào mừng bạn đến với Premium.",
        [
          {
            text: "OK",
            onPress: () => navigation.replace("WelcomePremium"),
          },
        ]
      );
    }, 2000); // 2000ms = 2 giây
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>Chi tiết thanh toán</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Tên chủ thẻ */}
            <Text style={styles.label}>Tên chủ thẻ</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={22}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="NGUYEN VAN A"
                value={cardHolder}
                onChangeText={setCardHolder}
                autoCapitalize="characters"
              />
            </View>

            {/* Số thẻ */}
            <Text style={styles.label}>Số thẻ</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="card-outline"
                size={22}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="1234 5678 1234 5678"
                value={cardNumber}
                onChangeText={handleCardNumberChange}
                keyboardType="number-pad"
                maxLength={19}
              />
            </View>

            {/* Row cho Expiry và CVC */}
            <View style={styles.row}>
              <View style={styles.inputWrapperHalf}>
                <Text style={styles.label}>Ngày hết hạn</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="calendar-outline"
                    size={22}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    value={expiry}
                    onChangeText={handleExpiryChange}
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                </View>
              </View>

              <View style={styles.inputWrapperHalf}>
                <Text style={styles.label}>CVC/CVV</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={22}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    value={cvc}
                    onChangeText={handleCvcChange}
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={{ flex: 1 }} />

          {/* Nút thanh toán */}
          <TouchableOpacity
            style={[styles.payButton, loading && styles.payButtonDisabled]}
            onPress={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.payButtonText}>Thanh toán ngay</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  form: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F2F5",
    borderRadius: 12,
    height: 55,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  inputWrapperHalf: {
    width: "48%",
  },
  payButton: {
    backgroundColor: "#8B5CF6", // Màu tím chủ đạo
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 30,
    // Thêm bóng
    shadowColor: "#8B5CF6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  payButtonDisabled: {
    backgroundColor: "#BCA1F7", // Màu tím nhạt khi loading
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
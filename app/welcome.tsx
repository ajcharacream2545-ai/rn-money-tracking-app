import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();

  const handleStart = () => {
    // 🚀 แก้ไขตรงนี้: กดปุ่มแล้วให้เด้งไปหน้ากรอกเงินเข้า (income) ทันที
    router.replace("/income");
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/images/welcome.png")}
          style={styles.welcomeImage}
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>บันทึก{"\n"}รายรับรายจ่าย</Text>

        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>เริ่มใช้งานแอปพลิเคชัน</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F9F8",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  welcomeImage: { width: 300, height: 420, resizeMode: "contain" },
  contentContainer: { padding: 40, alignItems: "center", marginBottom: 50 },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2D7F73",
    textAlign: "center",
    marginBottom: 50,
    lineHeight: 44,
  },
  button: {
    backgroundColor: "#429690",
    paddingVertical: 16,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    shadowColor: "#429690",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonText: { color: "#ffffff", fontSize: 18, fontWeight: "bold" },
});

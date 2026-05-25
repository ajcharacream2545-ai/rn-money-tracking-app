import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();

  // ตั้งเวลา 2.5 วินาที แล้วให้เด้งไปหน้า welcome อัตโนมัติค่ะ
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/welcome");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.spacer} />

      <View style={styles.centerContent}>
        <Text style={styles.mainTitle}>Money Tracking</Text>
        <Text style={styles.subTitle}>รายรับรายจ่ายของฉัน</Text>
      </View>

      <View style={styles.footerContent}>
        <Text style={styles.creditText}>Created by 6852D10034</Text>
        <Text style={styles.creditSubText}>- SAU -</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#429690",
    justifyContent: "space-between",
    paddingVertical: 60,
  },
  spacer: {
    height: 40,
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  mainTitle: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 20,
    color: "#FFFFFF",
    opacity: 0.9,
    textAlign: "center",
  },
  footerContent: {
    alignItems: "center",
  },
  creditText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FACC15",
    marginBottom: 4,
  },
  creditSubText: {
    fontSize: 14,
    color: "#FACC15",
    fontWeight: "500",
  },
});

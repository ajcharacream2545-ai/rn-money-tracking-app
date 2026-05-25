import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "../services/supabase";

export default function ExpensesScreen() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  const getThaiDate = () => {
    const months = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];
    const date = new Date();
    return `วันที่ ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543}`;
  };

  const handleSave = async () => {
    if (!category.trim() || !amount.trim()) {
      Alert.alert("แจ้งเตือน", "กรุณากรอกข้อมูลให้ครบถ้วนค่ะ ❌");
      return;
    }

    try {
      const { error } = await supabase.from("transactions").insert([
        {
          type: "expense", // 👈 บันทึกเป็นเงินออกเรียบร้อยค่ะ
          category: category,
          amount: parseFloat(amount),
          date: new Date().toISOString().split("T")[0],
        },
      ]);

      if (error) throw error;

      Alert.alert("สำเร็จ", "บันทึกข้อมูลรายจ่ายเรียบร้อยแล้วค่ะ! 🔴", [
        { text: "ตกลง", onPress: () => router.replace("/home") },
      ]);

      setCategory("");
      setAmount("");
    } catch (error) {
      console.error(error);
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้ค่ะ");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerProfileRow}>
          <Text style={styles.profileName}>Ajchara Pidech</Text>
          <Image
            source={require("../assets/images/profole.png")}
            style={styles.topProfileAvatar}
          />
        </View>

        <View style={styles.topHeader}>
          <Text style={styles.headerTitle}>เงินออก</Text>
        </View>

        <Text style={styles.dateText}>{getThaiDate()}</Text>

        <View style={styles.form}>
          <Text style={styles.label}>รายการเงินออก</Text>
          <TextInput
            style={styles.input}
            placeholder="DETAIL"
            value={category}
            onChangeText={setCategory}
          />
          <Text style={styles.label}>จำนวนเงินออก</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>บันทึกเงินออก</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 🧭 แถบปุ่มด้านล่างตรงตาม Figma (หน้าเงินออก: ปุ่มขวาสีขาวไฮไลต์) */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.replace("/income")}
        >
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons
              name="cards-playing-outline"
              size={26}
              color="#A3D1CF"
            />
            <Ionicons
              name="arrow-down-outline"
              size={12}
              color="#A3D1CF"
              style={styles.arrowSubIcon}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.replace("/home")}
        >
          <Ionicons name="home-outline" size={28} color="#A3D1CF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.replace("/expenses")}
        >
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons
              name="cards-playing-outline"
              size={28}
              color="#FFFFFF"
            />
            <Ionicons
              name="arrow-up-outline"
              size={14}
              color="#FFFFFF"
              style={styles.arrowSubIcon}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { flex: 1, padding: 20, paddingTop: 50, marginBottom: 70 },
  headerProfileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  profileName: { fontSize: 18, fontWeight: "bold", color: "#2D7F73" },
  topProfileAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  topHeader: { alignItems: "center", marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#2D7F73" },
  dateText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 30,
  },
  form: { backgroundColor: "#FFFFFF", padding: 10 },
  label: { fontSize: 14, color: "#64748B", marginBottom: 8, fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderColor: "#429690",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 20,
    color: "#1E293B",
  },
  button: {
    backgroundColor: "#429690",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#429690",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: "#2D7F73",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  iconWrapper: { alignItems: "center", justifyContent: "center" },
  arrowSubIcon: { position: "absolute", bottom: -2 },
});

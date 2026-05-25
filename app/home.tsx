import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../services/supabase";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // ดึงวันปัจจุบันเป็นภาษาไทยแบบอาจารย์ (วันที่ 3 มกราคม 2568)
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

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      if (data) setTransactions(data as Transaction[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const totalExpense = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const balance = totalIncome - totalExpense;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#429690" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerProfileRow}>
          <View>
            <Text style={styles.profileName}>Ajchara Pidech</Text>
            <Text style={styles.headerDate}>{getThaiDate()}</Text>
          </View>
          <Image
            source={require("../assets/images/profole.png")}
            style={styles.topProfileAvatar}
          />
        </View>

        {/* 💳 การ์ดยอดเงินคงเหลือ */}
        <View style={styles.balanceCard}>
          <Text style={styles.cardTitle}>ยอดเงินคงเหลือ</Text>
          <Text style={styles.balanceText}>
            {balance.toLocaleString("th-TH", { minimumFractionDigits: 2 })} บาท
          </Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>
              ⬇ เงินเข้า +
              {totalIncome.toLocaleString("th-TH", {
                minimumFractionDigits: 2,
              })}{" "}
              บาท
            </Text>
            <Text style={styles.summaryText}>
              ⬆ เงินออก -
              {totalExpense.toLocaleString("th-TH", {
                minimumFractionDigits: 2,
              })}{" "}
              บาท
            </Text>
          </View>

          {/* 🟢 ปุ่มแฝดตรงกลางตามใบงาน: บันทึกเงินเข้า / บันทึกเงินออก */}
          <View style={styles.buttonActionRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.replace("/income")}
            >
              <Text style={styles.actionButtonText}>+ บันทึกเงินเข้า</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.replace("/expenses")}
            >
              <Text style={styles.actionButtonText}>+ บันทึกเงินออก</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ส่วนแสดงรายการประวัติล่าสุด */}
        <Text style={styles.sectionTitle}>Transactions</Text>
        <Text style={styles.sectionSubTitle}>
          รายการเงินเข้า/เงินออก (เรียงตามวันที่ล่าสุด)
        </Text>

        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View style={styles.itemLeft}>
                <View
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor:
                        item.type === "income" ? "#E8F5E9" : "#FFEBEE",
                    },
                  ]}
                >
                  <Ionicons
                    name={item.type === "income" ? "arrow-down" : "arrow-up"}
                    size={18}
                    color={item.type === "income" ? "#2E7D32" : "#C62828"}
                  />
                </View>
                <View>
                  <Text style={styles.itemCategory}>{item.category}</Text>
                  <Text style={styles.itemDate}>({item.date})</Text>
                </View>
              </View>
              <Text
                style={
                  item.type === "income"
                    ? styles.listIncome
                    : styles.listExpense
                }
              >
                {item.type === "income" ? "+" : "-"}
                {Number(item.amount).toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                })}{" "}
                บาท
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>ยังไม่มีข้อมูลบันทึกในระบบค่ะ</Text>
          }
        />
      </View>

      {/* 🧭 แถบเมนูด้านล่างสุด วิ่งเข้าหน้าเงินออกได้จริง 100% ไม่แดง ไม่แจ้งเตือนเออร์เรอร์ */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.replace("/income")}
        >
          <View style={styles.iconWrapper}>
            <Ionicons name="cash-outline" size={26} color="#A3D1CF" />
            <Ionicons
              name="arrow-down"
              size={12}
              color="#A3D1CF"
              style={styles.arrowIconInBank}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.replace("/home")}
        >
          <Ionicons name="home" size={32} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.replace("/expenses")}
        >
          <View style={styles.iconWrapper}>
            <Ionicons name="cash-outline" size={26} color="#A3D1CF" />
            <Ionicons
              name="arrow-up"
              size={12}
              color="#A3D1CF"
              style={styles.arrowIconInBank}
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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerProfileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  profileName: { fontSize: 20, fontWeight: "bold", color: "#1E293B" },
  headerDate: { fontSize: 14, color: "#64748B", marginTop: 2 },
  topProfileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  balanceCard: {
    backgroundColor: "#1E2E4A",
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
  },
  cardTitle: {
    color: "#94A3B8",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
  balanceText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 8,
  },
  summaryRow: { paddingHorizontal: 10, marginVertical: 5 },
  summaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginVertical: 4,
    fontWeight: "500",
  },

  // ดีไซน์ปุ่มคู่ บันทึกเงินเข้า / เงินออก
  buttonActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#429690",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "bold" },

  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#1E293B" },
  sectionSubTitle: { fontSize: 13, color: "#64748B", marginBottom: 15 },
  listItem: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  itemLeft: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemCategory: { fontSize: 15, fontWeight: "600", color: "#1E293B" },
  itemDate: { fontSize: 12, color: "#94A3B8", marginTop: 1 },
  listIncome: { color: "#2E7D32", fontWeight: "bold", fontSize: 15 },
  listExpense: { color: "#C62828", fontWeight: "bold", fontSize: 15 },
  emptyText: { textAlign: "center", color: "#94A3B8", marginTop: 40 },

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
  arrowIconInBank: { position: "absolute", bottom: 7 },
});

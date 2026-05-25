import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; // 👈 เพิ่มชุดไอคอน
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
          <Text style={styles.profileName}>Ajchara Pidech</Text>
          <Image
            source={require("../assets/images/profole.png")}
            style={styles.topProfileAvatar}
          />
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.cardTitle}>ยอดเงินคงเหลือ</Text>
          <Text style={styles.balanceText}>
            {balance.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
          </Text>

          <View style={styles.row}>
            <View style={styles.box}>
              <Text style={styles.boxTitle}>⬇ ยอดเงินเข้ารวม</Text>
              <Text style={styles.incomeText}>
                {totalIncome.toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.boxTitle}>⬆ ยอดเงินออกรวม</Text>
              <Text style={styles.expenseText}>
                {totalExpense.toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>เงินเข้า/เงินออก</Text>

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
                    size={20}
                    color={item.type === "income" ? "#2E7D32" : "#C62828"}
                  />
                </View>
                <View>
                  <Text style={styles.itemCategory}>{item.category}</Text>
                  <Text style={styles.itemDate}>{item.date}</Text>
                </View>
              </View>
              <Text
                style={
                  item.type === "income"
                    ? styles.listIncome
                    : styles.listExpense
                }
              >
                {Number(item.amount).toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>ยังไม่มีข้อมูลบันทึกในระบบค่ะ</Text>
          }
        />
      </View>

      {/* 🧭 แถบเมนูด้านล่าง (ปรับปรุงไอคอนใหม่ตามรูปเป๊ะๆ) */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.replace("/income")}
        >
          <MaterialCommunityIcons
            name="tray-arrow-down"
            size={30}
            color="#A3D1CF"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.replace("/home")}
        >
          <Ionicons name="home" size={32} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => alert("ระบบเงินออกกำลังพัฒนาค่ะ")}
        >
          <MaterialCommunityIcons
            name="tray-arrow-up"
            size={30}
            color="#A3D1CF"
          />
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
  profileName: { fontSize: 18, fontWeight: "bold", color: "#2D7F73" },
  topProfileAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  balanceCard: {
    backgroundColor: "#2F7E73",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: { color: "#E0F2F1", fontSize: 16, fontWeight: "500" },
  balanceText: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "bold",
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    marginTop: 15,
    borderTopWidth: 0.5,
    borderTopColor: "#529C91",
    paddingTop: 15,
  },
  box: { flex: 1, alignItems: "center" },
  boxTitle: { color: "#E0F2F1", fontSize: 13, marginBottom: 5 },
  incomeText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  expenseText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1E293B",
  },
  listItem: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  itemLeft: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  itemCategory: { fontSize: 16, fontWeight: "600", color: "#1E293B" },
  itemDate: { fontSize: 13, color: "#64748B", marginTop: 2 },
  listIncome: { color: "#429690", fontWeight: "bold", fontSize: 16 },
  listExpense: { color: "#E57373", fontWeight: "bold", fontSize: 16 },
  emptyText: { textAlign: "center", color: "#94A3B8", marginTop: 40 },

  // สไตล์แถบเมนูตาม Figma
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
});

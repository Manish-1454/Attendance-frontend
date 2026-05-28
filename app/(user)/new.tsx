import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";

import { useRouter } from "expo-router";

export default function AttendanceHistory() {
  const [history, setHistory] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchAttendanceHistory();
  }, []);

  const fetchAttendanceHistory = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;

      const res = await api.get(`/attendance/user/${userId}`);
      setHistory(res.data || []);
    } catch (err) {
      console.error("Error fetching attendance history:", err);
    }
  };

 
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🕒 My Attendance History</Text>

      {history.map((record, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.date}>
            {new Date(record.date).toLocaleDateString()}
          </Text>
          <Text>Status: {record.status}</Text>
          <Text>OT Hours: {record.oT ?? 0}</Text>
          <Text>Advance: ₹{record.advance ?? 0}</Text>
        </View>
      ))}

      
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8F9FA" ,marginTop:50, },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },
  date: { fontSize: 16, fontWeight: "600", marginBottom: 5 },
  downloadBtn: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  downloadText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  backBtn: {
    backgroundColor: "#28A745",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  backText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

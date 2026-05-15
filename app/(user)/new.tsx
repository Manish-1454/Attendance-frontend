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
import * as Print from "expo-print";
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

  const generatePDF = async () => {
    if (history.length === 0) {
      Alert.alert("No data", "No attendance records to download");
      return;
    }

    // Build HTML with proper inline CSS
    let html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #444; padding: 8px; text-align: center; }
          th { background-color: #007AFF; color: white; }
        </style>
      </head>
      <body>
        <h1>My Attendance Report</h1>
        <table>
          <tr>
            <th>Date</th>
            <th>Status</th>
            <th>OT Hours</th>
            <th>Advance (₹)</th>
          </tr>
          ${history
            .map((item) => {
              return `
                <tr>
                  <td>${new Date(item.date).toLocaleDateString()}</td>
                  <td>${item.status}</td>
                  <td>${item.oT || item.ot || 0}</td>
                  <td>${item.advance || 0}</td>
                </tr>
              `;
            })
            .join("")}
        </table>
      </body>
    </html>
  `;

    try {
      await Print.printAsync({
        html,
      });
    } catch (err) {
      console.error("Print error:", err);
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

      <TouchableOpacity style={styles.downloadBtn} onPress={generatePDF}>
        <Text style={styles.downloadText}>⬇️ Download Report</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.push("/home")}
      >
        <Text style={styles.backText}>⬅️ Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8F9FA" },
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

import { View, Text, StyleSheet, ActivityIndicator,TouchableOpacity ,Alert} from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from "expo-print";
const SalaryStatus = () => {
  const [history, setHistory] = useState([]);
  const [datas, setDatas] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchUser();
    fetchAttendanceHistory();
  }, [])
  const fetchUser = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');

      if (!userId) {
        setLoading(false);
        return;
      }

      // Call backend route:
      // GET /attendance/salary-status/:userId
      const res = await api.get(`/attendance/salary-status/${userId}`);
      setDatas(res.data);
      console.log(res.data);
      
    } catch (error) {
      console.log('Salary fetch error:', error);
    } finally {
      setLoading(false);
    }
  };
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
;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="green" />
        <Text style={styles.loading}>Loading salary details...</Text>
      </View>
    );
  }

  if (!datas) {
    return (
      <View style={styles.center}>
        <Text style={styles.noData}>No salary data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
     <View style={styles.attendanceBtn}> <Text style={styles.link2} > 📅 View My Attendance History </Text> </View>

      <View style={styles.card}>
        <Text style={styles.label}>Present Days
          (நாள்)
        </Text>
        <Text style={styles.value}>{datas.presentDays}</Text>

     

        <Text style={styles.label}>Total Salary(சம்பளம்)</Text>
        <Text style={styles.value}>₹ {datas.grossSalary}</Text>

        <Text style={styles.label}>Total Advance(அட்வான்ஸ்)</Text>
        <Text style={styles.value}>₹ {datas.totalAdvance}</Text>
        <Text style={styles.label}>Total OT</Text>
        <Text style={styles.value}>₹ {datas.totalAdvance}</Text>

        <Text style={styles.label}>Balance Salary(மீதி)</Text>
        <Text style={styles.balance}>₹ {datas.balanceSalary}</Text>
      </View>

      <TouchableOpacity style={styles.downloadBtn} onPress={generatePDF}>
              <Text style={styles.downloadText}>⬇️ Download Report</Text>
            </TouchableOpacity>
      
    </View>
  );
};

export default SalaryStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding:40,
    marginTop:40
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  noData: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#222',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    fontWeight: '600',
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  balance: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'green',
    marginTop: 8,
  },
   downloadBtn: {
    backgroundColor: "#007AFF",
  padding: 13,
  marginTop:20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  downloadText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  attendanceBtn: { marginBottom: 20, alignItems: 'center' }, link1: { margin: 5, fontWeight: 'bold', borderRadius: 10, padding: 10, backgroundColor: 'red', color: 'white', fontSize: 15 }, link2: { backgroundColor: 'green', color: 'white', fontWeight: 'bold', padding: 10, borderRadius: 10, width: '90%', textAlign: 'center' },
});
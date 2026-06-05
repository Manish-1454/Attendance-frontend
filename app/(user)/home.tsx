import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function DashboardScreen() {
  const [todaySummary, setTodaySummary] = useState({});
  const [weekSummary, setWeekSummary] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchUserSummary = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId'); // 👈 store this at login
      if (!userId) {
  console.log("UserId missing");
  return;
}
      if (!userId) return;

      const [todayRes, weekRes] = await Promise.all([
        api.get(`/attendance/today/${userId}`),
        api.get(`/attendance/week-summary/${userId}`)
      ]);

      setTodaySummary(todayRes.data || {});
      setWeekSummary(weekRes.data || {});
      console.log(todaySummary);
      
    } catch (err) {
      console.error('Dashboard load error', err);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['token', 'role', 'userId']);
    router.replace('/');
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserSummary();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserSummary().finally(() => setRefreshing(false));
  }, []);

  const downloadMyReport = () => {
    alert('📥 Your attendance report is downloading...');
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={[styles.buttons, styles.titleHead]}>
        <Text style={styles.title}>My Dashboard</Text>
        <Text style={styles.link1} onPress={handleLogout}>Logout</Text>
      </View>

      {/* Today */}
      <Text style={styles.title2}>Today</Text>
      <View style={styles.cardRow}>
        <Card title="Today Status" value={todaySummary.todayStatus || 'Not Marked'} color="#22c55e" />
        <Card title="OT Hours" value={todaySummary.todayOT ?? 0} color="#2563eb" />
        <Card title="Advance" value={`₹${todaySummary.todayAdvance ?? 0}`} color="#ef4444" />
      </View>

      {/* Weekly Summary */}
      <Text style={styles.title2}>Weekly Summary</Text>
      <View style={styles.cardRow}>
        <Card title="Present Days" value={weekSummary.presentDays ?? 0} color="#22c55e" />
        <Card title="Half Days" value={weekSummary.halfDays ?? 0} color="#eab308" />
        <Card title="OT Hours" value={weekSummary.totalOT ?? 0} color="#2563eb" />
      </View>
      <View style={styles.cardRow}>
        <Card title="Total Advance" value={`₹${weekSummary.totalAdvance ?? 0}`} color="#ef4444" />
      </View>

      {/* Action Buttons */}
   
      
    </ScrollView>
  );
}

const Card = ({ title, value, color }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={[styles.cardValue, { color: color || '#111' }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9', padding: 16, marginTop: 30, marginBottom: 20 },
  titleHead: { flexDirection: 'row', justifyContent: 'space-between' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center', marginLeft: 20, flex: 1 },
  title2: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginTop: 20 },
  cardRow: { flexDirection: 'column', margin: 10 },
  card: { flex: 1, backgroundColor: '#fff', padding: 12, marginHorizontal: 4, borderRadius: 10, elevation: 3, margin: 15 },
  cardTitle: { fontSize: 14, color: '#6b7280' },
  cardValue: { fontSize: 20, fontWeight: 'bold', marginTop: 4 },
  buttons: { marginTop: 20, alignItems: 'center' },
  attendanceBtn: { marginBottom: 20, alignItems: 'center' },
  link1: { margin: 5, fontWeight: 'bold', borderRadius: 10, padding: 10, backgroundColor: 'red', color: 'white', fontSize: 15 },
  link2: { backgroundColor: 'green', color: 'white', fontWeight: 'bold', padding: 10, borderRadius: 10, width: '90%', textAlign: 'center' },
  link3: { backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', padding: 10, borderRadius: 10, width: '90%', textAlign: 'center' },
});

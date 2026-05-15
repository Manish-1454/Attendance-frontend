import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import api, { BASE_URL } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native'; // <-- Import useFocusEffect

export default function DashboardScreen() {
  const [today, setToday] = useState({});
  const [week, setWeek] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const todayRes = await api.get('/attendance/today');
      const weekRes = await api.get('/attendance/week-summary');
      setToday(todayRes.data || {});
      setWeek(weekRes.data || {});
    } catch (err) {
      console.error('Dashboard load error', err);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('role');
    router.replace('/');
  };

  // Replace useEffect with useFocusEffect
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  }, []);

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
      {/* Header */}
      <View style={[styles.buttons, styles.titleHead]}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.link1} onPress={handleLogout}> Logout </Text>
      </View>

      {/* Today */}
      <Text style={styles.title2}>Today</Text>                               
      <View style={styles.cardRow}>
        <Card title="Male Present" value={today.malepresent ?? 0} color="#22c55e" />
        <Card title="Female Present" value={today.femalepresent ?? 0} color="#ef4444" />
        <Card title="Half Day" value={today.halfDay ?? 0} color="#eab308" />
      </View>
      <View style={styles.cardRow}>
        <Card title="OT Hours" value={today.totalOt ?? 0} />
        <Card title="Advance" value={`₹${today.totaladvance ?? 0}`} />
      </View>

      {/* Weekly */}
      <Text style={styles.title2}>Weekly</Text>
      <View style={styles.cardRow}>
        <Card title="Weekly Male Present" value={week.malepresentDays ?? 0} color="#22c55e" />
        <Card title="Weekly Female Present" value={week.femalepresentDays ?? 0} color="#22c55e" />
        <Card title="Weekly Half Day" value={week.halfDays ?? 0} color="#eab308" />
      </View>
      <View style={styles.cardRow}>
        <Card title="Weekly OT" value={`₹${week.otHours ?? 0} hrs`} />
        <Card title="Weekly Advance" value={`₹${week.advance ?? 0}`} />
      </View>

      {/* Attendance button */}
      <View style={styles.attendanceBtn}>
        <Text style={styles.link2} onPress={() => router.push('/tabs/todayattendance')}> 📋Today Attendance </Text>
      </View>
    </ScrollView>
  );
}

// Safe Card component
const Card = ({ title, value, color }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={[styles.cardValue, { color: color || '#111' }]}>
      {value !== null && value !== undefined ? value : 0}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 16,
    marginTop: 30,
    marginBottom: 20,
  },
  titleHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    marginLeft: 20,
    flex: 1,
  },
  title2: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  cardRow: {
    flexDirection: 'column',
    margin: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 10,
    elevation: 3,
    margin: 15,
  },
  cardTitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  buttons: {
    marginTop: 20,
    alignItems: 'center',
  },
  attendanceBtn: {
    marginBottom: 30,
    alignItems: 'center',
  },
  link1: {
    margin: 5,
    marginBottom: 15,
    fontWeight: 'bold',
    borderRadius: 10,
    elevation: 1,
    padding: 10,
    backgroundColor: 'red',
    color: 'white',
    fontSize: 15,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  link2: {
    backgroundColor: 'green',
    color: 'white',
    fontWeight: 'bold',
    padding: 10,
    borderRadius: 10,
  },
});

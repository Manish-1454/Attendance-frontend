import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const TodayAttendance = () => {
  const [today, setToday] = useState([]);
  const navigation = useNavigation();

  // 🔥 Fetch Data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/attendance/today/attendance');
        setToday(res.data);
      } catch (error) {
        console.error('Error fetching today attendance:', error);
      }
    };

    fetchUser();
  }, []);

  // ✅ FILTER DATA (PRO WAY)
  const maleData = today.filter(
    item => item.gender === 'male' && item.status === 'Present'
  );

  const femaleData = today.filter(
    item => item.gender === 'female' && item.status === 'Present'
  );

  // ✅ COMMON RENDER
  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.text}>
        {index + 1}. {item.name}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* 🔙 Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" color="black" size={28} />
      </TouchableOpacity>

      <Text style={styles.title}>Today Present</Text>

      {/* 👨 Male List */}
      <Text style={styles.sectionTitle}>Male ({maleData.length})</Text>
      <FlatList
        data={maleData}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No male present</Text>}
      />

      {/* 👩 Female List */}
      <Text style={styles.sectionTitle}>Female ({femaleData.length})</Text>
      <FlatList
        data={femaleData}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No female present</Text>}
      />
    </View>
  );
};

export default TodayAttendance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    marginTop: 30,
  },
  itemContainer: {
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginBottom: 10,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'green',
    textTransform: 'capitalize',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    color: 'grey',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  empty: {
    textAlign: 'center',
    color: 'grey',
    marginVertical: 10,
  },
});
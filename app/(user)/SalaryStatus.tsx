import { View, Text,StyleSheet } from 'react-native'
import React, { useState } from 'react'
import api from '../../services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
const SalaryStatus = () => {
const [datas,setdatas]=useState()
const fetchUser=async()=>{
const userId = await AsyncStorage.getItem('userId'); 

const res = await api.get(`attendance/user/${userId}`);
setdatas(res.data)

    }

  return (
    <View>
      <Text>SalaryStatus</Text>
    </View>
  )
}

export default SalaryStatus
const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center", backgroundColor: "#F8F9FA", paddingBottom: 50 },
  loading: { textAlign: "center", marginTop: 100, fontSize: 18 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: "#007AFF", marginBottom: 10 },
  changeImageText: { color: "#007AFF", fontWeight: "600", marginBottom: 20, textAlign: "center" },
  infoContainer: { width: "100%", backgroundColor: "#fff", padding: 20, borderRadius: 20, elevation: 3 },
  label: { fontSize: 14, color: "#555", marginBottom: 5, fontWeight: "600" },
  value: { fontSize: 16, color: "#333", marginBottom: 15 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12, marginBottom: 15 },
  editBtn: { backgroundColor: "#007AFF", padding: 15, borderRadius: 12, alignItems: "center", marginTop: 10 },
  editText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  saveBtn: { backgroundColor: "#28A745", padding: 15, borderRadius: 12, alignItems: "center", marginTop: 10 },
  saveText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
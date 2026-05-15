import { useLocalSearchParams } from "expo-router";
import { useState, useEffect,useCallback } from "react";
import { View, Text, FlatList, StyleSheet,Image, Alert,Button,TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import api from "../../services/api";
import moment from 'moment';
import Salary from "../(admin)/Salary";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function HistoryPage() {
  const navigation=useNavigation();
  const { userId } = useLocalSearchParams();
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(null);
const [showStartPicker, setShowStartPicker] = useState(false);
const [showEndPicker, setShowEndPicker] = useState(false);
  const fetchUsersDetail = async () => {
    try {
      const res = await api.get(`attendance/user/${userId}`);
      const res2 = await api.get(`users/detail/${userId}`);
      setData(res.data);   // attendance list (array)
      setUser(res2.data);  // user detail (single object)
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  const loader=useCallback(() => {
    fetchUsersDetail();
  }, []);

  useFocusEffect(loader)

const unpaidManageFunc = async () => {
  if (!startDate || !endDate) {
    Alert.alert("Error", "Please select start and end date");
    return;
  }

  Alert.alert(
    "Confirm Unpaid",
    `From ${startDate.toDateString()} to ${endDate.toDateString()}`,
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: async () => {
          try {
            await api.put(`/attendance/edit/paid/${userId}`, {
              startDate,
              endDate,
            });

            fetchUsersDetail();
            Alert.alert("Success", "Marked as unpaid ✅");
          } catch (err) {
            console.log(err);
          }
        },
      },
    ]
  );
};
const dayfunction = () => {
  setSelectedFilter('day');

  const today = moment().utcOffset('+05:30').format('YYYY-MM-DD');
  const dayfilter = data.filter(item => 
    moment(item.date).utcOffset('+05:30').format('YYYY-MM-DD') === today
  );
  setData(dayfilter);
  console.log("no data")
};

const filterWeek = () => {
  setSelectedFilter('week');

  const filtered = data.filter(item =>
    moment(item.date).utcOffset('+05:30').isBetween(
      moment().startOf('isoWeek'),
      moment().endOf('isoWeek'),
      undefined,
      '[]'
    )
  );
  setData(filtered);
};


 
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={()=>navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={28} color="black" />

      </TouchableOpacity>
<View style={{alignItems:"center"}}>

      {/* ✅ Display single user info */}
      <Image  source={ user.image?{uri:user.image}: require('../../assets/images/images.png')} style={{width:80,height:80,borderRadius:40}}/>
      <Text style={styles.userTitle}>Worker: {user.name}</Text>
      <Text style={styles.userPhone}>Phone: {user.phonenumber}</Text>
      <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Select Date Range</Text></View>

<TouchableOpacity
  style={styles.dateBtn}
  onPress={() => setShowStartPicker(true)}
>
 <View style={{ flexDirection: "row", alignItems: "center" }}>
  <MaterialIcons name="date-range" size={20} color="black" />
  <Text style={{ marginLeft: 10 }}>
    {startDate ? startDate.toDateString() : "Select Start Date"}
  </Text>
</View>
</TouchableOpacity>

<TouchableOpacity
  style={styles.dateBtn}
  onPress={() => setShowEndPicker(true)}
>
<View style={{ flexDirection: "row", alignItems: "center" }}>
  <MaterialIcons name="date-range" size={20} color="black" />
  <Text style={{ marginLeft: 10 }}>
    {endDate ? endDate.toDateString() : "Select End Date"}
  </Text>
</View>
</TouchableOpacity>

{/* ✅ OUTSIDE TOUCHABLE */}
{showStartPicker && (
  <DateTimePicker
    value={startDate || new Date()}
    mode="date"
    display="default"
    onChange={(event, selectedDate) => {
      setShowStartPicker(false);
      if (selectedDate) setStartDate(selectedDate);
    }}
  />
)}

{showEndPicker && (
  <DateTimePicker
    value={endDate || new Date()}
    mode="date"
    display="default"
    onChange={(event, selectedDate) => {
      setShowEndPicker(false);
      if (selectedDate) setEndDate(selectedDate);
    }}
  />
)}


      <TouchableOpacity style={styles.unpaidBtn} onPress={unpaidManageFunc}>
  <MaterialIcons name="cancel" size={20} color="white" />
  <Text style={styles.unpaidText}>Mark Unpaid</Text>
</TouchableOpacity>
   <View style={styles.daysButton}>
  <TouchableOpacity onPress={dayfunction} style={styles.dayButton}>
    <Text style={styles.onButton} >Today</Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={filterWeek} style={styles.dayButton}>
    <Text style={styles.onButton} >Week</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={fetchUsersDetail} style={styles.dayButton}>
    <Text style={styles.onButton} >All</Text>
  </TouchableOpacity>
</View>



      {/* ✅ Display attendance history list */}
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
            
             {item.status ? <Text style={styles.status}>Status: {item.status}</Text> : null}
            {item.oT? <Text>OT: {item.oT}</Text>:null}
            {item.advance?<Text style={styles.advance}>Advance: ₹{item.advance}</Text> : null}
            <Text>{item.salaryStatus || " "}</Text>
    {item.salaryStatus === 'paid' ? (
  <MaterialIcons name="check-circle" size={20} color="green" />
) : (
  <MaterialIcons name="cancel" size={20} color="red" />
)}
          </View>    
        )}
         contentContainerStyle={{ paddingBottom: 100 }}
      /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, marginTop: 40 },
  userTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  userPhone: { fontSize: 16, color: 'grey', marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },

 daysButton: {
  flexDirection: 'row',
  justifyContent: 'space-around', // space between Today and Week
  marginBottom: 20,
  paddingHorizontal: 10,
  backgroundColor:'#fff',
  borderRadius:10,


},

dayButton: {
  color:'white',
 
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 25,
  margin:5,


},
onButton:{
  color:'white',
  backgroundColor:'green',
   paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 25,
  fontWeight:'bold',

},
dateBtn: {
  backgroundColor: '#eee',
  padding: 12,
  borderRadius: 10,
  marginTop: 10,
},
status:{
  color:'green',

},
advance:{
  color:'red',
},
unpaidBtn: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#dc3545', // red
  paddingVertical: 12,
  borderRadius: 10,
  marginTop: 15,
  marginBottom:10,
},

unpaidText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
  marginLeft: 8,
},



});

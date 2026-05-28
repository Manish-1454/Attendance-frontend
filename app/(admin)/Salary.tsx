import { View, Text, StyleSheet, FlatList, TextInput, Button,TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState ,useCallback} from 'react';
import api from '../../services/api';
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import logo from '../../assets/images/logo.png'
import { useFocusEffect } from '@react-navigation/native';

export default function Salary() {
  const [summaryData, setSummaryData] = useState([]);
  
  const [search, setSearch] = useState('');
const [empty,setEmpty]=useState('')
const [protect,setproduct]=useState(true);

const loader=useCallback(()=>{
  fetchSalary();

},[])
useFocusEffect(loader)

    const fetchSalary = async () => {
      const res = await api.get('/attendance/');

      const attendance = res.data;
   attendance==''?setEmpty('empty'):null

      const grouped = {};

      attendance.forEach((item) => {
        const name = item.name;

        if (!grouped[name]) {
          grouped[name] = {
            name: name,
            presentDays: 0,
            oT: 0,
            advance: 0,
            salaryPerDay:item.salaryPerDay || 0,
          };
        }if (item.status) {
  if (item.status === 'Present') {
    grouped[name].presentDays += 1;
  }
}
if (item.salaryPerDay) {
  grouped[name].salaryPerDay = item.salaryPerDay;
}
        grouped[name].oT += item.oT|| 0;
        grouped[name].advance += item.advance || 0;
        
      });

      const summaryArray = Object.values(grouped).map((user) => {
        const baseSalary = user.presentDays * (user.salaryPerDay || 0);
        return {
          ...user,
          baseSalary,
          total: (baseSalary || 0) - user.advance + user.oT,
        };
      });

      setSummaryData(summaryArray);
    };
   

  const PaidManagement=async(paidStatus)=>{
  Alert.alert(
    "Confirm Attendance",
    "Click OK",

    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          try {
          

            await api.put('/attendance/edit/paid',paidStatus);
            loader();
           
          } catch (err) {
            console.log(err);
          }
        },
      },
    ]
  );
}
  
const downloadPdf = async () => {
  try {
    const totalPaid = summaryData.reduce((sum, item) => sum + item.total, 0);

    const html = `
      <html>
        <body style="font-family: Arial; padding: 10px;">
          <h1 style="text-align:center;">Salary Summary</h1>

          <table border="1" style="width:100%; border-collapse:collapse; text-align:center;">
            <tr style="background-color:#f2f2f2;">
              <th>Name</th>
              <th>Days</th>
              <th>Salary</th>
              <th>Advance</th>
              <th>OT</th>
              <th>Total</th>
            </tr>

            ${summaryData.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.presentDays}</td>
                <td>₹${item.baseSalary}</td>
                <td>₹${item.advance}</td>
                <td>₹${item.oT}</td>
                <td><b>₹${item.total}</b></td>
              </tr>
            `).join("")}

          </table>

          <h3 style="text-align:right; margin-top:20px;">
            Total Paid: ₹${totalPaid.toLocaleString("en-IN")}
          </h3>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });

    console.log("PDF generated:", uri);

    await Sharing.shareAsync(uri);

  } catch (err) {
    console.error("PDF error:", err);
  }
};

  // Filter based on search input
  const filteredData = summaryData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPaid = filteredData.reduce((sum, item) => sum + item.total, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salary</Text>
      <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-between',margin:20}} >
        <Button
        title='Download PDF'
        onPress={downloadPdf}
        />

        <Button
        title='paid'
        onPress={async()=>{ await PaidManagement('paid'); fetchSalary()}}

        />
      </TouchableOpacity>

      <TextInput
        placeholder="🔍 Search by name"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {empty==='empty'?<Text style={styles.Emptydata}>No Data</Text>:
   
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.name}
        ListHeaderComponent={() => (
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerCell]}>பெயர்</Text>
            <Text style={[styles.cell, styles.headerCell]}>நாள்</Text>
            <Text style={[styles.cell, styles.headerCell]}>சம்பளம்</Text>
            <Text style={[styles.cell, styles.headerCell]}>அட்வான்ஸ்</Text>
            <Text style={[styles.cell, styles.headerCell]}>OT</Text>
            <Text style={[styles.cell, styles.headerCell]}>மீதி</Text>
          </View>
        )}
        renderItem={({ item }) => (

          <View style={styles.row}>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.presentDays}</Text>
            <Text
  style={[
    styles.cell,
    item.baseSalary < 0 && styles.minusSalary
  ]}
>
  ₹{item.baseSalary || 0}
</Text>
           <Text style={styles.cell}>₹{item.advance}</Text>
            <Text style={styles.cell}>₹{item.oT}</Text>
            <Text style={styles.cell}>₹{item.total}</Text>
          </View>
        )}
      />}
      {empty==='empty'?null:
     <Text style={styles.totalSummary}>
        Total Paid: ₹{totalPaid.toLocaleString('en-IN')}
      </Text> }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  Emptydata:{
  justifyContent:'center',
  textAlign:'center',
  alignItems:'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 4,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  headerRow: {
    borderBottomWidth: 2,
    borderColor: '#000',
    backgroundColor: '#f8f8f8',
    paddingVertical: 6,
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#d11a2a',
    fontSize: 15,
  },
  totalSummary: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
    alignSelf: 'flex-end',
  },
minusSalary: {
  color: "red",
  fontWeight: "bold",
},
});

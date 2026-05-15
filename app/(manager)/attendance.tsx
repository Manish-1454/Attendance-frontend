import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import api, { BASE_URL } from "../../services/api";
import { useFocusEffect } from "@react-navigation/native";

export default function AttendancePage() {
  const [users, setUsers] = useState([]);
  const [marked, setMarked] = useState({});
  const [advance, setAdvance] = useState({});
  const [ot, setot] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("attendance");

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // ✅ Load data on screen focus
  const loadData = useCallback(() => {
    fetchUsers();
    fetchAttendance();
  }, []);

  useFocusEffect(loadData);

  // ✅ Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users/admin/dashboard");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };







  // ✅ Fetch Attendance
  const fetchAttendance = async () => {
    try {
      const res = await api.get("/attendance/all");

      const todayRecords = res.data.filter((record) =>
        record.date.startsWith(todayStr) && record.status
      );

      const markedStatus = {};
      todayRecords.forEach((record) => {
        markedStatus[record.userId] = {
          status: record.status,
          date: record.date,
        };
      });

      setMarked(markedStatus);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Attendance
  const markAttendance = async (userId, status) => {
    try {
      const payload = {
        userId,
        status,
        advance: Number(advance[userId]) || 0,
        date: todayStr,
      };

      if (marked[userId]?.date?.startsWith(todayStr) && editMode) {
        await api.put(`/attendance/edit/${userId}`, payload);
      } else {
        await api.post("/attendance/mark", payload);
      }

      loadData();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Advance input change
  const handleAdvanceChange = (value, userId) => {
    setAdvance((prev) => ({
      ...prev,
      [userId]: value,
    }));
  };

  // ✅ Save Advance
  const markAdvance = async (userId) => {
   
try{
      await api.post("/attendance/advance", {
        userId,
        advance: Number(advance[userId]) || 0,
      });

      // clear input
      setAdvance((prev) => ({
        ...prev,
        [userId]: "",
      }));

      loadData();

      Alert.alert("Advance " ,"Successfully Marked ✅");
    }
    catch(err){
      Alert.alert(`Error for Advance${err}`)
    }
  };

  // ✅ OT input change
  const handleOtChange = (value, userId) => {
    setot((prev) => ({
      ...prev,
      [userId]: value,
    }));
  };

  // ✅ Save OT
  const markOt = async (userId,name) => {
    try {
      const payload = {
        oT: Number(ot[userId]) || 0,
        userId,
      };

      await api.post(`/attendance/ot`, payload);

      setot((prev) => ({
        ...prev,
        [userId]: "",
      }));

      loadData();

      Alert.alert(`OverTime`,"Successfully Marked ✅");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Mark Attendance</Text>

      <Text style={{ textAlign: "center", marginBottom: 10 }}>
        {today.toLocaleDateString()}
      </Text>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "attendance" && styles.activeTab]}
          onPress={() => setActiveTab("attendance")}
        >
          <Text style={styles.tabText}>Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === "advance" && styles.activeTab]}
          onPress={() => setActiveTab("advance")}
        >
          <Text style={styles.tabText}>Advance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === "ot" && styles.activeTab]}
          onPress={() => setActiveTab("ot")}
        >
          <Text style={styles.tabText}>OT</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Mode */}
      <TouchableOpacity
        onPress={() => setEditMode(!editMode)}
        style={styles.editButton}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          {editMode ? "Cancel Edit Mode" : " Edit Mode"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <Image
                source={
                  item.image
                    ? { uri: item.image }
                    : require("../../assets/images/images.png")
                }
                style={styles.profileImage}
              />
              <Text style={styles.name}>{item.name}</Text>
            </View>

            <View style={styles.rightColumn}>
              {/* Attendance */}
              {activeTab === "attendance" && (
                <>
                  <View style={styles.buttonRow}>
                    <Button
                      title="Present"
                      onPress={() => markAttendance(item._id, "Present")}
                      color="green"
                      disabled={marked[item._id] && !editMode}
                    />
                    <Button
                      title="Absent"
                      onPress={() => markAttendance(item._id, "Absent")}
                      color="red"
                      disabled={marked[item._id] && !editMode}
                    />
                  </View>

                <Text
  style={[
    styles.status,
    marked[item._id]?.status === "Present" && styles.present,
    marked[item._id]?.status === "Absent" && styles.absent,
    !marked[item._id]?.status && styles.notMarked,
  ]}
>
  {marked[item._id]?.status || "Not marked"}
</Text>
                </>
              )}

              {/* Advance */}
              {activeTab === "advance" && (
                <View>
                  <TextInput
                    placeholder="Advance"
                    style={styles.input}
                    value={advance[item._id] || ""}
                    onChangeText={(text) => handleAdvanceChange(text, item._id)}
                    keyboardType="numeric"
                  />

                  <TouchableOpacity
                    style={styles.okButton}
                    onPress={() => markAdvance(item._id)}
                  >
                    <Text style={{ color: "white" }}>OK</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* OT */}
              {activeTab === "ot" && (
                <View>
                  <TextInput
                    placeholder="OT"
                    style={styles.input}
                    value={ot[item._id] || ""}
                    onChangeText={(text) => handleOtChange(text, item._id,item.name)}
                    keyboardType="numeric"
                  />

                  <TouchableOpacity
                    style={styles.okButton}
                    onPress={() => markOt(item._id)}
                  >
                    <Text style={{ color: "white" }}>OK</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { padding: 20,paddingTop:40, flex: 1, backgroundColor: "#f3f3f3" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
    gap: 10,
  },
  tabButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeTab: { backgroundColor: "#007bff" },
  tabText: { color: "#fff", fontWeight: "bold" },
  editButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  leftColumn: { flex: 1, alignItems: "flex-start" },
  rightColumn: { flex: 1.2, alignItems: "flex-end" },
  profileImage: { width: 82, height: 82, borderRadius: 41, marginBottom: 5 },
  name: { fontSize: 18, fontWeight: "bold", textTransform: "capitalize" },
  buttonRow: { flexDirection: "row", gap: 8, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 6,
    padding: 6,
    width: 100,
    marginBottom: 5,
    textAlign: "center",
  },
  present: {
  color: "green",
  fontWeight: "bold",
},
absent: {
  color: "red",
  fontWeight: "bold",
},
notMarked: {
  color: "gray",
  fontStyle: "italic",
},
  okButton: {
    backgroundColor: "green",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 5,
  },
  status: { fontWeight: "bold", fontSize: 14 },
});

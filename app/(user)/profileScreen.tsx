import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert,ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import api, { BASE_URL } from "../../services/api";

export default function EditableProfile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: "", phonenumber: "" });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);  
  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
      setEditData({
        name: res.data.name || "",
        phonenumber: res.data.phonenumber || "",
      });
      setImage(res.data.image || null);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Pick a new profile image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) setImage(result.assets[0].uri);
  };

  // Update user profile
  const updateProfile = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("phonenumber", editData.phonenumber);

      if (image && image.startsWith("file")) {
        formData.append("image", {
          uri: image,
          name: "profile.jpg",
          type: "image/jpeg",
        });
      }

      await api.post(`/users/update/${user._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("Success", "Profile updated successfully!");
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      console.error("Update error:", err);
      Alert.alert("Error", "Failed to update profile");
    } finally{
      setLoading(false);
    }
  };

  if (!user) return <Text style={styles.loading}>Loading...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Image */}
      <View style={styles.infoContainer}>
        <TouchableOpacity onPress={editMode ? pickImage : null}>
        <Image
          source={
            image
              ? { uri: image.startsWith("http") ? image : image }
              : require("../../assets/images/images.png")
          }
          style={styles.avatar}
        />
        {editMode && <Text style={styles.changeImageText}>Change Photo</Text>}
      </TouchableOpacity>

      {/* Profile Info */}
      
        <Text style={styles.label}>Name</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={editData.name}
            onChangeText={(text) => setEditData({ ...editData, name: text })}
          />
        ) : (
          <Text style={styles.value}>{user.name}</Text>
        )}

        <Text style={styles.label}>Phone Number</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={editData.phonenumber}
            keyboardType="phone-pad"
            onChangeText={(text) => setEditData({ ...editData, phonenumber: text })}
          />
        ) : (
          <Text style={styles.value}>{user.phonenumber}</Text>
        )}

        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{user.role}</Text>

        <Text style={styles.label}>Gender</Text>
        <Text style={styles.value}>{user.gender}</Text>

        {/* Buttons */}
        {editMode ? (
          <TouchableOpacity
  style={styles.saveBtn}
  onPress={updateProfile}
  disabled={loading}
>
  {loading ? (
    <ActivityIndicator size="small" color="#fff" />
  ) : (
    <Text style={styles.saveText}>💾 Save Changes</Text>
  )}
  {loading && (
  <View style={styles.overlay}>
    <ActivityIndicator size="large" color="#007AFF" />
    <Text style={{ marginTop: 10 }}>
      Uploading image...
    </Text>
  </View>
)}
</TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.editBtn} onPress={() => setEditMode(true)}>
            <Text style={styles.editText}> Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>

    
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center", backgroundColor: "#F8F9FA", paddingBottom: 50, marginTop:80},
  loading: { textAlign: "center", marginTop: 100, fontSize: 18 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 1, borderColor: "#767b81", marginBottom: 10 ,alignSelf:"center"},
  changeImageText: { color: "#007AFF", fontWeight: "600", marginBottom: 20, textAlign: "center" },
  infoContainer: { width: "100%", backgroundColor: "#fff", padding: 20, borderRadius: 20, elevation: 3 },
  label: { fontSize: 18, color: "#000000", marginBottom: 5, fontWeight: "bold" },
  value: { fontSize: 16, color: "#333", marginBottom: 15 ,textTransform:"capitalize"},
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12, marginBottom: 15 },
  editBtn: { backgroundColor: "#007AFF", padding: 15, borderRadius: 12, alignItems: "center", marginTop: 10 },
  editText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  saveBtn: { backgroundColor: "#28A745", padding: 15, borderRadius: 12, alignItems: "center", marginTop: 10 },
  saveText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  overlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.3)",
  zIndex: 999,
},
});

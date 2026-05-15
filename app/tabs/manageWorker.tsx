import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  Alert,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';
import {  router } from 'expo-router';

export default function ManageWorker() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [salaryPerDay, setSalaryPerDay] = useState('');
  const [image, setImage] = useState<any>(null);
const[loading,setloading]=useState(false)
const [role, setRole] = useState('worker');

  // ✅ Pick image using Expo SDK 49+
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  

const handleSubmit = async () => {
  try {
    if (!name || !password || !gender || !phonenumber || !salaryPerDay) {
      Alert.alert('Please fill all fields!');
      return;
    }

    setloading(true); // 🔥 START LOADING

    const formData = new FormData();

    formData.append('name', name);
    formData.append('password', password);
    formData.append('gender', gender);
    formData.append('phonenumber', phonenumber);
    formData.append('salaryPerDay', salaryPerDay);
    formData.append('role', role);

    if (image) {
      formData.append("image", {
        uri: image.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      });
    }

    const response = await api.post('/users/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    Alert.alert('Success!', 'Worker added successfully');

    setName('');
    setPassword('');
    setGender('');
    setPhonenumber('');
    setSalaryPerDay('');
    setImage(null);
    setRole('');

    router.push('/(admin)/displayWorkers');

  } catch (error) {
    console.error('Submit error:', error);
    Alert.alert('Error!', 'Something went wrong');
  } finally {
    setloading(false); // 🔥 STOP LOADING
  }
};


  return (
    <View style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Gender</Text>
      <TextInput style={styles.input} value={gender} onChangeText={setGender} />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        value={phonenumber}
        onChangeText={setPhonenumber}
      />

      <Text style={styles.label}>Salary Per Day</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={salaryPerDay}
        onChangeText={setSalaryPerDay}

      />
      <Text style={styles.label}>Role</Text>

<View style={{ flexDirection: "row", marginTop: 5 ,marginBottom:5}}>
  <TouchableOpacity
    onPress={() => setRole("worker")}
    style={{
      padding: 10,
      backgroundColor: role === "worker" ? "green" : "#ccc",
      borderRadius: 10,
      marginRight: 10
    }}
  >
    <Text style={{ color: "#fff" }}>Worker</Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => setRole("manager")}
    style={{
      padding: 10,
      backgroundColor: role === "manager" ? "blue" : "#ccc",
      borderRadius: 10
    }}
  >
    <Text style={{ color: "#fff" }}>Manager</Text>
  </TouchableOpacity>
</View>

      <Button title="Pick an Image" onPress={pickImage} />
      {image && <Image source={{ uri: image.uri }} style={styles.image} />}

      <View style={{ marginTop: 20 }}>
        <Button title="Submit" onPress={handleSubmit} color="green" />
      </View>
    </ScrollView>
    {loading && (
      <View style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.3)"
      }}>
        <ActivityIndicator size="large" color="#03690b" />
      </View>
    )}
  </View>
  )}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'stretch',
    paddingBottom: 50,
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    
  },
  image: {
    marginTop: 15,
    width: '100%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
  },
});

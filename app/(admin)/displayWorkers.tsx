import { router } from 'expo-router';
import api, { BASE_URL } from '../../services/api';
import { useEffect, useState,useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  Button,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from '@react-navigation/native';

export default function DisplayWorkers() {
  const [worker, setWorkers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [name, setName] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [salaryPerDay, setsalaryPerDay] = useState('');
  const [image, setImage] = useState(null);


const fetchUsers = useCallback(async () => {
  const res = await api.get('/users/admin/dashboard');
  setWorkers(res.data);
  setFilteredData(res.data);
}, []);
useFocusEffect(
  useCallback(() => {
    fetchUsers();
  }, [fetchUsers])
);
 
  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = worker.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase()) ||
      String(item.phonenumber || '').includes(text)
    );
    setFilteredData(filtered);
  };

  const history = (userId: string) => {
    router.push(`/history/${userId}`);
  };

  const goToManagePage = () => {
    router.push('/tabs/workersManage');
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setName(user.name);
    setPhonenumber(String(user.phonenumber));
    setsalaryPerDay(String(user.salary || ''));
    setImage(null);
    setEditModalVisible(true);
  };

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
 
const handleUpdate = async () => {
  if (!selectedUser) return;

  const formData = new FormData();
  formData.append('name', name);
  formData.append('phonenumber', phonenumber);
  formData.append('salaryPerDay', salaryPerDay);



   if (image) {
      formData.append('image', {
        uri: image.uri,
        name: 'image.jpg',
        type:'image/jpeg',
      }); // ✅ Important for TypeScript
    }

  try {
    await api.post(`/users/update/${selectedUser._id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        
      },
    });
    Alert.alert("Updated Successfully")

    setEditModalVisible(false);
    fetchUsers();
  } catch (err) {
    console.error('Update failed:', err?.response?.data || err.message);
  }
};


  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or phone"
          value={searchText}
          onChangeText={handleSearch}
        />

        <TouchableOpacity onPress={goToManagePage} style={styles.manageBtn}>
          <Text style={styles.manageText}>Manage →</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={
                item.image
                  ? { uri: item.image
                   }
                  : require('../../assets/images/images.png')
              }
              style={styles.profileImage}
            />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.number}>{item.phonenumber}</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity onPress={() => history(item._id)}>
                  <Text style={styles.openBtn}>Open</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openEditModal(item)}>
                  <Text style={[styles.openBtn, { backgroundColor: 'orange' }]}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* Edit Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
  <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', backgroundColor: '#000000aa', padding: 20 }}>
    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
      <Text style={styles.label}>Name</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        value={phonenumber}
        onChangeText={setPhonenumber}
        style={styles.input}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Salary Per Day</Text>
      <TextInput
        value={salaryPerDay}
        onChangeText={setsalaryPerDay}
        style={styles.input}
        keyboardType="numeric"
      />

      <Button title="Choose Image" onPress={pickImage} />

      {image ? (
        <Image source={{ uri: image.uri }} style={styles.image} />
      ) : selectedUser?.image ? (
        <Image
          source={{ uri: `${BASE_URL}/uploads/${selectedUser.image.replace(/\\/g, '/')}` }}
          style={styles.image}
        />
      ) : null}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
        <Button title="Cancel" color="red" onPress={() => setEditModalVisible(false)} />
        <Button title="Save" onPress={handleUpdate} color="green" />
      </View>
    </View>
  </ScrollView>
</Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f7',
    paddingTop: 40,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    marginBottom: 10,
  },
  manageBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#007bff',
    borderRadius: 20,
  },
  manageText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: '#333',
    marginBottom: 4,
  },
  number: {
    fontSize: 14,
    color: 'grey',
    marginBottom: 10,
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
  resizeMode: 'cover',
  borderRadius: 10,
},

  openBtn: {
    backgroundColor: 'green',
    color: 'white',
    fontWeight: 'bold',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
    textAlign: 'center',
    overflow: 'hidden',
  },
});

export const options = {
  headerShown: false,
};

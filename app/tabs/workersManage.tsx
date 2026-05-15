import { View, StyleSheet, FlatList, Image, Text, TouchableOpacity, Button,Modal,ScrollView,TextInput, Alert } from "react-native";
import { useState, useEffect ,useCallback} from "react";
import api, { BASE_URL } from '../../services/api';
import { router } from "expo-router";
import { useNavigation } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';

 const WorkerManagement=()=> {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [salaryPerDay, setsalaryPerDay] = useState('');
  const [image, setImage] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const navigate=useNavigation();

  const [selectedUser, setSelectedUser] = useState(null);
const fetchData = async () => {
      const res = await api.get('/users/admin/dashboard');
      setData(res.data);
      setFilteredData(res.data);
    };
  const loader=useCallback(() => {
    
    fetchData();
  }, []);

  useFocusEffect(loader)

  const confirmDelete = (id: string) => {
    setSelectedIdToDelete(id);
    setShowModal(true);
  };

  const deleteData = async () => {
    if (!selectedIdToDelete) return;

    try {
      const res = await api.delete(`users/delete/${selectedIdToDelete}`);
      const updated = data.filter((item) => item._id !== selectedIdToDelete);
      setData(updated);
      setFilteredData(updated);

      setShowModal(false);
      setSelectedIdToDelete(null);
      Alert.alert('Deleted', 'Worker deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      Alert.alert('Error', 'Something went wrong while deleting');
    }
  };

  const goToManagePage = () => {
    router.push('/tabs/manageWorker');
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
   const openEditModal = (user) => {
    setSelectedUser(user);
    setName(user.name);
    setPhonenumber(String(user.phonenumber));
  setsalaryPerDay(String(user.salaryPerDay || ''));
    setImage(null);
    setEditModalVisible(true);
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase()) ||
      String(item.phonenumber || '').includes(text)
    );
    setFilteredData(filtered);
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
    Alert.alert("Update",`User Successfully Updated ✅`)

    setEditModalVisible(false);
    fetchData();
  } catch (err) {
    console.error('Update failed:', err?.response?.data || err.message);
  }
};




  return (
    <View style={styles.container}>
      {/* 🔍 Search + ➕ Add Worker Button */}
      <TouchableOpacity onPress={()=>navigate.goBack()}>
        <MaterialIcons name="arrow-back" color="black" size={28}/>

      </TouchableOpacity>
      <View style={styles.topContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or phone"
          value={searchText}
          onChangeText={handleSearch}
        />
        <TouchableOpacity onPress={goToManagePage} style={styles.manageBtn}>
          <Text style={styles.manageText}>Add +</Text>
        </TouchableOpacity>
      </View>

      {/* 👥 Worker List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={
                item.image
                  ? { uri: item.image}
                  : require('../../assets/images/images.png')
              }
              style={styles.profileImage}
            />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.number}>{item.phonenumber}</Text>
              <View style={styles.btnContainer}>
               <TouchableOpacity onPress={() => openEditModal(item)} style={styles.updateBtn}>
                                <Text style={styles.btnText}>Update</Text>
                              </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item._id)}>
                  <Text style={styles.btnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* ⚠️ Delete Confirmation Modal */}
      {showModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalCloseIcon} onPress={() => setShowModal(false)}>
              <Text style={{ color: 'white', fontSize: 24 }}>×</Text>
            </TouchableOpacity>
            <Text style={styles.modalText}>Are you sure you want to delete the download?</Text>
            <TouchableOpacity style={styles.modalDeleteBtn} onPress={deleteData}>
              <Text style={styles.modalDeleteText}>Delete Download</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}


  

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
)}
export default WorkerManagement;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f4f7',
    paddingTop: 40,
    paddingHorizontal: 16,
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
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
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    marginVertical: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    alignItems: 'center',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  number: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  updateBtn: {
    backgroundColor: '#28a745',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    color:"white",
    
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Modal styles
  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#222',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    position: 'relative',
  },
  modalText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  modalDeleteBtn: {
    backgroundColor: '#ff3333',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
  },
  modalDeleteText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalCloseIcon: {
    position: 'absolute',
    top: 10,
    right: 15,
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

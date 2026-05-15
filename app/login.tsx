import { View, TextInput, Text, TouchableOpacity, StyleSheet ,ActivityIndicator} from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';

export default function LoginScreen() {
  const [name, setname] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setshowAlert] = useState(false);
  const [showSetLoginCard, setShowLoginCard] = useState(false);
  const [loading,setloading]=useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoginCard(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

 const handleLogin = async () => {
  // Validate inputs
  if (!name.trim() || !password.trim()) {
    setshowAlert(true);
    return;
  }

  try {
    // Start loading BEFORE API call
    setloading(true);

    const res = await api.post('/auth/login', {
      name: name.trim(),
      password: password.trim(),
    });

    // Save data
    await AsyncStorage.setItem('token', res.data.token);
    await AsyncStorage.setItem('role', res.data.role);
    await AsyncStorage.setItem('userId', res.data.id);

    console.log('Token:', res.data.token);

    // Navigate based on role
    if (res.data.role === 'admin') {
      router.replace('/(admin)/dashboard');
    } else if (res.data.role === 'manager') {
      router.replace('/(manager)/dashboard');
    } else if (res.data.role === 'worker') {
      router.replace('/(user)/home');
    } else {
      setshowAlert(true);
    }
  } catch (err: any) {
    console.error(
      'Login Error:',
      err?.response?.data || err?.message || err
    );
    setshowAlert(true);
  } finally {
    // Always stop loading
    setloading(false);
  }
};

  return (
    <View style={styles.body}>
      <Image
        source={require("../assets/images/Login-bg.jpg")}
        style={styles.Img}
        contentFit="cover"
      />
      <BlurView intensity={60} tint="light" style={styles.blur} />

      {showAlert && (
        <View style={styles.alertBox}>
          <Text style={styles.alertTitle}>Error</Text>
          <Text style={styles.alertMessage}>Login Failed</Text>
          <TouchableOpacity onPress={() => setshowAlert(false)} style={styles.alertButton}>
            <Text style={styles.alertButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      )}

      {showSetLoginCard && (
        <>
          {/* Header with Image and Text */}
          <View style={styles.headerContainer}>
            <Image
              source={require("../assets/images/workerimg.png")}
              style={styles.logoimg}
            />
            <Text style={styles.welcomeText}>Welcome Workers,{'\n'}Please Login</Text>
          </View>

          {/* Login Card */}
          <View style={styles.loginCard}>
            <TextInput
              placeholder="Enter your username"
              value={name}
              onChangeText={setname}
              style={styles.input}
              autoCapitalize="none"
            />

            <TextInput
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />

          <TouchableOpacity
  onPress={handleLogin}
  style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
  disabled={loading}
>
  {loading ? (
    <ActivityIndicator color="#fff" size="small" />
  ) : (
    <Text style={styles.loginText}>Login</Text>
  )}
</TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  Img: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    zIndex: -3,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -2,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  logoimg: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginRight: 15,
  },
  welcomeText: {
    color: '#0e0d0dff',
    fontSize: 20,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  loginCard: {
    width: '85%',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
    zIndex: 1,
  },
  input: {
    backgroundColor: '#f0f0f0',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontWeight: '500',
    fontSize: 15,
  },
  loginBtn: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 40,
    width: '100%',
    marginTop: 10,
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loginBtnDisabled: {
  opacity: 0.7,
},
  alertBox: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    right: '10%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 999,
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '700',
  },
  alertButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  alertButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

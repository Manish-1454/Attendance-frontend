import { router, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function RootLayout() {


  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const role = await AsyncStorage.getItem('role');

        if (token && role === 'admin') {
          router.replace('/(admin)/dashboard');
        } else if (token && role === 'manager') {
          router.replace('/(manager)/dashboard');
        } else if (token && role === 'worker') {
          router.replace('/(user)/home');
        } else {
          router.replace('/');
        }
      } catch (error) {
        console.log('Startup Error:', error);
        router.replace('/');
      } 
    };

    checkLogin();
  }, []);


  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
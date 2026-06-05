import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BASE_API_URL = 'https://attendance-backend-ycm9.onrender.com/api';
const BASE_URL = 'https://attendance-backend-ycm9.onrender.com/api';    
const api = axios.create({
  baseURL: BASE_API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;



});
export { BASE_URL };
export default api;

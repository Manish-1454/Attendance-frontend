import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BASE_API_URL = 'https://attendance-backend-production-831a.up.railway.app/api';
const BASE_URL = 'https://attendance-backend-production-831a.up.railway.app/api';    
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

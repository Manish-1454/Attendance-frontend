import { MaterialIcons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'

const AdminLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="displayWorkers"
        options={{
          title: "Workers",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="groups" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen 
      name="attendance"
      options={{
        title:"Attendance",
        tabBarIcon:({color,size})=>(
            <MaterialIcons name="schedule" size={size} color={color} />
        ),
      }} />

      <Tabs.Screen 
      name='Salary'
      options={{
        title:"Salary",
        tabBarIcon:({color,size})=>(
  <MaterialIcons name="paid" size={size} color={color}/>
        ),
      }}/>
    </Tabs>
    
  );
};

export default AdminLayout;

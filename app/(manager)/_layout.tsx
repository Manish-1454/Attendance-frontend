import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "react-native/Libraries/NewAppScreen";

const layout=()=>{
    return(
        <Tabs screenOptions={{headerShown:false}} initialRouteName="dashboard">
            <Tabs.Screen
            name="dashboard"
            options={{
                title:"Dashboard",
                tabBarIcon:({size,color})=>(
                    <MaterialIcons name="dashboard" size={size} color={color}/>)
            }}
            />
            
        <Tabs.Screen
        name="attendance"
        options={{
            title:"Attendance",
            tabBarIcon:({color,size})=>(
                <MaterialIcons name="schedule" color={color} size={size} />
            ),
        }}
        />
        <Tabs.Screen
        name="TodayReport"
        options={{
            title:"Today Report",
            tabBarIcon:({color,size})=>(
                <MaterialIcons name="schedule" color={color} size={size} />
            ),

        }} 
        />
            
        </Tabs>

    );

}
export default layout;
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";


const layout=()=>{
    return(
        <Tabs screenOptions={{headerShown:false}} initialRouteName="home">
            <Tabs.Screen
            name="home"
            options={{
                title:"home",
                tabBarIcon:({size,color})=>(
                    <MaterialIcons name="home" size={size} color={color}/>)
            }}
            />
            
            <Tabs.Screen
            name="new"
            options={{
                title:"Report",
                tabBarIcon:({size,color})=>(
                    <MaterialIcons name="report" size={size} color={color}/>)
            }}
            />
            
        
            
        </Tabs>

    );

}
export default layout;
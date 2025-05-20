import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import FavoritosScreen from "../screens/FavoritosScreen";
import { View, Text } from "react-native";

const Tab = createBottomTabNavigator();

export default function BottomTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Favoritos") {
            iconName = focused ? "star" : "star-outline";
          }
          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
              style={focused ? {
                textShadowColor: color,
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 6,
              } : {}}
            />
          );
        },
        tabBarActiveTintColor: "#61dafb", 
        tabBarInactiveTintColor: "#aaa",      
        tabBarStyle: {
          backgroundColor: "#2C2F3A",
          borderTopWidth: 0,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
        tabBarShowLabel: true,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favoritos" component={FavoritosScreen} />
    </Tab.Navigator>
  );
}

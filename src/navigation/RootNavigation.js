import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabsNavigator from "./BottomTabsNavigator";
import FavoritosScreen from "../screens/FavoritosScreen";
import HomeScreen from "../screens/HomeScreen";
import IntroScreen from "../screens/IntroScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Intro">
                <Stack.Screen
                    name="Intro"
                    component={IntroScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Root"
                    component={BottomTabsNavigator}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="Favoritos" component={FavoritosScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

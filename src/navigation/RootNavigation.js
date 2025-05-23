import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabsNavigator from "./BottomTabsNavigator";
import FavoritosScreen from "../screens/FavoritosScreen";
import HomeScreen from "../screens/HomeScreen";
import MemesScreen from "../screens/MemesScreen";
import GamesScreen from "../screens/GamesScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Root">
                <Stack.Screen
                    name="Root"
                    component={BottomTabsNavigator}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="Favoritos" component={FavoritosScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Memes" component={MemesScreen} />
                <Stack.Screen name="Games" component={GamesScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

// App.js
import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import HomeScreen from "./src/screens/HomeScreen";
import PinterestInputScreen from "./src/screens/PinterestInputScreen";
import CollectionScreen from "./src/screens/CollectionScreen";
import CustomizeScreen from "./src/screens/CustomizeScreen";
import PreviewScreen from "./src/screens/PreviewScreen";
import CollectionsOverviewScreen from "./src/screens/CollectionsOverviewScreen";
import DiagnosticScreen from "./src/screens/DiagnosticScreen";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Recoleta': require('./assets/fonts/Recoleta-RegularDEMO.otf'),
    'NeueMontreal': require('./assets/fonts/NeueMontreal-Regular.otf'),
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="Diagnostic" component={DiagnosticScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PinterestInput" component={PinterestInputScreen} />
        <Stack.Screen name="Collection" component={CollectionScreen} />
        <Stack.Screen 
          name="Customize" 
          component={CustomizeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Preview" 
          component={PreviewScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="CollectionsOverview" 
          component={CollectionsOverviewScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
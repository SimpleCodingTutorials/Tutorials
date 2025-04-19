import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from "react-native-paper";
import NewsList from "./NewsList";
import DetailsScreen from "./DetailsScreen";
import SearchScreen from "./SearchScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name = "Latest News" component={NewsList}/>
          <Stack.Screen name = "Details" component={DetailsScreen}/>
          <Stack.Screen name = "Search" component={SearchScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}























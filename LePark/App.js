import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { NavigationContainer } from "@react-navigation/native";

// screens
import HomePageScreen from "./screens/HomePageScreen";
import SearchFilterScreen from "./screens/SearchFilterScreen";
import SearchResults from "./screens/SearchResults";
import MapScreen from "./screens/MapScreen";
import ParkDetails from './screens/ParkDetails'
import imgTest from "./screens/imgTest";

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Filters" component={SearchFilterScreen} />
      <Stack.Screen name="Results" component={SearchResults} />
      <Stack.Screen name='Details' component={ParkDetails} />
    </Stack.Navigator>
  );
}
function FavouritesScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FavouritesScreen" component={imgTest} />
    </Stack.Navigator>
  );
}

function MapStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name='Details' component={ParkDetails} />
    </Stack.Navigator>
  );
}

function HomeScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomePage" component={HomePageScreen} />
      <Stack.Screen name='Details' component={ParkDetails} />
    </Stack.Navigator>
  );
}

function ParkDetailsScreen() {
  return(
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'white' }}>
          <Text>Park Details</Text>
          {/* <Favourites /> */}
      </View>
  )
}


export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        labeled={false}
        barStyle={{
          backgroundColor: "white",
          // margin: 25,
          position: "absolute",
          overflow: 'hidden',
          borderRadius: 20,
          height: 75,
          padding: 8,
          bottom: 10
        }}
        activeColor={"#2D6D72"}
        inactiveColor={"#979796"}
        backBehavior={"history"}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, size, color }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Search") {
              iconName = "compass";
            } else if (route.name === "Map") {
              iconName = "map";
            } else if (route.name === "Favourites") {
              iconName = "heart";
            }
            return <FontAwesome5 name={iconName} size={22} color={color} />;
          },
        })}
      >
        <Tab.Screen name={"Home"} component={HomeScreen} />
        <Tab.Screen name={"Search"} component={SearchStack} />
        <Tab.Screen name={"Map"} component={MapStack} />
        {/* <Tab.Screen name={"Favourites"} component={FavouritesScreen} /> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
});

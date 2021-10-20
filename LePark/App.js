import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { NavigationContainer } from '@react-navigation/native';
import SearchFilterScreen from './screens/SearchFilterScreen'
import SearchResults from './screens/SearchResults'
import Map from './screens/MapScreen';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Filters' component={SearchFilterScreen} />
      {<Stack.Screen name='Results' component={SearchResults} />}
    </Stack.Navigator>
  )
}

function MapScreen() {
    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'white' }}>
            <Text>Map</Text>
            {/* <Map /> */}
        </View>
    )
}

function HomeScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'white' }}>
        <Text>Home</Text>
        {/* <Home /> */}
      </View>
    );
  }

function FavouritesScreen() {
    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'white' }}>
            <Text>Favourites</Text>
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
            backgroundColor: 'white',
            margin: 20,
            position: 'absolute',
            overflow: 'hidden',
            borderRadius: 15,
        }}
        activeColor={"#2D6D72"}
        inactiveColor={"#979796"}
        backBehavior={"history"}
        shifting={true}
        screenOptions={
            ({route}) => ({
                tabBarIcon: ({focused, size, color}) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = 'home'
                    } else if (route.name === 'Search') {
                        iconName = 'compass'
                    } else if (route.name === 'Map') {
                        iconName = 'map'
                    } else if(route.name === 'Favourites') {
                        iconName = 'heart'
                    }
                    return (
                        <FontAwesome5
                            name={iconName}
                            size={20}
                            color={color}/>
                    )
                }
            })
      }>
        <Tab.Screen name={'Home'} component={HomeScreen}/>
        <Tab.Screen name={'Search'} component={SearchStack}/>
        <Tab.Screen name={'Map'} component={MapScreen}/>
        <Tab.Screen name={'Favourites'} component={FavouritesScreen}/>

    </Tab.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

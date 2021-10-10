import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { NavigationContainer } from '@react-navigation/native';
import SearchFilterScreen from './screens/SearchFilterScreen'

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Filters' component={SearchFilterScreen} />
      {/* <Stack.Screen name='Results' component={} /> */}
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
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
            }
            return (
              <FontAwesome5
                name={iconName}
                size={size}
                color={color}/>
            )
          }
        })
      }>
        {/* <Tab.Screen name={'Home'}/> */}
        <Tab.Screen name={'Search'} component={SearchStack}/>
        {/* <Tab.Screen name={'Map'}/> */}

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

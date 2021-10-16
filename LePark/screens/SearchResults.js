import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet,
    Text,
    View,
    SectionList,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    SafeAreaView} from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CheckBox } from 'react-native-elements'
import * as Location from 'expo-location'
import { ScrollView } from 'react-native-gesture-handler';

const API_URL = 'https://mocki.io/v1/ec0964fc-71b8-4a74-ad69-1bdd280e60af'

export default function SearchResults({ navigation }) {

    const getResults = async() => {
        try {
            const value = await AsyncStorage.getItem('SearchResults');
            if(value !== null){
                setResults(JSON.parse(value));
            }
        } catch (error){
            console.log("error")
        }
    }

    const [results, setResults] = useState([]);

    useEffect(() => {
        getResults();
    }, []);

    console.log(results);
    console.log(results[0]);

    return(
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.header}>RESULTS</Text>
                <ScrollView>
                    {results.map(item => (
                        <View style={styles.item} key={item.park_name}>
                            <Text>{item.park_name}</Text>
                            <Text>{item.region}</Text>
                            <Text>{item.facilities}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    )


}

const styles = StyleSheet.create({
    title: {
        fontSize:24
    },
    item: {
        backgroundColor: "#f9c2ff",
        padding: 20,
        marginVertical: 8
    },
    header: {
        fontSize: 32,
        backgroundColor: "#fff",
        position: "relative",
    },
});
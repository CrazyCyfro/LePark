import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, SectionList, FlatList, ActivityIndicator } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { NavigationContainer } from '@react-navigation/native';

const API_URL = 'https://mocki.io/v1/ec0964fc-71b8-4a74-ad69-1bdd280e60af'

export default function SearchFilterScreen() {
    const [isLoading, setLoading] = useState(true);
    const [parks, setParks] = useState([]);

    const getParks = async () => {
        try {
            const response = await fetch(API_URL);
            const json = await response.json();
            setParks(json);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getParks();
    }, []);


    return (
        <View>
            <Text
            style={styles.title}>
                Filters
            </Text>
            {isLoading ? <ActivityIndicator/>: (
                <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={parks}
                renderItem={
                    ({item}) => {
                        return (
                            <Text>
                                {item.park_name}
                            </Text>
                        )
                    }
                }/>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize:20
    }
});
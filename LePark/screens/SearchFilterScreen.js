import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet,
    Text,
    View,
    SectionList,
    FlatList,
    ActivityIndicator,
    TouchableOpacity } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'

const API_URL = 'https://mocki.io/v1/ec0964fc-71b8-4a74-ad69-1bdd280e60af'

export default function SearchFilterScreen({ navigation }) {
    const [isLoading, setLoading] = useState(true);
    const [parks, setParks] = useState([]);
    const [results, setResults] = useState([]);
    const [filters, setFilters] = useState([
        "SHELTER",
        "TOILET",
        "F&B",
        "EVENT SPACE",
        "FITNESS AREA",
        "PLAYGROUND",
        "ACCESS POINT",
        "CARPARK",
        "WATER BODY",
        "BICYCLE RENTAL SHOP",
        "DOG-AREA",
        "BEACH VOLLEY",
        "FOOT RELAX",
        "WOODBALL",
        "WATER POINT",
        "BUS",
        "LOOKOUT POINT",
        "BABY",
        "BBQ PIT",
        "SKATEBOARD",
        "CAMPSITE",
        "SHOWER",
        "PICNIC",
        "CYCLING",
        "WHEELCHAIR-ACCESS"]);
    const [selected, setSelected] = useState(['BEACH VOLLEY']);
    const [query, setQuery] = useState('');

    const getParks = async () => {
        try {
            const response = await fetch(API_URL);
            const json = await response.json();
            setParks(json);
            filterParks();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const filterParks = async () => {
        let matchedParks = [...parks];
        for (var i = 0; i < parks.length; i++) {
            const matchedFilters = parks[i].facilities.filter(value => selected.includes(value));
            matchedParks[i].matches = matchedFilters.length;
        }
        matchedParks.sort((a, b) => b.matches - a.matches);
        setResults(matchedParks);
        saveResults();
        console.log(matchedParks)
    }

    const saveResults = async () => {
        try {
            await AsyncStorage.setItem('SearchResults', JSON.stringify(results))
            // navigation.navigate('Results')
        } catch (error) {
            console.log(error);
        }
    }



    useEffect(() => {
        getParks();
        filterParks();
    }, []);


    return (
        <View>
            <Text
            style={styles.title}>
                Filters
            </Text>
            <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={results}
                renderItem={
                    ({item}) => {
                        return (
                            <Text>
                                {item.park_name}
                            </Text>
                        )
                    }
                }/>
            

            {/* {isLoading ? <ActivityIndicator/>: (
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
            )} */}
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize:20
    },
    btn: {

    },
    btnActive: {

    }
});
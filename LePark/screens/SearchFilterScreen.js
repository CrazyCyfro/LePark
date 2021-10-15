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

const API_URL = 'https://mocki.io/v1/ec0964fc-71b8-4a74-ad69-1bdd280e60af'

export default function SearchFilterScreen({ navigation }) {
    const [isLoading, setLoading] = useState(true);
    const [parks, setParks] = useState([]);
    const [results, setResults] = useState([]);
    const FILTERS = ["SHELTER",
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
            "WHEELCHAIR-ACCESS"]
    const LOCATIONS = ["Ang Mo Kio",
            "Bedok",
            "Bishan",
            "Boon Lay",
            "Bukit Batok",
            "Bukit Merah",
            "Bukit Panjang",
            "Bukit Timah",
            "Central Water Catchment",
            "Changi",
            "Changi Bay",
            "Choa Chu Kang",
            "Clementi",
            "Downtown Core",
            "Geylang",
            "Hougang",
            "Jurong East",
            "Jurong West",
            "Kallang",
            "Lim Chu Kang",
            "Mandai",
            "Marina East",
            "Marina South",
            "Marine Parade",
            "Museum",
            "Newton",
            "North-Eastern Islands",
            "Novena",
            "Orchard",
            "Outram",
            "Pasir Ris",
            "Paya Lebar",
            "Pioneer",
            "Punggol",
            "Queenstown",
            "River Valley",
            "Rochor",
            "Seletar",
            "Sembawang",
            "Sengkang",
            "Serangoon",
            "Simpang",
            "Singapore River",
            "Southern Islands",
            "Straits View",
            "Sungei Kadut",
            "Tampines",
            "Tanglin",
            "Tengah",
            "Toa Payoh",
            "Tuas",
            "Western Islands",
            "Western Water Catchment",
            "Woodlands",
            "Yishun"]
    const [selected, setSelected] = useState([]);
    const [locations, setLocations] = useState([]);
    const [query, setQuery] = useState('');

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

    const filterParks = () => {
        let matchedParks = [...parks];
        for (var i = 0; i < parks.length; i++) {
            const matchedFilters = parks[i].facilities.filter(value => selected.includes(value));
            matchedParks[i].matches = matchedFilters.length;
        }
        matchedParks.sort((a, b) => b.matches - a.matches);
        setResults(matchedParks);
        saveResults();
        // console.log(matchedParks)
    }

    useEffect(() => {
        filterParks();
    }, [selected])

    const saveResults = async () => {
        try {
            await AsyncStorage.setItem('SearchResults', JSON.stringify(results))
            navigation.navigate('Results')
        } catch (error) {
            console.log(error);
        }
    }

    const FilterItem = ({ title }) => (
        <CheckBox
        style={styles.item}
        title={title}
        checked={selected.includes(title)}
        onPress={() => {
            let tmp = [...selected];

            if (tmp.includes(title)) {
                const idx = tmp.indexOf(title);
                if (idx > -1) {
                    tmp.splice(idx, 1);
                }
                
            } else {
                tmp.push(title);
            }
            setSelected(tmp);
        }}
        />
    );

    const LocationItem = ({ title }) => (
        <CheckBox
        style={styles.item}
        title={title}
        checked={locations.includes(title)}
        onPress={() => {
            let tmp = [...locations];
            

            if (tmp.includes(title)) {
                const idx = tmp.indexOf(title);
                if (idx > -1) {
                    tmp.splice(idx, 1);
                }
                
            } else {
                tmp.push(title);
            }
            setLocations(tmp);
        }}
        />
    )

    const ListFooterComponent = (
        <>
            <FlatList
            data={LOCATIONS}
            keyExtractor={(item, index) => item + index}
            renderItem={({item}) => <LocationItem title={item}/>}
            renderSectionHeader={({ section: { title } }) => (
                <Text style={styles.header}>{title}</Text>
            )}
            ListHeaderComponent={
                <Text style={styles.header}>
                    LOCATIONS
                </Text>
            }
            />
        </>
    )

    return (
        <View>
                <FlatList
                data={FILTERS}
                keyExtractor={(item, index) => item + index}
                renderItem={({item}) => <FilterItem title={item}/>}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.header}>{title}</Text>
                )}
                ListHeaderComponent={
                    <Text style={styles.header}>
                        FILTERS
                    </Text>
                }
                ListFooterComponent={ListFooterComponent}
                />
                {/* <FlatList
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
                    }/> */}
                

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
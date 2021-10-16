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
import { CheckBox,
    FAB,
    SearchBar } from 'react-native-elements'
import * as Location from 'expo-location'
import * as geolib from 'geolib'

const API_URL = 'https://mocki.io/v1/00136ced-5611-4a25-aeef-5c7706a7f35b'
// const API_URL = 'https://mocki.io/v1/ec0964fc-71b8-4a74-ad69-1bdd280e60af'

export default function SearchFilterScreen({ navigation }) {
    const [parks, setParks] = useState([]);
    const FILTERS = ["Shelter",
            "Toilet",
            "F&B",
            "Event Space",
            "Fitness Area",
            "Playground",
            "Access Point",
            "Carpark",
            "Water Body",
            "Bicycle Rental Shop",
            "Dog-Area",
            "Beach Volley",
            "Foot Relax",
            "Woodball",
            "Water Point",
            "Bus",
            "Lookout Point",
            "Baby",
            "Bbq Pit",
            "Skateboard",
            "Campsite",
            "Shower",
            "Picnic",
            "Cycling",
            "Wheelchair-Access"]
    const REGIONS = ["Ang Mo Kio",
            "Bedok",
            "Bishan",
            "Bukit Batok",
            "Bukit Merah",
            "Bukit Panjang",
            "Bukit Timah",
            "Central Water Catchment",
            "Changi",
            "Choa Chu Kang",
            "Downtown Core",
            "Fort Canning",
            "Geylang",
            "Hougang",
            "Jurong East",
            "Jurong West",
            "Kallang",
            "Lim Chu Kang",
            "Mandai",
            "Marine Parade",
            "Newton",
            "North Eastern Islands",
            "Novena",
            "Outram",
            "Pasir Ris",
            "Punggol",
            "Queenstown",
            "Sembawang",
            "Sengkang",
            "Serangoon",
            "Singapore River",
            "Sungei Kadut",
            "Tampines",
            "Tanglin",
            "Toa Payoh",
            "Western Islands",
            "Woodlands",
            "Yishun"]
    const [selected, setSelected] = useState([]);
    const [regions, setRegions] = useState([]);
    const [query, setQuery] = useState("");
    const [userLocation, setUserLocation] = useState(null);

    const getParks = async () => {
        try {
            const response = await fetch(API_URL);
            const json = await response.json();
            setParks(json);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getParks();

        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              setErrorMsg('Permission to access location was denied');
              return;
            }
      
            try {
                let location = await Location.getCurrentPositionAsync({});
                setUserLocation(location);
            } catch (error) {
                console.log(error)
            }
            
        })();
    }, []);

    // useEffect(() => {
    //     console.log(userLocation.coords.longitude)
    // })

    const filterParks = async () => {
        var matchedParks = [...parks];

        for (var i = 0; i < parks.length; i++) {
            matchedParks[i].distance = geolib.getDistance(
                {lat: matchedParks[i].x_coord, lon: matchedParks[i].y_coord},
                {lat: userLocation.coords.latitude, lon: userLocation.coords.longitude}
            )
        }

        if (selected.length > 0) {
            for (var i = 0; i < parks.length; i++) {
                const matchedFilters = parks[i].facilities.filter(value => selected.includes(value));
                matchedParks[i].matches = matchedFilters.length;
            }

            matchedParks.sort((a, b) => {
                if (a.matches == b.matches) {
                    return a.distance - b.distance;
                }
                return b.matches - a.matches});
        } else {
            matchedParks.sort((a, b) => {
                return a.distance - b.distance;
            });
        }
        
        if (query.length > 0) {
            const formattedQuery = query.toLowerCase();
            matchedParks = matchedParks.filter(park => 
                park.park_name.toLowerCase().includes(formattedQuery))
        }

        if (regions.length > 0) {
            matchedParks = matchedParks.filter(park => 
            regions.includes(park.region))
        }

        try {
            await AsyncStorage.setItem('SearchResults', JSON.stringify(matchedParks))
            // navigation.navigate('Results');
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
        checked={regions.includes(title)}
        onPress={() => {
            let tmp = [...regions];
            

            if (tmp.includes(title)) {
                const idx = tmp.indexOf(title);
                if (idx > -1) {
                    tmp.splice(idx, 1);
                }
                
            } else {
                tmp.push(title);
            }
            setRegions(tmp);
        }}
        />
    )

    const ListFooterComponent = (
        <>
            <FlatList
            data={REGIONS}
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
            <SearchBar
            placeholder="Search by park name..."
            value={query}
            onChangeText={(queryText) => setQuery(queryText)}/>

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
            <FAB
            style={styles.floatBtn} 
            color="#00d5ff"
            icon={<FontAwesome5
                name="search"
                color="#ffffff"/>}
            onPress={() => {
                filterParks();
                navigation.navigate('Results');}}
            />
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
    floatBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        position: 'absolute',
        bottom: 80,
        right: 10,
    }
});
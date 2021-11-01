import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckBox, FAB, SearchBar } from "react-native-elements";
import * as Location from "expo-location";
import * as geolib from "geolib";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

const API_URL = "https://mocki.io/v1/00136ced-5611-4a25-aeef-5c7706a7f35b";
// const API_URL = 'https://mocki.io/v1/ec0964fc-71b8-4a74-ad69-1bdd280e60af'

export default function SearchFilterScreen(props) {
  const [parks, setParks] = useState([]);
  const FILTERS = [
    "Shelter",
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
    "Wheelchair-Access",
  ];
  const REGIONS = [
    "Ang Mo Kio",
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
    "Yishun",
  ];
  const icons = {
    filters:{
        "Shelter": "landmark",
        "Toilet": "restroom",
        "F&B": "utensils",
        "Event Space": "calendar",
        "Fitness Area": "dumbbell",
        "Playground": "shapes",
        "Access Point": "wifi",
        "Carpark": "parking",
        "Water Body": "water",
        "Bicycle Rental Shop": "bicycle",
        "Dog-Area": "dog",
        "Beach Volley": "volleyball-ball",
        "Foot Relax": "shoe-prints",
        "Woodball": 'gavel',
        "Water Point": "tint",
        "Bus": "bus",
        "Lookout Point": "binoculars",
        "Baby": "baby",
        "Bbq Pit": "fire",
        "Skateboard": "snowboarding",
        "Campsite": "campground",
        "Shower": "shower",
        "Picnic": "shopping-basket",
        "Cycling": 'biking',
        "Wheelchair-Access": "accessible-icon"
    }
}
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
  };

  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getParks();
    getUserLocation();
  }, []);

  const filterParks = async () => {
    var matchedParks = [...parks];

    for (var i = 0; i < parks.length; i++) {
      if (userLocation != undefined) {
        matchedParks[i].distance = geolib.getDistance(
          { lat: matchedParks[i].x_coord, lon: matchedParks[i].y_coord },
          { lat: userLocation.coords.latitude, lon: userLocation.coords.longitude,}
        )
      }
    }

    if (selected.length > 0) {
      for (var i = 0; i < parks.length; i++) {
        const matchedFilters = parks[i].facilities.filter((value) =>
          selected.includes(value)
        );
        matchedParks[i].matches = matchedFilters.length;
      }

      matchedParks = matchedParks.filter((park) => park.matches > 0);

      matchedParks.sort((a, b) => {
        if (a.matches == b.matches) {
          return a.distance - b.distance;
        }
        return b.matches - a.matches;
      });
    } else {
      matchedParks.sort((a, b) => {
        return a.distance - b.distance;
      });
    }

    if (query.length > 0) {
      const formattedQuery = query.toLowerCase();
      matchedParks = matchedParks.filter((park) =>
        park.park_name.toLowerCase().includes(formattedQuery)
      );
    }

    if (regions.length > 0) {
      matchedParks = matchedParks.filter((park) =>
        regions.includes(park.region)
      );
    }

    try {
      await AsyncStorage.setItem("SearchResults", JSON.stringify(matchedParks));
      // navigation.navigate('Results');
    } catch (error) {
      console.log(error);
    }
  };

  const FilterItem = ({ title }) => { 
    return (
    <CheckBox
      containerStyle={selected.includes(title) ?{backgroundColor:"#70B996", borderRadius: 20, marginVertical: 9, paddingVertical: 16} : 
      {backgroundColor: "#ECECEC", borderRadius: 20, marginVertical: 9, paddingVertical: 16}}
      title={title}
      checkedIcon={<FontAwesome5
        name={icons.filters[title]}
        size={12}
    />}
      uncheckedIcon={<FontAwesome5
        name={icons.filters[title]}
        size={12}
    />}
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
  )};

  const LocationItem = ({ title }) => (
    <CheckBox
        containerStyle={regions.includes(title) ?{backgroundColor:"#70B996", borderRadius: 20, marginVertical: 9, paddingVertical: 16} : 
        {backgroundColor: "#ECECEC", borderRadius: 20, marginVertical: 9, paddingVertical: 16}}
      style={styles.item}
      title={title}
      checkedIcon={<View style = {{position: "absolute"}}/>}
      uncheckedIcon={<View style = {{position: "absolute"}}/>}
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
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={"dark"} />
      <SearchBar
        containerStyle={{
          backgroundColor: 'white', 
          borderWidth: 1, 
          borderRadius: 23, 
          marginTop: 40, 
          width: 300, height: 50, 
          alignSelf:"center",
          marginBottom: 20
        }}
        inputContainerStyle={{backgroundColor:"white", height: 35}}
        inputStyle={{backgroundColor:"white"}}
        placeholder="Search by park name..."
        value={query}
        onChangeText={(queryText) => setQuery(queryText)}
      />
      <ScrollView
       contentContainerStyle={{flexDirection : "row", flexWrap: "wrap", marginHorizontal: 10}}>
            <View style={styles.titleContainer}>
                <Text style={styles.header}>FILTERS</Text>
            </View>
            {FILTERS.map(item => (
                <FilterItem title={item} key={item} />
            ))}
            <View style={styles.titleContainer}>
                <Text style={styles.header}>LOCATIONS</Text>
            </View>
            {REGIONS.map(item => (
                <LocationItem title={item} key={item} />
            ))}
      </ScrollView>
      <FAB
        style={styles.floatBtn}
        color="#70B996"
        icon={<FontAwesome5 name="search" color="#ffffff" />}
        onPress={() => {
          filterParks();
          props.navigation.navigate("Results");
        }}
      />
    </SafeAreaView>
  );
}

const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: screenHeight - 80,
  },
  titleContainer: {
    width: 500,
    margin: -8,
    marginTop: 0
  },
  title: {
    fontSize: 24,
  },
  item: {
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: "#fff",
    position: "relative",
    padding: 20,
    paddingTop: 0,
    fontWeight: "bold",
    color: "#1f4c50"
  },
  floatBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});

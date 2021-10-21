import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckBox } from "react-native-elements";
import * as Location from "expo-location";
import { ScrollView } from "react-native-gesture-handler";

const API_URL = "https://mocki.io/v1/ec0964fc-71b8-4a74-ad69-1bdd280e60af";

export default function SearchResults({ navigation }) {
  const icons = {
    filters: {
      Shelter: "landmark",
      Toilet: "restroom",
      "F&B": "utensils",
      "Event Space": "calendar",
      "Fitness Area": "dumbbell",
      Playground: "shapes",
      "Access Point": "wifi",
      Carpark: "parking",
      "Water Body": "water",
      "Bicycle Rental Shop": "bicycle",
      "Dog-Area": "dog",
      "Beach Volley": "volleyball-ball",
      "Foot Relax": "shoe-prints",
      Woodball: "gavel",
      "Water Point": "tint",
      Bus: "bus",
      "Lookout Point": "binoculars",
      Baby: "baby",
      "Bbq Pit": "fire",
      Skateboard: "snowboarding",
      Campsite: "campground",
      Shower: "shower",
      Picnic: "shopping-basket",
      Cycling: "biking",
      "Wheelchair-Access": "accessible-icon",
    },
  };

  const getResults = async () => {
    try {
      const value = await AsyncStorage.getItem("SearchResults");
      if (value !== null) {
        setResults(JSON.parse(value));
      }
    } catch (error) {
      console.log("error");
    }

    const [results, setResults] = useState([]);

    useEffect(() => {
        getResults();
    }, []);

    // console.log(results);
    // console.log(results[0]);
    
    return(
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.header}>RESULTS</Text>
                <ScrollView>
                    {results.map(item => (
                        <View style={styles.item} key={item.park_name}>
                            <View style={styles.imageFrame}>
                                <TouchableOpacity onPress={() => navigation.navigate('Details', {item:item})}>
                                    <Image source={require('../assets/download.jpg')} style={styles.image}/>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.info}>
                                <Text style={styles.parkName}>{item.park_name}</Text>
                                <View style={styles.location}>
                                    <FontAwesome5
                                        name="map-marker-alt"
                                        color="grey"
                                        style={{marginRight:5}}
                                    />
                                    <Text style={{color:'grey'}}> {item.region}</Text>
                                </View>
                                <View style={styles.facilityList}>
                                    {item.facilities.map(facility => (
                                        <View style={styles.facilityIcon} key={facility}>
                                            <FontAwesome5
                                                name={icons.filters[facility]}
                                                size={12}
                                            />
                                        </View>
                                    ))}
                                </View>
                                <View style={styles.distanceCont}>
                                    <Text style={styles.distance}>{"\n"}{((item.distance)/1000).toFixed(2)}km</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                    <Text>
                        {"\n"}
                        {"\n"}
                        {"\n"}
                    </Text>
                </ScrollView>
            </View>
            ))
            <Text>
                {"\n"}
                {"\n"}
                {"\n"}
            </Text>
        </SafeAreaView>

    
  );
}

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: screenHeight - 100,
  },
  item: {
    padding: 10,
    marginVertical: 8,
    flexDirection: "row",
    height: 200,
    backgroundColor: "white",
  },
  header: {
    fontSize: 32,
    backgroundColor: "#fff",
    position: "relative",
    padding: 10,
    margin: 0,
    fontWeight: "bold",
    color: "#1f4c50",
  },
  location: {
    flexDirection: "row",
    padding: 3,
  },
  parkName: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 3,
  },
  distance: {
    textAlign: "right",
    textAlignVertical: "bottom",
    fontSize: 13,
    color: "grey",
  },
  distanceCont: {
    position: "absolute",
    right: 5,
    bottom: 20,
  },
  imageFrame: {
    width: 150,
    padding: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 30,
  },
  info: {
    flex: 3,
    height: 200,
  },
  facilityList: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    marginTop: 3,
  },
  facilityIcon: {
    margin: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#ECECEC",

    borderRadius: 10,
  }
})};

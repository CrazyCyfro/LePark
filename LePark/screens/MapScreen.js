import * as React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useEffect, useState } from "react";
import { useFocusEffect } from '@react-navigation/native'
// import Carousel from "./Carousel";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MapScreen({ navigation }) {
  const [results, setResults] = useState([]);
  const [carparkData, setCarparkData] = useState([]);

  const CARPARK_URL = "http://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2";
  const LTA_API_KEY = "sddcm97OSBWyyCWnAt+IoQ=="

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      let finished = false;

      const getCarparkData = async() => {
        // for (let i = 0; i < 4; i++) {
          fetch(CARPARK_URL, {
            method: "POST",
            headers: {
              'AccountKey': LTA_API_KEY,
              'Accept': 'application/json',
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              $skip: 500
            })
          })
          .then((response) => response.json())
          .then((responseJson) => {
            if (isActive) {
              let newCarparkData = responseJson.value;
              let tmp = carparkData.concat(newCarparkData);
              setCarparkData(tmp);
              if (newCarparkData.length < 500) finished = true;
            }
          })
          .catch((error) => {
            console.log(error);
          })
        // }
      }

      setCarparkData([]);
      getCarparkData();

      return () => {
        isActive = false;
      }
    }, [])
  )

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const getResults = async() => {
        try {
            const value = await AsyncStorage.getItem('SearchResults');
            if(value !== null) {
                if (isActive) setResults(JSON.parse(value));
            }
        } catch (error){
            console.log(error)
        }
      }

      getResults();

      return () => {
        isActive = false;
      }
    }, [])
  )

  useEffect(() => {
    console.log(carparkData.length)
  })

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 1.3521,
          longitude: 103.8198,
          latitudeDelta: 0.1,
          longitudeDelta: 0.45,
        }}
      >
        <Marker
          coordinate={{ latitude: 1.3521, longitude: 103.8198 }}
          title={"Singapore"}
        />
        {/* {data.map((value, i) => {
          return (
            <Marker
              key={value.CarParkID}
              coordinate={{
                latitude: parseFloat(value.Location.split(" ")[0]),
                longitude: parseFloat(value.Location.split(" ")[1]),
              }}
              title={value.Development}
              description={"Available Lots:" + value.AvailableLots}
            />
          );
        })} */}
      </MapView>
      {/* <View style={styles.carouselContainer}>
        <Carousel />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  carouselContainer: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    paddingBottom: 50,
    alignItems: "center",
    backgroundColor: "transparent",
  },
});

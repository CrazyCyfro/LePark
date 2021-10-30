import * as React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Text
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useEffect, useState, useRef } from "react";
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { kdTree } from '../utils/kdTree.js'
import * as geolib from "geolib";
import Carousel from 'react-native-snap-carousel'

export default function MapScreen({ navigation }) {
  const [results, setResults] = useState([]);
  const [carparkData, setCarparkData] = useState([]);
  const [visibleCarparks, setVisibleCarparks] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const CARPARK_URL = "http://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2";
  const LTA_API_KEY = "sddcm97OSBWyyCWnAt+IoQ=="
  const MAX_DISTANCE = 700

  const carousel = useRef(null)

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      let tmp = [];

      const getCarparkData = async(n_skip) => {
          fetch(CARPARK_URL.concat(`?$skip=${n_skip}`), {
            method: "POST",
            headers: {
              AccountKey: LTA_API_KEY,
              Accept: 'application/json',
              "Content-Type": "application/json"
            },
          })
          .then((response) => response.json())
          .then((responseJson) => {
            if (isActive) {
              let newCarparkData = responseJson.value;
              tmp = tmp.concat(newCarparkData);

              // console.log("skip: " + n_skip);
              // console.log("new data len: " + newCarparkData.length);
              // console.log("tmp len: " + tmp.length);

              if (newCarparkData.length == 500) {
                getCarparkData(n_skip + 500);
              } else {
                // tmp = tmp.map(item => 
                //   ({...item, pinColor: item.AvailableLots > 0 ? "blue" : "red"}))
                // console.log(tmp[0])
                setCarparkData(tmp)
              }
            }
          })
          .catch((error) => {
            console.log(error);
          })
      }

      getCarparkData(0);

      return () => {
        isActive = false;
        tmp = []
      }
    }, [])
  )

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const getResults = async() => {
        try {
            const value = await AsyncStorage.getItem('SearchResults');
            if (value !== null) {
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
    let visible = [];
    var parks = results.map(park => ({lat: park.x_coord, lon: park.y_coord}));
    var carparks = carparkData.map(carpark => ({
      lat: parseFloat(carpark.Location.split(" ")[0]),
      lon: parseFloat(carpark.Location.split(" ")[1])})
    );
    
    if (parks.length == 0 || carparks.length == 0) return;
    var tree = new kdTree(parks, distance, ["lat", "lon"]);
    // console.log(parks[0])
    // console.log(carparks[1])
    // console.log(tree.nearest(carparks[0], 1))
    
    for (var i = 0; i < carparks.length; i++) {
      var nearest = tree.nearest(carparks[i], 1);
      if (nearest[0][1] < MAX_DISTANCE) {
        visible.push(carparkData[i]);
      }
    }

    setVisibleCarparks(visible);

  }, [carparkData, results])
  
  var distance = function(a, b) {
    return geolib.getDistance(a, b);
  }

  // useEffect(() => {
  //   console.log(activeIndex)
  //   if (results.length > 0) console.log(results[activeIndex].park_name)
  // }, [activeIndex])

  const CarouselItem = ( {item, index} ) => {
    return (
      <View style={styles.carouselItem}>
        <Text>
          {item.park_name}
        </Text>
      </View>
    )
  }

  return (
    <View>
      <MapView
        style={styles.map}
        region={{
          latitude: results.length > activeIndex ? results[activeIndex].x_coord : 1.3521,
          longitude: results.length > activeIndex ? results[activeIndex].y_coord : 103.8198,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        >
        {visibleCarparks.map((value, i) => {
          return (
            <Marker
              key={i}
              coordinate={{
                latitude: parseFloat(value.Location.split(" ")[0]),
                longitude: parseFloat(value.Location.split(" ")[1]),
              }}
              title={value.Development}
              description={"Available Lots: " + value.AvailableLots}
              // pinColor={value.pinColor}
            />
          );
        })}
        {results.map((value, i) => {
          return (
            <Marker
              key={i}
              coordinate={{
                latitude: value.x_coord,
                longitude: value.y_coord,
              }}
              title={value.park_name}
              pinColor="green"
            />
          );
        })}
      </MapView>
      <View style={styles.carouselContainer}>
        <Carousel
          layout={"default"}
          ref={carousel}
          data={results}
          sliderWidth={Dimensions.get("window").width}
          itemWidth={300}
          renderItem={CarouselItem}
          onSnapToItem = {index => setActiveIndex(index)}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
    // padding: 20,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  carouselContainer: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'center',
    position: "absolute",
    bottom: 100,
  },
  carouselItem: {
    backgroundColor:'floralwhite',
    padding: 20,
    justifyContent: "center",
    marginLeft:50,
    marginRight:10,
  }
});

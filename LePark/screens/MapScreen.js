import * as React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useEffect, useState, useRef } from "react";
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { kdTree } from '../utils/kdTree.js'
import * as geolib from "geolib";
import * as Location from "expo-location";
import Carousel from 'react-native-snap-carousel'
import {gcsAPIKey} from "@env";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

export default function MapScreen({ navigation }) {
  const [results, setResults] = useState([]);
  const [carparkData, setCarparkData] = useState([]);
  const [visibleCarparks, setVisibleCarparks] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const CARPARK_URL = "http://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2";
  const LTA_API_KEY = "sddcm97OSBWyyCWnAt+IoQ=="
  const MAX_DISTANCE = 700
  const INIT_LAT = 1.3521
  const INIT_LON = 103.8198
  const DELTA_LAT = 0.01
  const DELTA_LON = 0.01

  const [link, setLink] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const mapView = useRef(null)
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
                tmp = tmp.map(item => 
                  ({...item, pinColor: item.AvailableLots > 0 ? "green" : "red"}))
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
                if (isActive) {
                  // let tmp = JSON.parse(value);
                  // tmp = tmp.map(item => ({
                  //   ...item,
                  //   key: item.park_name
                  // }))
                  // setResults(tmp);
                  let tmp = JSON.parse(value)
                  setResults(tmp);
                  if (mapView.current !== null) {
                    mapView.current.animateToRegion(
                      {
                        latitude: tmp.length > 0 ? tmp[0].x_coord : INIT_LAT,
                        longitude: tmp.length > 0 ? tmp[0].y_coord : INIT_LON,
                        latitudeDelta: DELTA_LAT,
                        longitudeDelta: DELTA_LON,
                      }
                    )
                  }
                }
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

  const getImg = async (results) => {
    try {
    let photoID = []
    let addresses = []
    for(let i = 0; i < results.length; i++){
        let query = results[i].park_name
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${gcsAPIKey}&fields=name%2Cphotos%2Cformatted_address&input=${query}&inputtype=textquery`)
        const json = await response.json();
        if (!json.candidates[0].photos){
            photoID.push("")
        } else {
            photoID.push(json.candidates[0].photos[0].photo_reference)
        }
        
        addresses.push(json.candidates[0].formatted_address)
    }
      setLink(photoID)
      setAddresses(addresses)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getImg(results);
  }, [results])

  // useEffect(() => {
  //   console.log(userLocation)
  // })

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
    getUserLocation();
  }, [])


  const CarouselItem = ( {item, index} ) => {
    return (
      <View style={styles.carouselItem}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Details', {item:item, index:index, link:link, addresses:addresses})}>
          <View style={styles.imageFrame}>                        
            <Image source={link[index] == "" ? require('../assets/park6.jpg') : 
            {uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=100&photo_reference=${link[index]}&key=${gcsAPIKey}`}} 
            loadingIndicatorSource={{uri: '../assets/adaptive-icon.png'}}
            style={styles.image}/>                                
          </View>
          <View style={styles.info}>
            <Text style={styles.parkText}>{item.park_name}</Text>
            <View style ={{flexDirection:"row", marginTop: 10,}}>
              <FontAwesome5
                  name="map-marker-alt"
                  color="grey"
                  style={{marginRight:5, marginTop: 4}}
              />
              <Text style={{fontWeight: '400'}}>{isNaN(item.distance) ? null : ((item.distance)/1000).toFixed(2) + 'km'}</Text>
            </View>
          </View>


        </TouchableOpacity>
      </View>
    )
  }

  const UserMarker = () => {
    if (userLocation != undefined) {
      return (
        <Marker
          key={userLocation.timestamp}
          coordinate={{
            latitude: userLocation.coords.latitude,
            longitude: userLocation.coords.longitude,
          }}
          title="You are here"
          pinColor="orange"/>
        )
    } else {
      return;
    }
  }

  return (
    <View>
      <MapView
        style={styles.map}
        ref={mapView}
        initialRegion={({
          latitude: results.length > activeIndex ? results[activeIndex].x_coord : INIT_LAT,
          longitude: results.length > activeIndex ? results[activeIndex].y_coord : INIT_LON,
          latitudeDelta: DELTA_LAT,
          longitudeDelta: DELTA_LON,
        })}
        >
        <UserMarker/>
        {visibleCarparks.map((value, i) => {
          return (
            <Marker
              key={`${i},${value.pinColor}`}
              coordinate={{
                latitude: parseFloat(value.Location.split(" ")[0]),
                longitude: parseFloat(value.Location.split(" ")[1]),
              }}
              title={value.Development}
              description={"Available Lots: " + value.AvailableLots}
              pinColor={value.pinColor}
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
              pinColor="blue"
            />
          );
        })}
      </MapView>
      <View style={styles.carouselContainer}>
        <Text style={{
          position:'absolute', 
          fontWeight: 'bold',
          color: "#1f4c50",
          left: 20, 
          top: -47, 
          fontSize: 30,
        }}>RESULTS</Text>
        <Carousel
          layout={"default"}
          ref={carousel}
          data={results}
          sliderWidth={Dimensions.get("window").width}
          itemWidth={300}
          renderItem={CarouselItem}
          onSnapToItem = {index => {
            setActiveIndex(index)
            mapView.current.animateToRegion({
              latitude: results.length > index ? results[index].x_coord : INIT_LAT,
              longitude: results.length > index ? results[index].y_coord : INIT_LON,
              latitudeDelta: DELTA_LAT,
              longitudeDelta: DELTA_LON,
            })}}/>
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
    // justifyContent: 'center',
    position: "absolute",
    bottom: 100,
  },
  carouselItem: {
    backgroundColor:'#ffffff',
    padding: 10,
    borderRadius: 10,
    flexDirection:"row",
    height:100,
  },
  parkText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageFrame:{
    height:80,
    width:80,
    borderRadius: 10,
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: 'cover',
    borderRadius: 15
  },
  info:{
    position: 'absolute',
    left: 90,
    width: 210
  }
});

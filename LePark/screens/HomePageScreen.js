import React, { useState, useEffect } from "react";
// import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import {gcsAPIKey} from "@env"

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width


function HomePageScreen({ navigation }) {

  const API_URL = "https://mocki.io/v1/00136ced-5611-4a25-aeef-5c7706a7f35b"
  const [parks, setParks] = useState([])
  const [randomParks, setRandomParks] = useState([])
  const [link, setLink] = useState([])
  const [addresses, setAddresses] = useState([])
  const [bgPark, setBgPark] = useState([])
  const [bgParkLink, setBgParkLink] = useState([])
  const [bgParkAddress, setBgParkAddress] = useState([])

  const getParks = async () => {
    try {
      const response = await fetch(API_URL);
      // console.log("fetching...")
      const json = await response.json();
      // console.log("converting...")
      setParks(json);
    } catch (error) {
      console.log(error);
    }
  };

  const suggestParks = () => {
    let randParks = []
    let randNum = []
    let bgPark = []

    if (parks.length == 190){
      while (randNum.length < 5){
        let x = Math.floor(Math.random() * 189)
        while (randNum.includes(x)){
          x = Math.floor(Math.random() * 189)
        }
        randNum.push(x)
      }

      for (let i = 1; i < randNum.length; i++){
        randParks.push(parks[randNum[i]])
      }

      bgPark.push(parks[randNum[0]])
      setRandomParks(randParks)
      setBgPark(bgPark)
    }
  }

  const getImg = async () => {
    try {
    let photoID = []
    let addresses = []
    let bgParkLink = []
    let bgParkAddress = []
    if (randomParks.length == 4){
      for(let i = 0; i < randomParks.length; i++){
        let query = randomParks[i].park_name
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
    }

    if(bgPark.length == 1){
      let query = bgPark[0].park_name
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${gcsAPIKey}&fields=name%2Cphotos%2Cformatted_address&input=${query}&inputtype=textquery`)
      const json = await response.json();
      if (!json.candidates[0].photos){
          bgParkLink.push("")
      } else {
          bgParkLink.push(json.candidates[0].photos[0].photo_reference)
      }
      bgParkAddress.push(json.candidates[0].formatted_address)
      setBgParkLink(bgParkLink)
      setBgParkAddress(bgParkAddress)
    }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getParks()
    
    // (async () => {
    //   let { status } = await Location.requestForegroundPermissionsAsync();
    //   if (status !== "granted") {
    //     setErrorMsg("Permission to access location was denied");
    //     return;
    //   }

    //   try {
    //     let location = await Location.getCurrentPositionAsync({});
    //     setUserLocation(location);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // })();
  }, []);

  useEffect(() => {
    suggestParks();
  }, [parks])

  useEffect(() => {
    getImg(randomParks)
  },[randomParks])

  // console.log(randomParks)
  console.log(bgPark)
  // console.log(bgParkInfo)
  // console.log(link)
  // console.log(addresses)

  return (
    <View
      style={{ 
        flex: 1, 
        justifyContent: "flex-start", 
        alignItems: "center", 
        height: SCREEN_HEIGHT-STATUSBAR_HEIGHT,
        // paddingTop: STATUSBAR_HEIGHT
     }}
    >
      <StatusBar translucent={"false"}/>
      {/* Main background Image */}
      <ImageBackground
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "100%",
          height: "100%",
        }}
        source={bgParkLink[0] == "" ? require('../assets/park6.jpg') : 
        {uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photo_reference=${bgParkLink[0]}&key=${gcsAPIKey}`}}
      >
        {/* empty view for background opacity */}
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        />

        {/* main view */}
        
        <TouchableOpacity
          onPress={() => navigation.navigate('Details', {item:bgPark[0], index:0, link:bgParkLink, addresses:bgParkAddress})}
          activeOpacity={0.8}
          style={{position:'absolute'}}
          style={{
            flex: 1,
            width: "85%",
            marginBottom: -RFPercentage(6),
            alignSelf: "center",
            justifyContent: "flex-end",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: RFPercentage(5),
              fontWeight: "bold",
            }}
          >
            {bgPark[0] ? bgPark[0].park_name : ""}
          </Text>
          <Text
            style={{
              color: "#fff",
              fontSize: RFPercentage(4),
              fontWeight: "500",
            }}
          >
            {bgPark[0]? bgPark[0].region : ""}
          </Text>
          <Text
            style={{
              marginTop: RFPercentage(1),
              color: "#fff",
              fontSize: RFPercentage(4),
              fontWeight: "bold",
            }}
          >
            EXPLORE
          </Text>
        </TouchableOpacity>

        {/* cart */}
        <ScrollView
          horizontal={true}
          style={{ flex: 1, width: "100%", marginBottom: RFPercentage(5) }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            {/* mainBox */}
            {randomParks.map((item, i) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Details', {item:item, index:i, link:link, addresses:addresses})}
                activeOpacity={0.8}
                key={i}
                style={{
                  backgroundColor: "#000",
                  marginLeft: RFPercentage(3),
                  borderRadius: RFPercentage(2.5),
                  overflow: "hidden",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  width: RFPercentage(28),
                  height: RFPercentage(35),
                }}
              >
                <ImageBackground
                  style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "flex-end",
                    alignItems: "flex-start",
                  }}
                  source={link[i] == "" ? require('../assets/park6.jpg') : 
                  {uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=700&photo_reference=${link[i]}&key=${gcsAPIKey}`}}
                >
                  {/* Shadow Layer */}
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      left: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0,0,0,0.3)",
                    }}
                  />

                  {/* Heart Icon
                  <Feather
                    name="heart"
                    style={{
                      fontSize: RFPercentage(2.8),
                      position: "absolute",
                      top: RFPercentage(2),
                      right: RFPercentage(2.5),
                    }}
                    color="white"
                  /> */}

                  {/* Bottom texts */}
                  <View
                    style={{
                      width: "90%",
                      alignSelf: "center",
                      marginBottom: RFPercentage(3),
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: RFPercentage(2.7),
                        fontWeight: "bold",
                      }}
                    >
                      {item ? item.park_name : ""}
                    </Text>
                    <View
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginTop: RFPercentage(0.3),
                        flexDirection: "row",
                      }}
                    >
                      <Entypo
                        name="location-pin"
                        style={{ fontSize: RFPercentage(2) }}
                        color={"#fff"}
                      />
                      <Text
                        style={{
                          marginLeft: RFPercentage(0.4),
                          color: "#fff",
                          fontWeight: "600",
                        }}
                      >
                        {addresses[i]? addresses[i] : ""}
                      </Text>
                    </View>
                    {/*<Text
                      style={{
                        color: "#fff",
                        marginTop: RFPercentage(1),
                        fontSize: RFPercentage(2),
                      }}
                    >
                      {((item.distance)/1000).toFixed(2)}km
                    </Text>*/}
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

export default HomePageScreen;

import { StatusBar } from 'expo-status-bar';
import React, {Component, useEffect, useState} from 'react';
import { StyleSheet,
    Text,
    View,
    ScrollView,
    ImageBackground,
    SectionList,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Image,
    SafeAreaView} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { NavigationContainer } from '@react-navigation/native';
import {gcsAPIKey} from "@env"


//const RGEO_URL = 'https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json'
//const RGEO_API_KEY = 'AI6HsgTR_Sc7GykoVzHa0prg-GWjZm6rv-XC5k7GWVM'
//const gcsAPIKey = 'AIzaSyBj1aiWKe8oWnEsyvCaWFwCCDFo6Os5Ypw';


function ParkDetails({ route, navigation }) {
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

    // const parkImages = [
    //     require('../assets/park1.png'),
    //     require('../assets/park2.jpg'),
    //     require('../assets/park3.jpg'),
    //     require('../assets/park4.jpg'),
    //     require('../assets/park5.jpg'),
    //     require('../assets/park6.jpg'),
    //     //require('../assets/park7.jpg'),
    //     require('../assets/park8.jpg')
    // ]

    const item = route.params.item;
    const addresses = route.params.addresses;
    const index = route.params.index;
    const link = route.params.link;

    //const lat = item.x_coord;
    //const long = item.y_coord;
    const {width} = Dimensions.get("window");
    const height = width*0.8;

    // const [address, setAddress] = useState([]);
    // const getAddress = () => {
    //     fetch(RGEO_URL.concat(`?apiKey=${RGEO_API_KEY}&mode=retrieveLandmarks&gen=9&prox=${lat},${long}`),{
    //         method: 'GET'
    //     })
    //     .then(response => response.json())
    //     .then(result => {
    //         setAddress(result.Response.View[0].Result[1].Location.Address.Street)
    //     })
    //     .catch(error => console.log(error))
    // }
    // useEffect(() =>{
    //     let address = getAddress()
    // },[])

    //var randomNumber = Math.floor(Math.random() * 5) + 1 ;
    
    return (
        <SafeAreaView>
            <ScrollView>
                <Image
                    source={link[index] == "" ? require('../assets/park6.jpg') : {uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${link[index]}&key=${gcsAPIKey}`}} 
                    loadingIndicatorSource={{uri: '../assets/adaptive-icon.png'}}
                    style={styles.image}
                    style={{width, height}}
                />
                <View style={styles.container}>
                    <Text style={styles.topHeader}>{item.park_name}</Text>
                    <Text style={styles.address}>{addresses[index]}</Text>
                    <View style={styles.location}>
                        <FontAwesome5
                            name="map-marker-alt" 
                            size={22} 
                            color="#696969"
                        />
                        <Text style={styles.subHeader1}>
                            {item.region}
                        </Text>
                        <Text style={styles.distance}>
                            {((item.distance)/1000).toFixed(2)}km
                        </Text>
                    </View>
                    
                    <Text style={styles.description}>
                        {item.park_name} is a green space located in {item.region}. With carefully maintained greenery and various facilities, the park recreates a lush green and authentic experience for all park-goers to bask in. Park-goers may also use the facilities to add a new dimension to the experience.
                    </Text>
                    <Text style={styles.subHeader2}>Amenities</Text>
                    <View style={styles.facilityList}>
                        {item.facilities.map(facility => (
                            <View style={styles.facilityIcon} key={facility}>
                                <FontAwesome5
                                    name={icons.filters[facility]}
                                    size={15}
                                />
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>        
    )
}

const styles = StyleSheet.create({
    container:{
        padding:10,
        margin:5
    },
    image:{
        resizeMode: 'cover',
    },
    topHeader:{
        fontSize:25,
        fontWeight: "bold",
        color: "#2f4f4f"
    },
    location:{
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        margin: 5,
    },
    subHeader1:{
        flexDirection: 'column',
        fontSize:20,
        color: '#696969',
        fontWeight: '900',
        flex: 3,
        marginLeft: 10,
    },
    distance:{
        fontSize:15,
        textAlignVertical: 'center',
        color: '#999999',
    },
    address:{
        color: '#999999',
        fontSize:12,
        fontStyle: 'italic'
    },
    description:{
        paddingTop: 5
    },
    subHeader2:{
        fontSize:20,
        fontWeight: 'bold',
        paddingTop: 5,
        color: "#2f4f4f"
    },
    facilityList: {
        flexDirection:'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        marginTop: 3
    },
    facilityIcon:{
        margin: 3,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#ECECEC',
        borderRadius:10
    },
})

export default ParkDetails
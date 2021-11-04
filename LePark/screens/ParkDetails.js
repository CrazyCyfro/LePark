// import { StatusBar } from 'expo-status-bar';
import React, {Component, useEffect, useState} from 'react';
import { StyleSheet,
    Text,
    View,
    ScrollView,
    StatusBar,
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
import ParkImage from '../utils/ParkImage';
import Address from '../utils/Address'

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

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

    const item = route.params.item;

    const dist = ((item.distance)/1000).toFixed(2)
    const {width} = Dimensions.get("window");
    const height = width*0.8;
    
    return (
        <SafeAreaView style={styles.window}>
            <ScrollView>
                <ParkImage park_name={item.park_name} style={{width,height}}/>
                <View style={styles.container}>
                    <Text style={styles.topHeader}>{item.park_name}</Text>
                    <Address park_name={item.park_name} style={styles.address}/>
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
                            {isNaN(dist) ? null : dist + 'km'}
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
        fontSize:22,
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
    window: {
        // paddingTop: STATUSBAR_HEIGHT,
        height: SCREEN_HEIGHT - STATUSBAR_HEIGHT
    }
})

export default ParkDetails
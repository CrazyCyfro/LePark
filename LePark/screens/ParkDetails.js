import { StatusBar } from 'expo-status-bar';
import React, {Component, useEffect, useState} from 'react';
import { StyleSheet,
    Text,
    View,
    ScrollView,
    SectionList,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Image,
    SafeAreaView} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from 'expo-location'
//import { ScrollView } from 'react-native-gesture-handler'

const API_URL = 'https://mocki.io/v1/ec0964fc-71b8-4a74-ad69-1bdd280e60af'

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

    return (
        <ScrollView>
            <View style={styles.viewStyle}>
            <Image source={require('../assets/download.jpg')}/>
                <Text style={{fontSize:25, fontWeight: "bold"}}>
                    {item.park_name}
                </Text>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize:20}}>
                        {item.region}
                    </Text>
                    <Text style={{fontSize:20, textAlign: 'right'}}>
                        {((item.distance)/1000).toFixed(2)}km
                    </Text>
                </View>
                <Text style={{fontSize:15, marginTop:10}}>
                    Facilities: {item.facilities}
                </Text>
                
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewStyle:{
        padding:10,
        margin:10
    },
    image:{
        width: "100%",
        height: "20%",
        //resizeMode: "cover",
        borderRadius: 30
    }
})

export default ParkDetails

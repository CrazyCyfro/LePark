import React, {useEffect, useState} from 'react';
import { StyleSheet,
    Text,
    View,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Image,
    SafeAreaView} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function SearchResults({ navigation }) {

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

    const getResults = async() => {
        try {
            const value = await AsyncStorage.getItem('SearchResults');
            if(value !== null){
                setResults(JSON.parse(value));
            }
        } catch (error){
            console.log("error")
        }
    }

    const getImg = async (query) => {
        try {
        //   const response = await fetch(bingAPI + `${query}&subscription-key=${bingAPIKey}`);
          const response = await fetch(`https://api.bing.microsoft.com/v7.0/images/search?q=${query}k&subscription-key=c7d2dfb5cb4442a9b581d7ef7eaaf9fe&count=1`)
          const json = await response.json();
          setLink(json.value[0].contentUrl)
        } catch (error) {
          console.log(error);
        }
      };

    const [results, setResults] = useState([]);
    const [link, setLink] = useState([]);
    let url = ""

    useEffect(() => {
        getResults();       
    }, []);

    function setImg(query, link, url) {
        getImg(query)
        url = `${link}`
        return url
    }

    const resultsWithKey = results.map(item => ({
        ...item,
        key: item.park_name
    }))

    // const resultsWithLink = resultsWithKey.map(item => ({
    //     ...item,
    //     link: link.map(item)
    // }))

    // let url = "https://live.staticflickr.com/3801/9538733208_3c3716c9e4_b.jpg"

    // console.log(results)
    
    return(
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.header}>RESULTS</Text>
                <FlatList 
                    data={resultsWithKey}
                    initialNumToRender={10}
                    renderItem={({item, index}) => (
                        <TouchableOpacity onPress={() => navigation.navigate('Details', {item:item})}>
                        <View style={styles.item} key={item.park_name}>
                            <View style={styles.imageFrame}>                        
                                    <Image source={{uri: `${setImg(results[index].park_name, link, url)}`}} style={styles.image}/>                                
                            </View>
                            <View style={styles.info}>
                                <Text style={styles.parkName}>{item.park_name} {index}</Text>
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
                            </TouchableOpacity>
                    )}
                />   
            </View>
        </SafeAreaView>
    )


}

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        height: screenHeight - 154,
    },
    item: {
        padding: 10,
        marginVertical: 5,
        flexDirection:"row",
        height: 200,
        backgroundColor: "white",
    },
    header: {
        fontSize: 32,
        backgroundColor: "#fff",
        position: "relative",
        padding: 10,
        margin: 0,
        marginTop: 20,
        marginLeft: 10,
        fontWeight: "bold",
        color: "#1f4c50"
    },
    location:{
        flexDirection: 'row',
        padding:3,
    },
    parkName:{
        fontSize: 18,
        fontWeight:"bold",
        padding:3
    },
    distance: {
        textAlign:'right',
        textAlignVertical: 'bottom',
        fontSize: 13,
        color: 'grey'
    },
    distanceCont:{
        position:'absolute',
        right: 5,
        bottom: 20
    },
    imageFrame: {
        width: 165,
        padding: 10,
    },
    image:{
        width: "100%",
        height: "100%",
        resizeMode: "cover",
        borderRadius: 30
    },
    info:{
        flex: 3,
        height: 200,
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
        backgroundColor: '#ECECEC'

        ,
        borderRadius:10
    },

});
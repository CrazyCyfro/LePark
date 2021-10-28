import React, { useEffect, useState } from "react";
import { StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';
import {gcsAPIKey} from "@env"

export default function imgTest() {

    let results = [

        {
          "distance": 13627325,
          "facilities":[
            "Access Point",
          ],
          "park_name": "Changi Point Park Connector",
          "region": "Changi",
          "x_coord": 1.39055377,
          "y_coord": 103.9869655,
        },
        {
          "distance": 13627698,
          "facilities":[
            "Access Point",
            "Dog-Area",
          ],
          "park_name": "Coastal Park Connector",
          "region": "Changi",
          "x_coord": 1.369675022,
          "y_coord": 104.0046924,
        },
        {
          "distance": 13628132,
          "facilities":[
            "Access Point",
          ],
          "park_name": "Loyang Park Connector",
          "region": "Changi",
          "x_coord": 1.386997565,
          "y_coord": 103.9801316,
        },
      ]

    const [link, setLink] = useState([]);

    const getImg = async (results) => {
        try {
        let photoID = []
        for(let i = 0; i < results.length; i++){
            let query = results[i].park_name
            const response = await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${gcsAPIKey}&fields=name%2Cphotos%2Cformatted_address&input=${query}&inputtype=textquery`)
            const json = await response.json();
            if (!json.candidates[0].photos){
                photoID.push("")
            } else {
                photoID.push(json.candidates[0].photos[0].photo_reference)
            }
        }
          setLink(photoID)
        } catch (error) {
          console.log(error);
        }
      };


    useEffect(() => {
        getImg(results)
    }, [])


    console.log(link)

    return(
        <View>
            <Text>Image</Text>
            <View style={styles.imageFrame}>                        
                    <Image source={link[0] == "" ? require('../assets/park6.jpg') : {uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${link[0]}&key=${gcsAPIKey}`}} 
                    loadingIndicatorSource={require("../assets/adaptive-icon.png")}
                    style={styles.image}/>                                
            </View>
        </View>
    )

}
const styles = StyleSheet.create({
    
    image:{
        width: 165,
        height: 165,
        resizeMode: "cover",
        borderRadius: 30
    },
});
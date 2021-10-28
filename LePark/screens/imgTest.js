import React, { useEffect, useState } from "react";
import { StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';

export default function imgTest() {


    
    const gcsAPI = "https://www.googleapis.com/customsearch/v1/siterestrict?[parameters]"
    const gcsAPIKey = "AIzaSyBj1aiWKe8oWnEsyvCaWFwCCDFo6Os5Ypw"

    const bingAPI = "https://api.bing.microsoft.com/v7.0/images/search?q="
    const bingAPIKey = "c7d2dfb5cb4442a9b581d7ef7eaaf9fe"

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
        //   const response = await fetch(bingAPI + `${query}&subscription-key=${bingAPIKey}`);
        let photoID = []
        for(let i = 0; i < results.length; i++){
            let query = results[i].park_name
            console.log(query)
            const response = await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${gcsAPIKey}&fields=name%2Cphotos&input=${query}&inputtype=textquery`)
            const json = await response.json();
            // console.log(json.candidates[0].photos[0].photo_reference)
            photoID.push(json.candidates[0].photos[0].photo_reference)
            // console.log(json)
        }
        //   console.log(photoID)
          setLink(photoID)
        //   setLink((prev)=>[...prev, json.value[0].contentUrl])
        //   setLink(json.value[0].contentUrl)
        } catch (error) {
          console.log(error);
        }
      };

    // useEffect(async() => {
    //     await getImg(`${results[i].park_name}`)
    // }, []);

    // useEffect(() => {
    //     getImg(results)
    // }, [])

    // const setImg = (query, link) => {
    //     getImg(query)
    //     let x = link
    //     return x
    // }

    // console.log(link)

    return(
        <View>
            <Text>Image</Text>
            <Image source={{uri: `https://live.staticflickr.com/3801/9538733208_3c3716c9e4_b.jpg` }} loadingIndicatorSource={1} style={styles.image}/>
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
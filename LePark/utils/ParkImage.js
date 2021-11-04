import React, { useEffect, useState } from "react";
import {
    Image,
} from 'react-native';
import {gcsAPIKey} from "@env"

export default function ParkImage(props) {

    const [link, setLink] = useState([]);

    const getImg = async () => {
        try {
        let photoID = []
        let query = props.park_name
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${gcsAPIKey}&fields=name%2Cphotos%2Cformatted_address&input=${query}&inputtype=textquery`)
        const json = await response.json();
        if (!json.candidates[0].photos){
            photoID.push("")
        } else {
            photoID.push(json.candidates[0].photos[0].photo_reference)
        }
          setLink(photoID)
        } catch (error) {
          console.log(error);
        }
      };

    useEffect(() => {
        getImg()
    }, [])

    // console.log(link)

    return(                
          <Image source={link[0] == "" ? require('../assets/park6.jpg') : 
          {uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=700&photo_reference=${link[0]}&key=${gcsAPIKey}`}} 
          style={props.style}/>                                
    )

}

import React, { useEffect, useState } from "react";
import {
    Text,
} from 'react-native';
import {gcsAPIKey} from "@env"

export default function ImgTest(props) {

    const [link, setLink] = useState([]);

    const getAddress = async () => {
        try {
        let address = []
        let query = props.park_name
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${gcsAPIKey}&fields=name%2Cphotos%2Cformatted_address&input=${query}&inputtype=textquery`)
        const json = await response.json();
        address.push(json.candidates[0].formatted_address)
          setLink(address)
        } catch (error) {
          console.log(error);
        }
      };

    useEffect(() => {
        getAddress()
    }, [])

    // console.log(link)

    return(                
          <Text style={props.style}>{link[0]}</Text>                                
    )

}

import * as React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { RootStackScreenProps } from '../types';
import { useEffect, useState } from 'react';
import Carousel from './Carousel';

//expo install react-native-maps in terminal to import MapView

export default function MapScreen({ navigation }) {

  let [data, setData] = useState<any[]>([]);
  useEffect(() => {
    fetch('http://datamall2.mytransport.sg/ltaodataservice/$metadata#CarParkAvailability', {
      method: 'POST',
      headers: {
        AccountKey: 'lta_api_key',
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        $skip: 500
      })
    })
      .then(res => res.json())
      .then((responseJson) => { setData(responseJson) })
      .catch(console.error)
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 1.3521,
          longitude: 103.8198,
          latitudeDelta: 0.1,
          longitudeDelta: 0.45,
        }}>
        <Marker
          coordinate={{ latitude: 1.3521, longitude: 103.8198 }}
          title={"Singapore"}
        />
        {data.map((value, i) => {
          return <Marker key={value.CarParkID}
            coordinate={{ latitude: parseFloat(value.Location.split(" ")[0]), longitude: parseFloat(value.Location.split(" ")[1]) }}
            title={value.Development}
            description={"Available Lots:" + value.AvailableLots} />
        })}
      </MapView>
      <View style={styles.carouselContainer}>
        <Carousel />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  carouselContainer: {
    position: 'absolute',
    top: 400,
    left: 0,
    right: 0,
    paddingBottom: 50,
    alignItems: 'center',
    backgroundColor: 'transparent',

  },
});


import React from "react";
import { StyleSheet, View, Text } from "react-native";

const CarouselItem = ({ item, index }) => {
  return (
    <View style={styles.carcontainer} key={index}>
      <Text style={styles.cartext}>{item.title}</Text>
      <Text style={styles.cartext}>{item.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  carcontainer: {
    backgroundColor: "floralwhite",
    borderRadius: 5,
    height: 200,
    padding: 50,
    marginLeft: 25,
    marginRight: 25,
  },
  cartext: {
    color: "black",
    fontSize: 28,
  },
});

export default CarouselItem;

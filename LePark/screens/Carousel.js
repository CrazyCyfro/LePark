import React, { useRef } from "react";
import { View } from "react-native";
import CarouselComp from "react-native-snap-carousel";
import CarouselItem from "./CarouselItem";

//'npm install --save react-native-snap-carousel' in terminal to import Carousel
//'npm install --save @types/react-native-snap-carousel' this too

const Carousel = () => {
  const isCarousel = React.useRef(null);
  const appData = [
    { title: "title", text: "text", latitude: 1.3521, longitude: 103.8198 },
    { title: "titleq", text: "textq", latitude: 1.3521, longitude: 103.8198 },
    { title: "title1", text: "text1", latitude: 1.3521, longitude: 103.8198 },
  ];

  return (
    <View>
      <CarouselComp
        layout={"default"}
        ref={isCarousel}
        data={appData}
        sliderWidth={300}
        itemWidth={300}
        renderItem={CarouselItem}
      />
    </View>
  );
};

export default Carousel;

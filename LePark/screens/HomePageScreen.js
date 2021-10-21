import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

function HomePageScreen() {
  const cartData = [
    { imageSource: require("../assets/download.jpg") },
    { imageSource: require("../assets/download.jpg") },
    { imageSource: require("../assets/download.jpg") },
    { imageSource: require("../assets/download.jpg") },
  ];

  return (
    <View
      style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}
    >
      {/* Main background Image */}
      <ImageBackground
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "100%",
          height: "100%",
        }}
        source={require("../assets/mainBackgroundPark.jpeg")}
      >
        {/* empty view for background opacity */}
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        />

        {/* main view */}
        <View
          style={{
            flex: 1,
            width: "85%",
            marginBottom: -RFPercentage(6),
            alignSelf: "center",
            justifyContent: "flex-end",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: RFPercentage(5),
              fontWeight: "bold",
            }}
          >
            Little Guilin,
          </Text>
          <Text
            style={{
              color: "#fff",
              fontSize: RFPercentage(4),
              fontWeight: "500",
            }}
          >
            Bukit Gombak
          </Text>
          <Text
            style={{
              marginTop: RFPercentage(1),
              color: "#fff",
              fontSize: RFPercentage(4),
              fontWeight: "bold",
            }}
          >
            EXPLORE
          </Text>
        </View>

        {/* cart */}
        <ScrollView
          horizontal={true}
          style={{ flex: 1, width: "100%", marginBottom: RFPercentage(4) }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            {/* mainBox */}
            {cartData.map((item, i) => (
              <TouchableOpacity
                activeOpacity={0.8}
                key={i}
                style={{
                  backgroundColor: "#000",
                  marginLeft: RFPercentage(3),
                  borderRadius: RFPercentage(2.5),
                  overflow: "hidden",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  width: RFPercentage(28),
                  height: RFPercentage(35),
                }}
              >
                <ImageBackground
                  style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "flex-end",
                    alignItems: "flex-start",
                  }}
                  source={item.imageSource}
                >
                  {/* Shadow Layer */}
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      left: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0,0,0,0.3)",
                    }}
                  />

                  {/* Heart Icon */}
                  <Feather
                    name="heart"
                    style={{
                      fontSize: RFPercentage(2.8),
                      position: "absolute",
                      top: RFPercentage(2),
                      right: RFPercentage(2.5),
                    }}
                    color="white"
                  />

                  {/* Bottom texts */}
                  <View
                    style={{
                      width: "90%",
                      alignSelf: "center",
                      marginBottom: RFPercentage(3),
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: RFPercentage(2.7),
                        fontWeight: "bold",
                      }}
                    >
                      Gardens By The Bay
                    </Text>
                    <View
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginTop: RFPercentage(0.3),
                        flexDirection: "row",
                      }}
                    >
                      <Entypo
                        name="location-pin"
                        style={{ fontSize: RFPercentage(2) }}
                        color={"#fff"}
                      />
                      <Text
                        style={{
                          marginLeft: RFPercentage(0.4),
                          color: "#fff",
                          fontWeight: "600",
                        }}
                      >
                        18 Marina Gardens Dr
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: "#fff",
                        marginTop: RFPercentage(1),
                        fontSize: RFPercentage(2),
                      }}
                    >
                      15.3 km
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

export default HomePageScreen;

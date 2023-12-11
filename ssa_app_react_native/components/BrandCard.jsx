import React from "react";
import { config } from "../config";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { Avatar, Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import navigationString from "../Constants/navigationString";
import imageImport from "../Constants/imageImport";
import AnimatedPulse from "./Pulse";

function BrandCard({ title, brandsData, navigation }) {
  const goToSubCategory = (value, cateId) => {
    console.log(value, cateId);
    navigation.navigate(navigationString.SUB_CATEGORY, {
      category_id: cateId,
      brand_name: value,
    });
  };
  const goToAllCategory = () => {
    navigation.navigate(navigationString.CATEGORY);
  };
  return (
    <View>
      <View style={styles.brandContainer}>
        <View style={styles.brandHeadingBox}>
          <Text style={styles.brandText}>{title}</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={goToAllCategory}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {/*=== FIRST FOUR ==== */}
        <View style={styles.brandCatgory}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() =>
              navigation.navigate(navigationString.NEW_ARRIVALS, {
                searchValue: "t",
                category: title,
              })
            }
            style={styles.brandBox}
          >
            <Image
              style={{
                width: 50,
                height: 50,
                borderRadius: 40,
                zIndex: 100,
                backgroundColor: "white",
              }}
              source={imageImport.NewArrivals}
            />

            <View style={{ position: "absolute", top: 25 }}>
              <AnimatedPulse
                numOfPulse={1}
                diameter={130}
                color={config.animationColor}
              />
            </View>
            <Text style={{ ...styles.brandName }}>New Arrivals</Text>
          </TouchableOpacity>
          {brandsData?.map((value, index) => {
            if (index < 3)
              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    goToSubCategory(value.brandName, value.category_id)
                  }
                  style={styles.brandBox}
                  key={index}
                >
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={{
                      uri: value.brandImage?.image_url,
                    }}
                  />
                  <Text style={styles.brandName}>
                    {value.brandName?.slice(0, 10)}
                  </Text>
                </TouchableOpacity>
              );
          })}
        </View>
        {/*=== FIRST FOUR ==== */}

        {/*=== NEXT FOUR ==== */}
        <View style={styles.brandCatgory}>
          {brandsData?.map((value, index) => {
            if (index > 2)
              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    goToSubCategory(value.brandName, value.category_id)
                  }
                  style={styles.brandBox}
                  key={index}
                >
                  {/* <Avatar.Image
         size={60}
         source={{
           uri: value.brandImage?.image_url
         }} */}
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={{
                      uri: value.brandImage?.image_url,
                    }}
                  />
                  <Text style={styles.brandName}>
                    {value.brandName?.slice(0, 10)}
                  </Text>
                </TouchableOpacity>
              );
          })}
        </View>
        {/*=== NEXT FOUR ==== */}
      </View>
    </View>
  );
}

export default BrandCard;

const styles = StyleSheet.create({
  brandContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  brandHeadingBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  brandText: {
    fontSize: 16,
    fontWeight: "600",
    textTransform: "capitalize",
    color: config.primaryColor,
  },
  seeAll: {
    fontWeight: "600",
    fontSize: 12,
    color: "white",
    backgroundColor: config.primaryColor,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  brandBox: {
    alignItems: "center",
  },
  brandName: {
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: "400",
    textTransform: "capitalize",
  },
  brandCatgory: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingTop: 15,
  },
});

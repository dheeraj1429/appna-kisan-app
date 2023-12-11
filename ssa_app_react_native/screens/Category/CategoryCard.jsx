import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import navigationString from "../../Constants/navigationString";

function CategoryCard({ itemImage, itemName, category_id, navigation }) {
  const goToSubCategory = (value, cateId) => {
    console.log(value, cateId);
    navigation.navigate(navigationString.SUB_CATEGORY, {
      category_id: cateId,
      brand_name: value,
    });
  };
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => goToSubCategory(itemName, category_id)}
      style={styles.brandCatgory}
    >
      <View style={styles.brandBox}>
        <Image
          style={{ width: 50, height: 50 }}
          source={{
            uri: itemImage,
          }}
        />
        <Text style={styles.brandName}> {itemName?.slice(0, 10)}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default CategoryCard;

const styles = StyleSheet.create({
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
    paddingHorizontal: 15,
    paddingTop: 15,
  },
});

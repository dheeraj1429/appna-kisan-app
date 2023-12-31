import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import imageImport from "../Constants/imageImport";
import navigationString from "../Constants/navigationString";
import { addToCart, findProductInCart } from "../Utils/localstorage";
import { config } from "../config";
import { UseContextState } from "../global/GlobalContext";

function ProductCard({
  item,
  product_name,
  product_id,
  product_images,
  product_code,
  product_main_category,
  product_category,
  product_subcategory,
  new_arrival,
  product_variant,
  navigation,
  index,
}) {
  const [viewCart, setViewCart] = useState(false);
  const { cartState, setScrollIndex } = UseContextState();

  const checkProductInCart = async (product_id) => {
    const result = await findProductInCart(product_id);
    console.log("result=>", result);
    setViewCart(result);
  };

  useEffect(() => {
    checkProductInCart(product_id);
  }, [product_id, viewCart]);

  const addToCartButton = async (product) => {
    await addToCart(product);
    console.log("PRODUCT ADDED TO Cart");
    await cartState();
    setViewCart(true);
  };

  const goToProductInfoScreen = (productId) => {
    navigation.navigate(navigationString.PRODUCT_INFO, {
      product_id: productId,
    });
  };
  return (
    <ScrollView>
      <View style={styles.productBox}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            goToProductInfoScreen(product_id);
          }}
        >
          {new_arrival == true && (
            <View style={{ position: "absolute" }}>
              <Image
                style={{ width: 53, height: 53, left: 89, top: -20 }}
                source={imageImport.ProductNewArrivals}
              />
            </View>
          )}
          <Text style={styles.brandName}>{product_category}</Text>
          <Text style={styles.productName}>
            {product_name?.slice(0, 30)}
            {product_name?.length > 30 && "..."}{" "}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.imageBox}
          onPress={() => {
            if (index) {
              setScrollIndex(index);
            }
            goToProductInfoScreen(product_id);
          }}
        >
          <Image
            style={{ width: 100, height: 100 }}
            source={{
              uri: product_images[0]?.image_url
                ? product_images[0]?.image_url
                : "https://firebasestorage.googleapis.com/v0/b/ssa-app-7f8ea.appspot.com/o/logo_gray.png?alt=media&token=f5c98172-f6ad-4a17-9d6c-01fe066faabd",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.priceTextBox}
          activeOpacity={0.7}
          onPress={() => {
            if (index) {
              setScrollIndex(index);
            }
            goToProductInfoScreen(product_id);
          }}
        >
          <Text style={styles.priceText}>Add To Cart ➝</Text>
        </TouchableOpacity>
        {viewCart ? (
          <TouchableOpacity
            onPress={() => navigation.navigate(navigationString.CART)}
            activeOpacity={0.6}
            style={styles.addToCart}
          >
            <MaterialCommunityIcons name="cart-check" size={22} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() =>
              addToCartButton({
                product_name,
                _id: product_id,
                product_quantity: 1,
                product_images,
                product_code,
                product_main_category,
                product_subcategory,
                product_variant,
                product_quantity_by: "piece",
                product_category,
              })
            }
            activeOpacity={0.6}
            style={styles.addToCart}
          >
            <Entypo name="plus" size={22} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

export default ProductCard;

const styles = StyleSheet.create({
  productBox: {
    // backgroundColor: "#f5f5f6", //#f2f2f2
    backgroundColor: "#fff", //#f2f2f2
    borderWidth: 1,
    borderColor: "#f1f1f1",
    width: 165,
    height: 250,
    borderRadius: 30,
    margin: 5,
    padding: 20,
    overflow: "hidden",
  },
  imageBox: {
    marginTop: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontSize: 10,
    textTransform: "capitalize",
    fontWeight: "600",
    color: "gray",
  },
  productName: {
    textTransform: "capitalize",
    fontSize: 14,
    fontWeight: "500",
    color: "#222",
  },
  priceTextBox: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    bottom: 12,
    left: 17,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
  addToCart: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    padding: 12,
    right: 0,
    backgroundColor: config.primaryColor,
    borderTopLeftRadius: 10,
  },
});

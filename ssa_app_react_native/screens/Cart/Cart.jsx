import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  RefreshControl,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { config } from "../../config";
import { Surface } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import {
  getCartProductCount,
  setItemToLocalStorage,
  getAllCartProducts,
  removeFromCart,
} from "../../Utils/localstorage";
import navigationString from "../../Constants/navigationString";
import imageImport from "../../Constants/imageImport";
import { useFocusEffect } from "@react-navigation/native";
import { UseContextState } from "../../global/GlobalContext";

function Cart({ navigation }) {
  const [cartProducts, setCartProducts] = useState([]);
  const [updateCart, setUpdateCart] = useState(false);
  const [cartItemCount, setCartItemCount] = useState();
  const [render, setRender] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const { cartState } = UseContextState();

  console.log("CART PRODUCTS =>", cartProducts);
  const getAllProducts = async () => {
    const result = await getAllCartProducts();
    // console.log("Newresult=>",result)
    if (result != null) {
      setCartProducts(result);
    } else {
      setCartProducts([]);
    }
    setRefreshing(false);
  };
  useFocusEffect(
    useCallback(() => {
      getAllProducts();
    }, [updateCart, render, navigation, refreshing])
  );

  const onRefresh = async () => {
    setRefreshing(true);
  };

  const getItemCount = async () => {
    const count = await getCartProductCount();
    // console.log('ITEM FROM Cart=>',count)
    setCartItemCount(count);
  };
  useFocusEffect(
    useCallback(() => {
      getItemCount();
    }, [updateCart])
  );

  const removeProduct = async (product_id) => {
    // console.log(product_id)
    const result = await removeFromCart(product_id);
    // console.log(result)
    setUpdateCart(true);
    await cartState();
    setRender((prev) => !prev);
  };

  const increaseQuantity = async (product_id) => {
    // console.log(product_id,"cart product id")
    const updatedCartProduct = cartProducts;
    cartProducts?.map((value, index) => {
      if (value._id == product_id) {
        // console.log("FIND>>>>")
        updatedCartProduct[index] = {
          ...value,
          product_quantity: value.product_quantity + 1,
        };
        setCartProducts(updatedCartProduct);
        // console.log(updatedCartProduct,'updated Cart')
      }
    });
    await setItemToLocalStorage("@cartproducts", updatedCartProduct);
    setRender((prev) => !prev);
  };
  const decreaseQuantity = async (product_id) => {
    // console.log(product_id,"cart product id")
    const updatedCartProduct = cartProducts;
    cartProducts?.map((value, index) => {
      if (value._id == product_id) {
        if (value?.product_quantity == 1) {
          removeProduct(product_id);
        }
        if (value.product_quantity > 1) {
          // console.log("FIND>>>>")
          updatedCartProduct[index] = {
            ...value,
            product_quantity: value.product_quantity - 1,
          };
          setCartProducts(updatedCartProduct);
          // console.log(updatedCartProduct,'updated Cart')
        }
      }
    });
    await setItemToLocalStorage("@cartproducts", updatedCartProduct);
    setRender((prev) => !prev);

    return;
  };

  const goToCheckout = () => {
    navigation.navigate(navigationString.CHECKOUT, {
      checkoutProducts: cartProducts,
    });
  };

  return (
    <View style={styles.cartMainContainer}>
      <Surface style={styles.cartHeader}>
        <Text style={styles.cartHeadingText}>My Cart</Text>
        <View style={styles.checkoutBtnBox}>
          {cartProducts?.length > 0 ? (
            <TouchableOpacity
              onPress={goToCheckout}
              activeOpacity={0.8}
              style={styles.checkoutBtn}
            >
              <Text style={styles.checkoutText}>Place Order</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: navigationString.HOME }],
                })
              }
              activeOpacity={0.8}
              style={styles.checkoutBtn}
            >
              <Text style={styles.checkoutText}>Shop Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </Surface>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        style={styles.cartListBox}
      >
        {cartProducts?.length != 0 &&
          cartProducts?.map((value, index) => (
            //  <View key={value._id} style={styles.cartItemBox} >
            <View
              key={value._id}
              style={
                cartProducts?.length != 1 && cartProducts?.length - 1 == index
                  ? {
                      ...styles.cartItemBox,
                      borderBottomColor: "#fff",
                      borderBottomWidth: 1,
                    }
                  : { ...styles.cartItemBox }
              }
            >
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(navigationString.PRODUCT_INFO, {
                      product_id: value?._id,
                      product_quantity: value?.product_quantity,
                      product_quantity_by: value?.product_quantity_by,
                    })
                  }
                  activeOpacity={0.7}
                >
                  <Image
                    source={{ uri: value?.product_images[0]?.image_url }}
                    style={{ width: 80, height: 80 }}
                  />
                </TouchableOpacity>
                <View style={styles.cartDetails}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(navigationString.PRODUCT_INFO, {
                        product_id: value?._id,
                        product_quantity: value?.product_quantity,
                        product_quantity_by: value?.product_quantity_by,
                      })
                    }
                    activeOpacity={0.8}
                  >
                    <Text style={styles.productName}>
                      {value.product_name?.slice(0, 24)}
                      {value?.product_name?.length > 24 && "..."}
                    </Text>
                  </TouchableOpacity>

                  <Text style={styles.productId}>{value.product_code}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.brandName}>
                      {value.product_category}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeProduct(value._id)}
                      activeOpacity={0.7}
                      style={{ paddingLeft: 16 }}
                    >
                      {/* <Text style={{color:config.primaryColor,fontSize:20,fontWeight:'600'}} >₹ {value.productPrice}</Text> */}
                      <Text style={{ fontSize: 12, color: "#cc0000" }}>
                        Remove
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.quantityBox}>
                    {/* <AntDesign name="minuscircleo" size={22} color={config.primaryColor} /> */}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => decreaseQuantity(value._id)}
                    >
                      <Ionicons
                        style={{
                          backgroundColor: "#f5f5f6",
                          paddingVertical: 6,
                          paddingHorizontal: 7,
                          borderRadius: 10,
                        }}
                        name="remove"
                        size={18}
                        color="#555"
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontWeight: "600",
                        fontSize: 15,
                        paddingHorizontal: 1,
                        width: 48,
                        textAlign: "center",
                        paddingVertical: 3,
                      }}
                    >
                      {value.product_quantity ? value.product_quantity : 1}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => increaseQuantity(value._id)}
                    >
                      <Ionicons
                        style={{
                          backgroundColor: "#f5f5f6",
                          paddingVertical: 6,
                          paddingHorizontal: 7,
                          borderRadius: 10,
                        }}
                        name="md-add"
                        size={18}
                        color="#555"
                      />
                    </TouchableOpacity>
                    <Text style={styles.productQuantityBy}>
                      {value?.product_quantity_by}
                    </Text>
                  </View>
                </View>
              </View>

              {/* <Text style={{color:config.primaryColor,fontSize:20,fontWeight:'600'}} >₹ {value.productPrice}</Text> */}
              {/* <TouchableOpacity onPress={()=>removeProduct(value._id)} activeOpacity={0.7} style={styles.priceBox} >
            <Text style={{fontSize:12,color:'#555'}} >Remove</Text>
          
             </TouchableOpacity> */}
              {/* <View style={styles.removeBox} >
             <Text style={{fontSize:12,color:'red'}} >Remove</Text>
           <Text style={{color:config.primaryColor,fontSize:20,fontWeight:'600'}} >₹ {value.productPrice}</Text> 

            </View> */}
            </View>
          ))}
        {cartProducts?.length == 0 && (
          <View
            style={{
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={imageImport.EmptyCart}
              style={{ width: 230, height: 230 }}
            />
            <Text
              style={{
                fontSize: 14,
                color: config.primaryColor,
                fontWeight: "600",
                textAlign: "center",
                letterSpacing: 1,
              }}
            >
              {" "}
              Empty Cart{" "}
            </Text>
          </View>
        )}

        {/* for extra space */}
        <View style={{ padding: 55 }}></View>
      </ScrollView>
    </View>
  );
}

export default Cart;

const styles = StyleSheet.create({
  cartMainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  cartHeader: {
    width: "100%",
    paddingTop: 50,
    paddingBottom: 13,
    paddingHorizontal: 20,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartHeadingText: {
    fontSize: 20,
    fontWeight: "600",
    color: config.primaryColor,
  },
  cartListBox: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  cartItemBox: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 10,
    borderRadius: 15,
    position: "relative",
    borderBottomColor: "#f2f2f2",
    borderBottomWidth: 1,
  },
  quantityBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 5,
  },
  productQuantityBy: {
    fontSize: 12,
    fontWeight: "500",
    backgroundColor: "#f2f2f2",
    textAlign: "center",
    textTransform: "capitalize",
    marginLeft: 8,
    paddingVertical: 4,
    width: 70,
    // paddingHorizontal:9,
    borderRadius: 40,
    color: "#555",
  },
  priceBox: {},
  cartDetails: {
    paddingLeft: 17,
  },
  productName: {
    fontSize: 16,
    textTransform: "capitalize",
    fontWeight: "600",
  },
  productId: {
    fontSize: 13,
    textTransform: "uppercase",
  },
  brandName: {
    fontSize: 13,
    textTransform: "capitalize",
  },
  removeBox: {
    position: "absolute",
    bottom: 19,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  checkoutBtnBox: {
    padding: 0,
    // paddingBottom:14,
  },
  checkoutBtn: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: config.primaryColor,
    borderRadius: 40,
    shadowColor: config.primaryColor,
    shadowOffset: { width: 50, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 36,
  },
  checkoutText: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 2,
    color: "white",
  },
});

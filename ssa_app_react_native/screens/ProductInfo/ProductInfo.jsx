import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Pressable,
  Linking,
  TextInput,
  Image,
} from "react-native";
import { config } from "../../config";
import { Octicons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import imageImport from "../../Constants/imageImport";
import { Entypo } from "@expo/vector-icons";
import { Zocial } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import strings from "../../Constants/strings";
import ProductImageCarousel from "./ProductImageCarousel";
import navigationString from "../../Constants/navigationString";
import axios from "axios";
import { getCartProductCount, getAllCartProducts, setItemToLocalStorage, clearLocalStorage, findProductInCart, addToCart } from "../../Utils/localstorage";
import { useFocusEffect } from "@react-navigation/native";
import { UseContextState } from "../../global/GlobalContext";
import { useCallback } from "react";
import { logger } from "react-native-logs";
import { Rating, AirbnbRating } from 'react-native-ratings';
import Toast from 'react-native-toast-message';

function ProductInfo({ route, navigation }) {
  const [productDetail, setProductDetail] = useState();
  const [laoding, setLoading] = useState(false);
  const [updateCart, setUpdateCart] = useState(false)
  const [cartItemCount, setCartItemCount] = useState();
  const [viewCart, setViewCart] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  //const [productQuantity, setProductQuantity] = useState(1);
  const [productQuantity, setProductQuantity] = useState(route.params?.product_quantity ? route.params?.product_quantity : 1);
  const [cartProducts, setCartProducts] = useState([]);
  const [render, setRender] = useState(false);
  const { cartState, authState, userData } = UseContextState()
  const log = logger.createLogger();
  const [startRating, setStarRating] = useState(1);
  log.info(userData, "asdfsgadfbfg");
  const  userType = userData?.user?.type;
  console.log(userType,"usertype");
  //const [productId, setProductID] = useState("prod_001797");
  const { product_id } = route.params;
  //const product_id = productId;
  log.info("PRODUCT ID", product_id);
  log.info("route.params; ", route.params);
  log.info("productDetail", productDetail)
  useEffect(() => {
    setLoading(true)
    axios.get(`${config.BACKEND_URI}/api/get/product/by/id/${product_id}`, { withCredentials: true })
      .then(res => {
        log.info("product info", res);
        // log.info("PRODUCT INFO=>",res?.data);
        setProductDetail({ ...res?.data, product_quantity_by: route.params?.product_quantity_by ? route.params?.product_quantity_by : 'piece' });
        setLoading(false)
        setRefreshing(false)
      })
      .catch(err => {
        log.info(err)
      })

  }, [product_id, refreshing])
  const [reviewText, setReviewText] = useState('');
  const ratingCompleted = (rating) => {
    setStarRating(rating);
  }
  const handleReviewSubmit = async () => {
    // Validate if the review text is not empty
    if (!reviewText.trim()) {
      Alert.alert('Error', 'Please enter a review.');
      return;
    }

    // Call the parent component's function to submit the review
    //onReviewSubmit(reviewText);
    try {

      const response = await axios.post("https://whale-app-88bu8.ondigitalocean.app/api/reviews", {
        rating: startRating,
        message: reviewText,
        product: product_id
      },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userData.accessToken,
            "x-user-type": userType,
          }
        })
      log.info(response, "response of review");
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Success',
        text2: response.data?.message,
        visibilityTime: 4000, // 4 seconds
        autoHide: true,
      });

    } catch (error) {
      //log.info(error, "error in review");
      //log.info(error.message, "errormessage");
      Toast.show({
        type: 'error',
        position: 'top',
        text2: error.response.data?.message,
        visibilityTime: 4000, // 4 seconds
        autoHide: true,
      });
    }
    // Show a success message using Alert
    //Alert.alert('Success', 'Review posted successfully.');

    // Clear the input field
    setReviewText('');
  };
  // const updateExistingProduct=async()=>{
  //   const result =  await getAllCartProducts();
  //   log.info("Newresult=>",result)
  //   if( result != null){
  //     setCartProducts(result);
  //   }
  //   else{
  //     setCartProducts([]);
  //   }

  // }

  // useFocusEffect(
  //   useCallback(()=>{
  //     updateExistingProduct();
  //   },[viewCart])
  // )

  const onRefresh = async () => {
    setRefreshing(true)
  }

  const checkProductInCart = async (product_id) => {
    const result = await findProductInCart(product_id);
    // log.info("result=>",result)
    setViewCart(result);
    setRefreshing(false)
  }

  useEffect(() => {
    checkProductInCart(product_id);
  }, [product_id, updateCart, refreshing]);


  const getItemCount = async () => {
    const count = await getCartProductCount();
    // log.info('ITEM FROM Cart=>',count)
    setCartItemCount(count);
    setRefreshing(false)
  }
  useEffect(() => {
    getItemCount();
  }, [updateCart, refreshing]);


  // ADD TO CART BUTTON
  const addToCartButton = async (product) => {
    await addToCart({ ...product, product_quantity: productQuantity });
    // log.info('PRODUCT ADDED TO Cart')
    setUpdateCart(prev => !prev)
    await cartState()
    // await clearLocalStorage()
  }

  // UPDATE CART BUTTON
  const updateCartButton = async (product) => {
    const result = await getAllCartProducts();
    // log.info("Newresult=>",result)
    const updateProducts = result
    await result.filter((value, index) => {
      if (value?._id == product?._id) {
        updateProducts[index] = ({ ...product, product_quantity: productQuantity })
      }
    })
    // log.info("updateProducts",updateProducts)
    await setItemToLocalStorage('@cartproducts', updateProducts);
    navigation.navigate(navigationString?.CART)
    //  await clearLocalStorage()
    // log.info("MAIN PRODUCT=>",{...product,product_quantity:productQuantity})
  }

  const goBack = () => {
    navigation.goBack();
  };

  const selectQuantityBy = async (option) => {
    if (option == 'piece') {
      setProductDetail((prev) => ({ ...prev, product_quantity_by: option }))
    }
    if (option == 'cartoon') {
      setProductDetail((prev) => ({ ...prev, product_quantity_by: option }))
    }

  }

  const increaseQuantity = async (product_id) => {
    log.info("productQuantity", productQuantity)
    if (productQuantity >= 9999) {
      return
    }
    setProductQuantity(productQuantity + 1)
    setProductDetail((prev) => ({ ...prev, product_quantity: productQuantity + 1 }))
    //  log.info(product_id,"cart product id")
    //  const updatedCartProduct = cartProducts; 
    //  cartProducts?.map((value,index)=>{
    //    if(value._id == product_id ){
    //      log.info("FIND>>>>")
    //      updatedCartProduct[index] ={...value,product_quantity:value.product_quantity + 1}
    //      setCartProducts(updatedCartProduct);// previous work
    //      log.info("updated cart products",updatedCartProduct)
    //    }
    //  })

    //   await setItemToLocalStorage('@cartproducts',updatedCartProduct);
    //   setRender(prev=>!prev)
  }


  const decreaseQuantity = async (product_id) => {
    if (productQuantity > 1) {
      setProductQuantity(productQuantity - 1)
      setProductDetail((prev) => ({ ...prev, product_quantity: productQuantity - 1 }))
    }
    return;
  }



  return (
    <View style={styles.screenContainer}>
      <StatusBar backgroundColor="#f5f5f6" />

      {laoding ?

        <View style={{ backgroundColor: 'white', flex: 1, alignItems: "center", width: "100%", height: '70%', justifyContent: 'center' }} >
          <Image
            source={imageImport.LoaderGif}
            style={{ width: 100, height: 100 }}
          />

        </View>
        :
        <View style={{ flex: 1 }}  >
          <ScrollView
            refreshControl={
              <RefreshControl progressViewOffset={40} refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}  >
            <View style={styles.productImageContainer}>
              <View style={styles.productHeader}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>

                  <MaterialIcons onPress={goBack} name="keyboard-arrow-left" size={27} color={config.primaryColor} />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                  <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate(navigationString.SEARCH_SCREEN)}  >
                    <Octicons
                      style={styles.serachIcon}
                      name="search"
                      size={20}
                      color={config.primaryColor}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate(navigationString.CART)}  >
                    <View style={styles.cartIconContainer} >
                      {authState?.cartCount > 0 && <Text style={styles.cartCount} >{authState?.cartCount}</Text>}
                    </View>
                    <Zocial

                      name="cart"
                      size={24}
                      style={{ paddingBottom: 2, width: 35 }}
                      color={config.primaryColor}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <ProductImageCarousel productImages={productDetail?.product_images} />
            </View>

            <View style={styles.productDetailContainer}>
              <View style={{ marginTop: 30 }}>
                <Text style={styles.productName} >{productDetail?.product_name}</Text>
                <Text style={styles.productVariation} >Variation : {productDetail?.product_variant}</Text>
                <View style={styles.selectBulkAndSingleBox} >
                  <View style={styles.selectBoxBorder} >
                    <TouchableOpacity onPress={() => selectQuantityBy('piece')} style={{ ...styles.selectSingleBox }} activeOpacity={0.5}  >
                      <MaterialIcons name="radio-button-on" size={22} color={productDetail?.product_quantity_by == 'piece' ? config.primaryColor : '#666'} />
                      <View style={{ flexDirection: 'row', }} >
                        {/* <FontAwesome5 name="boxes" size={22} color="#555" /> */}
                        <Text style={styles.selectSingleBoxText} >Piece's</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.selectBoxBorder} >
                    <TouchableOpacity onPress={() => selectQuantityBy('cartoon')} style={{ ...styles.selectSingleBox }} activeOpacity={0.5}  >
                      <MaterialIcons name="radio-button-on" size={22} color={productDetail?.product_quantity_by == 'cartoon' ? config.primaryColor : '#666'} />
                      {/* <FontAwesome5 name="boxes" size={22} color='#555' /> */}
                      <Text style={styles.selectSingleBoxText} >Cartoon</Text>
                    </TouchableOpacity>
                  </View>

                </View>
                <View style={styles.quantityAndShareContainer} >
                  <View style={styles.quantityBox} >
                    <TouchableOpacity activeOpacity={0.7} onPress={() => decreaseQuantity(product_id)} >
                      <Ionicons style={styles.quantityAddMinusBtn} name="remove" size={22} color="#555" />
                    </TouchableOpacity>
                    {/* <Text style={styles.quantityText}> */}
                    <TextInput style={styles.quantityText} onChangeText={value => {
                      log.info("VALUE=", value)
                      if (value?.length > 4) {
                        return
                      }
                      if (value == '') {
                        setProductQuantity(0)
                        return
                      }
                      if (value == 'Na') {
                        setProductQuantity(0)
                        return
                      }
                      setProductQuantity(parseInt(value))
                    }} value={`${productQuantity}`} keyboardType={'numeric'} />
                    {/* {productQuantity} */}
                    {/* </Text> */}
                    <TouchableOpacity activeOpacity={0.7} onPress={() => increaseQuantity(product_id)} >
                      <Ionicons style={styles.quantityAddMinusBtn} name="md-add" size={22} color="#555" />
                    </TouchableOpacity>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 0 }} >
                    <TouchableOpacity onPress={() => Linking.openURL(strings.CALLUS)} activeOpacity={0.6} style={styles.chatnowAndCallusIconBox} >
                      <Feather name="phone-call" size={28} color={config.primaryColor} />
                      <Text style={styles.chatnowAndCallusText} >Call Us</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL(strings.WHATSAPP)} activeOpacity={0.6} style={styles.chatnowAndCallusIconBox} >
                      <FontAwesome name="whatsapp" size={30} color={config.primaryColor} />
                      <Text style={styles.chatnowAndCallusText} >Chat Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {productDetail?.cartoon_total_products && <Text style={styles.productBulkDetail} >{productDetail?.cartoon_total_products} Piece In One Cartoon *</Text>}
                <View showsVerticalScrollIndicator={true} style={styles.DescriptionDetailsBox} >
                  <Text style={styles.DescriptionHeading} >Product Details </Text>
                  <View style={{ marginTop: 6 }} >
                    <View style={{ flexDirection: 'row' }} >
                      <Text style={styles.descriptionInnerText} >Product Code : </Text>
                      <Text style={{ fontSize: 12, color: '#555', textTransform: 'uppercase' }} >{productDetail?.product_code}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }} >
                      <Text style={styles.descriptionInnerText} >Color : </Text>
                      <Text style={{ fontSize: 12, color: '#555', textTransform: 'capitalize' }} >{productDetail?.color}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }} >
                      <Text style={styles.descriptionInnerText} >Size : </Text>
                      <Text style={{ fontSize: 12, color: '#555', textTransform: 'capitalize' }} >{productDetail?.size}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }} >
                      <Text style={styles.descriptionInnerText} >Brand : </Text>
                      <Text style={{ fontSize: 12, color: '#555', textTransform: 'capitalize' }} >{productDetail?.product_main_category}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }} >
                      <Text style={styles.descriptionInnerText} >Category : </Text>
                      <Text style={{ fontSize: 12, color: '#555', textTransform: 'capitalize' }} >{productDetail?.product_category}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }} >
                      <Text style={styles.descriptionInnerText} >Sub Category : </Text>
                      <Text style={{ fontSize: 12, color: '#555', textTransform: 'capitalize' }} >{productDetail?.product_subcategory}</Text>
                    </View>


                    <View style={{ flexDirection: 'row' }}>
                    
                      {userType === 'basic' ? (
                           <>
                           <Text style={styles.descriptionInnerText}>Product Price: </Text>
 
                           <Text style={{ fontSize: 12, color: '#555', textTransform: 'capitalize' }}>
                             {productDetail?.product_price}
                           </Text>
                         </>
                      ): 
                      userType === 'b2b' ? (
                        <>
                          <Text style={styles.descriptionInnerText}>B2B Product Price: </Text>

                          <Text style={{ fontSize: 12, color: '#555', textTransform: 'capitalize' }}>
                            {productDetail?.b2b_user_product_price}
                          </Text>
                        </>
                      ) : (
                        <>
                          <Text style={styles.descriptionInnerText}>B2C Product Price: </Text>

                          <Text style={{ fontSize: 12, color: '#555', textTransform: 'capitalize' }}>
                            {productDetail?.b2c_user_product_price}
                          </Text>
                        </>
                      )
                      }
                    </View>



                    <Text style={styles.descriptionInnerText} >Product Description :</Text>
                    <Text style={{ fontSize: 12, color: '#555', textAlign: 'left', letterSpacing: 0.4, textTransform: 'capitalize' }} >
                      {productDetail?.product_description}
                      {/* Universal to all electric bikes: Both the electric 
            bike headlight and electric bicycle rear light work voltage
             are DC12V 24V 36V 48V 60V,fits all ebikes on market.
             Universal to all electric bikes: Both the electric 
            bike headlight and electric bicycle rear light work voltage
             are DC12V 24V 36V 48V 60V,fits all ebikes on market.
             Universal to all electric bikes: Both the electric 
            bike headlight and electric bicycle rear light work voltage
             are DC12V 24V 36V 48V 60V,fits all ebikes on market. */}
                    </Text>
                  </View>
                </View>
              </View>


            </View>
            <View style={{ backgroundColor: 'white', width: '100%', height: 75 }} >
              {viewCart ?

                <TouchableOpacity onPress={() => updateCartButton(productDetail)} activeOpacity={0.8} style={styles.viewCartBtn}>

                  <Zocial
                    name="cart"
                    size={24}
                    style={{ paddingBottom: 2, width: 35 }}
                    color="white"
                  />
                  <Text style={styles.viewCartText}>View Cart </Text>
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => addToCartButton(productDetail)} activeOpacity={0.8} style={styles.addToCartBtn}>
                  <Zocial
                    name="cart"
                    size={24}
                    style={{ paddingBottom: 2, width: 35 }}
                    color="white"
                  />
                  <Text style={styles.addToCartText}>Add To Cart </Text>
                </TouchableOpacity>
              }

            </View>
            <View style={{ marginBottom: "25%", padding: "5%" }}>
              <AirbnbRating
                count={5}
                reviews={["Bad", "OK", "Good", "Very Good", "Wow"]}
                defaultRating={startRating}
                size={20}
                ratingColor='#efefef'
                onFinishRating={ratingCompleted}
              />
              <View style={styles.commonFieldContainer} >
                <TextInput
                  placeholder="Enter your review..."
                  style={styles.commonField}
                  value={reviewText}
                  onChangeText={(text) => setReviewText(text)}
                />
              </View>

              <TouchableOpacity onPress={() => {
                handleReviewSubmit();
              }}
                activeOpacity={0.8} style={styles.signUpBtn} >
                <Text style={styles.signInText} >
                  Post Review</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

        </View>
      }

    </View>
  );
}

export default ProductInfo;

const styles = StyleSheet.create({
  screenContainer: {
    // backgroundColor: "white",

    flex: 1,
  },
  signUpBtn: {
    width: '100%',
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: config.primaryColor,
    borderRadius: 16,
    shadowColor: config.primaryColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 90,
    elevation: 9
  },
  signInText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 1,
    color: 'white'
  },
  commonFieldContainer: {
    position: 'relative',
    width: '100%'
  },
  commonField: {
    width: '100%',
    marginTop: 15,
    paddingHorizontal: 45,
    paddingVertical: 9,
    fontSize: 14,
    backgroundColor: '#f5f5f6',
    letterSpacing: 2,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'lightgray'
  },
  productHeader: {
    position: 'absolute',
    top: -80,
    width: "100%",
    backgroundColor: '#f5f5f6',
    paddingTop: 55,
    paddingBottom: 4,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartIconContainer: {
    position: 'absolute',

  },
  cartCount: {
    position: 'relative',
    textAlign: 'center',
    backgroundColor: 'red',
    color: '#fff',
    fontWeight: '900',
    borderRadius: 40,
    fontSize: 8,
    paddingHorizontal: 2,
    paddingVertical: 2,
    width: 15,
    maxWidth: 16,
    right: -15,
    zIndex: 1
  },
  accountHeadingText: {
    fontSize: 17,
    paddingLeft: 5,
    fontWeight: "600",
    color: config.primaryColor,
  },
  serachIcon: {
    paddingRight: 10,
  },
  productImageContainer: {
    position: 'relative',
    marginTop: 70,
    height: 240,
    backgroundColor: "#f5f5f6",


  },
  productDetailContainer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    shadowColor: "#f2f2f2",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productName: {
    color: '#222',
    textTransform: 'capitalize',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.7,
  },
  productVariation: {
    color: '#555',
    paddingTop: 5,
    fontSize: 13,
    fontWeight: '600'
  },
  productBulkDetail: {
    color: config.primaryColor,
    paddingTop: 0,
    fontSize: 12,
    fontWeight: '500'
  },
  selectBulkAndSingleBox: {
    flex: 1,
    paddingTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  selectBoxBorder: {
    borderWidth: 1,
    width: '49%',
    borderColor: '#f2f2f2',
    padding: 2,
    borderRadius: 10
  },
  selectSingleBox: {
    width: '100%',
    borderWidth: 0.4,
    borderColor: '#f2f2f2',
    backgroundColor: '#f5f5f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 10
  },
  selectSingleBoxText: {
    paddingLeft: 10,
    fontSize: 15,
    color: '#555',
    letterSpacing: 1.3,
    fontWeight: '600',
  },

  quantityAndShareContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 2,
  },
  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    padding: 2,
    borderRadius: 10
  },
  quantityAddMinusBtn: {
    backgroundColor: '#f5f5f6',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10
  },
  quantityText: {
    fontWeight: '600',
    fontSize: 18,
    // paddingHorizontal:27,
    textAlign: 'center',
    width: 75,
    paddingVertical: 3
  },
  chatnowAndCallusIconBox: {
    paddingHorizontal: 12,
    alignItems: 'center'
  },
  chatnowAndCallusText: {
    fontSize: 11,
    color: '#555',
    paddingVertical: 2
  },
  DescriptionDetailsBox: {
    marginTop: 13,
    borderTopWidth: 1,
    borderColor: '#f2f2f2',
    // height:380,
  },
  DescriptionHeading: {
    marginTop: 14,
    color: '#222',
    letterSpacing: 0.7,
    fontSize: 16,
    fontWeight: '600'
  },
  descriptionInnerText: {
    fontSize: 12,
    paddingBottom: 1,
    color: "#1e1e1e",
    fontWeight: '600'
  },
  addToCartBtn: {
    position: "absolute",
    width: "90%",
    bottom: 8,
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 14,
    backgroundColor: config.primaryColor,
    borderRadius: 16,
    shadowColor: config.primaryColor,
    shadowOffset: { width: 10, height: 0 },
    shadowOpacity: 0.49,
    shadowRadius: 10,
    elevation: 5,
  },
  addToCartText: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 2,
    color: "white",
  },
  viewCartBtn: {
    position: "absolute",
    width: "90%",
    bottom: 8,
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 14,
    backgroundColor: config.primaryColor,
    borderRadius: 16,
    shadowColor: config.primaryColor,
    shadowOffset: { width: 10, height: 0 },
    shadowOpacity: 0.49,
    shadowRadius: 10,
    elevation: 5,

  },
  viewCartText: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 2,
    color: "white",
  }

});

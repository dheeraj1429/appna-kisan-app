import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Image,
  ImageBackground,
  Alert,
  Dimensions
} from "react-native";
import { config } from "../../config";
import statelist from "../../Constants/statelist";
import { Checkbox, Portal, Provider, Modal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import navigationString from "../../Constants/navigationString";
import axios from "axios";
import { clearLocalStorage, setItemToLocalStorage } from "../../Utils/localstorage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { UseContextState } from "../../global/GlobalContext";
import imageImport from "../../Constants/imageImport";
import { FlatList } from "react-native-gesture-handler";
import customer_review from "../../Constants/customer_review";


function RewardsScreen({ route, navigation }) {
  const [loading, setLoading] = useState(false)
  const { authState, fetchAuthuser } = UseContextState();
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');

  // console.log(authState,"authState")

  const banners = [
    { image: require('../../assets/banner-green.png'), text: 'Banner 1' },
    { image: require('../../assets/banner-green.png'), text: 'Banner 2' },
    { image: require('../../assets/banner-green.png'), text: 'Banner 3' },
    { image: require('../../assets/banner-green.png'), text: 'Banner 4' },
    { image: require('../../assets/banner-green.png'), text: 'Banner 5' },

  ];

  const scrollViewRef = useRef();
  const loopedBanners = [...banners, ...banners, ...banners];

  useEffect(() => {
    const bannerWidth = Dimensions.get('window').width;
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (scrollViewRef.current) {
        currentIndex = (currentIndex + 1) % loopedBanners.length;
        const offsetX = currentIndex * bannerWidth;
        scrollViewRef.current.scrollTo({ x: offsetX, animated: true });
      }
    }, 2000); // Adjust the interval as needed (in milliseconds)

    return () => clearInterval(interval);
  }, []);

  const goBack = () => {
    navigation.goBack();
  };
  // console.log("checkout-> ",editUserDetails)

  const userCollectedProducts = [
    { id: '1', name: 'Product Name 1', quantity: 2, points: 5, image: require('../../assets/tractor.png') },
    { id: '2', name: 'Product Name 2', quantity: 1, points: 10, image: require('../../assets/tractor.png') },
    { id: '3', name: 'Product Name 3', quantity: 3, points: 8, image: require('../../assets/tractor.png') },
    // Add more products as needed
  ];

  const ProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productName}>{`Quantity: ${item.quantity}`}</Text>
        <Text style={styles.productName}>{`Points: ${item.points}`}</Text>
      </View>
    </View>
  );

  // const renderAllReviews = (({ item, index }) => {
  //   console.log(item)
  //   return (
  //     <View style={styles?.reviewBox} >
  //       <View>
  //         <View style={{ flexDirection: "row", justifyContent: "flex-start", alignContent: "center" }}>
  //           <View>
  //             <Ionicons name="md-person-circle-sharp" size={35} color={config.primaryColor} style={{ marginRight: 8 }} />

  //           </View>
  //           <View>
  //             <Text style={{ fontWeight: '500', fontSize: 13, textTransform: 'capitalize', paddingTop: 3 }} >{item?.name}</Text>
  //             <View style={{ flexDirection: "row", justifyContent: "flex-start", alignContent: "center" }}>
  //               <Ionicons name="ios-star" size={15} color="gold" style={{ marginRight: 8 }} />
  //               <Ionicons name="ios-star" size={15} color="gold" style={{ marginRight: 8 }} />
  //               <Ionicons name="ios-star-half" size={15} color="gold" style={{ marginRight: 8 }} />
  //             </View>
  //           </View>
  //         </View>
  //         <Text style={{ fontSize: 13, color: '#222', textTransform: 'capitalize' }} >{item?.content}</Text>

  //       </View>
  //     </View>
  //   )
  // })



  return (
    <Provider>
      <Portal>
        <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: "white" }}>
          <View style={styles.screenContainer}>
            <StatusBar backgroundColor="#fff" />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingTop: 50, paddingBottom: 10 }} >
              <MaterialIcons onPress={goBack} name="keyboard-arrow-left" size={27} color={config.primaryColor} />
              <Text style={styles.headingText} >Reward Points</Text>
              {/* <MaterialIcons name="keyboard-arrow-left" size={27} color='white' /> */}
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Button Pressed',
                    'You pressed the TouchableOpacity!',
                    [
                      { text: 'OK', onPress: () => console.log('OK Pressed') }
                    ],
                    { cancelable: false }
                  );
                }}>

                <View style={{
                  flexDirection: 'row', justifyContent: "flex-end", backgroundColor: '#f5f5f6',
                  borderRadius: 16,
                  borderWidth: 0.5,
                  borderColor: 'lightgray',

                  paddingHorizontal: "2%",
                  paddingVertical: 5,
                }}
                >
                  <FontAwesome5 name="coins" size={20} color={config.primaryColor} style={{ marginRight: 8 }} />
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginRight: 8 }}>10</Text>
                </View>
              </TouchableOpacity>

            </View>

            {loading && <View style={{ justifyContent: 'center', alignItems: 'center' }} >
              <ActivityIndicator color={config.primaryColor} size='large' />
            </View>
            }
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(navigationString.REDEEM_PROD)
              }}>
              <View style={{
                backgroundColor: '#f5f5f6',
                borderRadius: 16,
                borderWidth: 0.5,
                borderColor: 'lightgray',
                paddingVertical: "2%",
                marginHorizontal: "5%",
                marginVertical: "5%"
              }}
              >
                <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: "center" }}>
                  Collect Redeem Products
                </Text>
              </View>
            </TouchableOpacity>
            <Text></Text>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              ref={scrollViewRef}
            >
              {loopedBanners.map((banner, index) => (
                <View key={index} style={{ width: Dimensions.get('window').width }}>
                  <ImageBackground source={banner.image} style={{ width: '100%', height: 200 }} >
                    <Text style={{ color: 'white', textAlign: 'center', marginTop: "5%",fontSize:20 }}>{banner.text}</Text>
                  </ImageBackground>
                </View>
              ))}
            </ScrollView>
            {/* 
          <View style={styles.brandContainer} >
            <View style={styles.brandHeadingBox} >
              <View style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 15 }} >
                <Text style={styles.brandText}>Customer Reviews</Text>

              </View>
            </View>
            <View style={{ alignItems: "center", paddingTop: 10 }} >
              <FlatList
                data={customer_review?.reviews}
                renderItem={renderAllReviews}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                keyExtractor={(item) => item.name}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </View> */}
            <View style={styles.userProductsContainer}>
              <FlatList
                data={userCollectedProducts}
                renderItem={({ item }) => <ProductItem item={item} />}
                keyExtractor={(item) => item.id}
              />
            </View>

          </View>

        </ScrollView>
      </Portal>
    </Provider>


  );
}

export default RewardsScreen;

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: "white",
    flex: 1,
  },
  headingText: {
    color: config.primaryColor,
    fontSize: 17,
    letterSpacing: 1,
    fontWeight: '600',
  },
  commonFieldMainBox: {
    marginTop: 12,
    width: '100%',
    height: "100%",
    paddingHorizontal: 20,
  },
  commonField: {
    width: '20%',
    marginTop: 5,
    marginLeft: "75%",
    paddingHorizontal: "5%",
    paddingVertical: 9,
    //fontSize: 14,
    //textTransform: 'capitalize',
    backgroundColor: '#f5f5f6',
    // letterSpacing: 1.5,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'lightgray'
  },
  brandContainer: {
    // paddingHorizontal: 15,
    paddingBottom: 90,

  },
  brandHeadingBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5
  },
  brandText: {
    fontSize: 16,
    fontWeight: "600",
    textTransform: 'capitalize',
    color: config.primaryColor

  },
  reviewBox: {
    borderWidth: 1,
    borderColor: '#f1f1f1',
    width: 220,
    // height: 160,
    borderRadius: 20,
    margin: 5,
    padding: 15,
    overflow: "hidden",
  },
  productItem: {
    backgroundColor: '#f5f5f6',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'lightgray',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: "5%",
  },

  productImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginRight: 10,
  },

  productDetails: {
    flex: 1,
  },
  userProductsContainer:{
marginHorizontal:"2%",
marginTop:"5%",

  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
});
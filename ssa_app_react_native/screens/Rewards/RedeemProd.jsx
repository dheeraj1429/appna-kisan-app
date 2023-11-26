import React, { useState, useEffect } from "react";
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
  Alert

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
import ProductCard from "../../components/ProductCard";


function RedeemProd({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  // console.log(authState,"authState")

  const productsData = [
    { id: '1', name: 'Product 1', points: 50, image: require('../../assets/tractor.png') },
    { id: '2', name: 'Product 2', points: 75, image: require('../../assets/tractor.png') },
    { id: '3', name: 'Product 3', points: 100, image: require('../../assets/tractor.png') },
    // Add more products as needed
  ];

  const handleOrderPress = (product) => {
    Alert.alert('Order Pressed', `You ordered ${product.name}`);
  };

  const goBack = () => {
    navigation.goBack();
  };
  // console.log("checkout-> ",editUserDetails)

  const ProductCard = ({ product, onOrderPress }) => (
    <View style={styles.cardContainer}>
      <Image source={product.image} style={styles.productImage} />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPoints}>{`Points: ${product.points}`}</Text>
      <TouchableOpacity onPress={() => onOrderPress(product)}>
        <View style={styles.orderButton}>
          <Text style={styles.orderButtonText}>Redeem Product</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <Provider>
      <Portal>
        <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor:"white"}}>
        <View style={styles.screenContainer}>
          <StatusBar backgroundColor="#fff" />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingTop: 50, paddingBottom: 10 }} >
            <MaterialIcons onPress={goBack} name="keyboard-arrow-left" size={27} color={config.primaryColor} />
            <Text style={styles.headingText} >Products</Text>
            <MaterialIcons name="keyboard-arrow-left" size={27} color='white' />

          </View>

          {loading && <View style={{ justifyContent: 'center', alignItems: 'center' }} >
            <ActivityIndicator color={config.primaryColor} size='large' />
          </View>
          }
    

        </View>
        <View>
            <FlatList
              data={productsData}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  onOrderPress={() => handleOrderPress(item)}
                />
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        </ScrollView>
      </Portal>
    </Provider>


  );
}

export default RedeemProd;

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
  cardContainer: {
    backgroundColor: '#f5f5f',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    padding: 16,
    //marginBottom: 16,
    marginVertical:"5%",
    alignItems: 'center',
    marginHorizontal:"5%"
  },
  productImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPoints: {
    fontSize: 16,
    color: '#777',
    marginBottom: 12,
  },
  orderButton: {
    width: 350,
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
  orderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

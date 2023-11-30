import React,{useEffect, useState} from "react";
import { StyleSheet, Text, Image, View, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getCartProductCount } from "../Utils/localstorage";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import Category from "../screens/Category/Category";
import Orders from "../screens/Orders/Orders";
import Cart from "../screens/Cart/Cart";
import Account from "../screens/Account/Account";
import navigationString from "../Constants/navigationString";
import { config } from "../config";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import Home from "../screens/Home/Home";
import SubCategory from "../screens/SubCategory/SubCategory";
import SearchResult from "../screens/SearchResult/SearchResult";
import { UseContextState } from "../global/GlobalContext";
import NewArrivals from "../screens/NewArrivals/NewArrivals";
import ViewOrder from "../screens/Orders/ViewOrder";




const Tabs = createBottomTabNavigator();
const Stack = createStackNavigator();
// const Stack = createNativeStackNavigator();

// HOME SCREENS 
const HomeStack =()=>{
 return(
  <Stack.Navigator 
  screenOptions={{
    headerShown: false,
    tabBarShowLabel: false,
    tabBarStyle: styles.screenOption,
    tabBarHideOnKeyboard:true
  }}>
  <Stack.Screen name={navigationString.HOME} component={Home} />
  <Stack.Screen name={navigationString.SUB_CATEGORY} component={SubCategory}  options={{
          cardStyleInterpolator:
            CardStyleInterpolators.forHorizontalIOS,
        }} /> 
  <Stack.Screen name={navigationString.SEARCH_RESULT} component={SearchResult}  options={{
          cardStyleInterpolator:
            CardStyleInterpolators.forHorizontalIOS,
        }} /> 
  <Stack.Screen name={navigationString.NEW_ARRIVALS} component={NewArrivals}  options={{
          cardStyleInterpolator:
            CardStyleInterpolators.forHorizontalIOS,
        }} /> 
  {/* <Stack.Screen name={navigationString.VIEW_ORDER} component={ViewOrder}  options={{
          cardStyleInterpolator:
            CardStyleInterpolators.forHorizontalIOS,
        }} />  */}
</Stack.Navigator>
 )
}
// HOME SCREENS 

function Route({navigation}) {
  const {authState} = UseContextState();
  console.log("authState",authState)
  const [ cartItemCount , setCartItemCount ] = useState()
  const getItemCount =async ()=>{
    const count = await getCartProductCount();
    // console.log('ITEM FROM LOCAL STORAGE=>',count)
     setCartItemCount(count);
  }
  useEffect(()=>{
     getItemCount();
  },[navigation]);

  const cartCount = authState?.cartCount

  return (
      <Tabs.Navigator
        initialRouteName="Account"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.screenOption,
          tabBarHideOnKeyboard:true
        }}
      >
        <Tabs.Screen
          name={navigationString.CATEGORY}
          component={Category}
          options={{
            tabBarIcon: ({ focused }) => (
              <View>
                <MaterialIcons
                  name="category"
                  size={24}
                  color={focused ? config.primaryColor : "#555"}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name={navigationString.ORDER}
          component={Orders}
          options={{
            tabBarIcon: ({ focused }) => (
              <View>
                <MaterialCommunityIcons
                  name="shopping"
                  size={24}
                  color={focused ? config.primaryColor : "#555"}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name={navigationString.HOME}
          component={HomeStack}
          options={{
            
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  top: -20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: 60,
                    height: 60,
                    borderRadius: 35,
                    backgroundColor: config.primaryColor,
                  }}
                >
                  <Ionicons name="ios-home" size={24} color="#fff" />
                </View>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name={navigationString.CART}
          component={Cart}
          options={{
            tabBarIcon: ({ focused }) => (
              <View>
                 <View style={styles.cartIconContainer} >
       {cartCount > 0 &&  <Text style={styles.cartCount} >{cartCount}</Text>}
        </View>
                <Entypo
                  name="shopping-cart"
                  size={24}
                  color={focused ? config.primaryColor : "#555"}
                />
              </View>
            ),
            // tabBarBadge: cartItemCount
          }}
        />
        <Tabs.Screen
          name={navigationString.ACCOUNT}
          component={Account}
          options={{
          
            
            tabBarIcon: ({ focused }) => (
              <View>
                <MaterialCommunityIcons
                  name="account-circle"
                  size={28}
                  color={focused ? config.primaryColor : "#555"}
                />
              </View>
            ),
          }}
        />
        
      </Tabs.Navigator>
 
   


  );
}

export default Route;

const styles = StyleSheet.create({
  screenOption: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
   
  },
  cartIconContainer:{
    position:'absolute',

  },
  cartCount:{
    position:'relative',
    textAlign:'center',
    backgroundColor:'red',
    color:'#fff',
    fontWeight:'900',
    borderRadius:40,
    fontSize:8,
    paddingHorizontal:2,
    paddingVertical:2,
    width:15,
    maxWidth:16,
    right:-15,
    top:-6,
    zIndex:1
  },
});

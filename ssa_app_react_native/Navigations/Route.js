import React from "react";
import { StyleSheet, Text, Image, View, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import TabRoute from "./TabRoute"
import Login from "../screens/Login/Login";
import Home from "../screens/Home/Home";
import navigationString from "../Constants/navigationString";
import Register from "../screens/Register/Register";
import ProductInfo from "../screens/ProductInfo/ProductInfo";
import SearchScreen from "../screens/SearchScreen/SearchScreen";
import Checkout from "../screens/Checkout/Checkout";
import OrderCompleted from "../screens/Checkout/OrderCompleted";
import Otp from "../screens/Otp/Otp";
import { UseContextState } from "../global/GlobalContext";
import SendEnquiry from "../screens/SendEnquiry/SendEnquiry";
import EditProfile from "../screens/EditProfile/EditProfile";
import UpdateProfile from "../screens/Account/UpdateProfile";
import RewardsScreen from "../screens/Rewards/RewardsScreen";
import NewArrivals from "../screens/NewArrivals/NewArrivals";
import ViewOrder from "../screens/Orders/ViewOrder";
import RedeemProd from "../screens/Rewards/RedeemProd";
import Account from "../screens/Account/Account";
import ResetPass from "../screens/Login/ResetPass";
import LoginWithOtp from "../screens/Login/LoginWithOtp";
import SignupWithOtp from "../screens/Register/SignupWithOtp";
import OtpForgot from "../screens/Otp/OtpForgot";
// const Stack = createNativeStackNavigator()
const Stack = createStackNavigator();

const Tabs = createBottomTabNavigator();

function Route() {
  const { authState } = UseContextState();
  // console.log(authState,'authState');
  // console.log(authState?.isAuthenticated)
  return (

    <NavigationContainer>
      {/* {authState?.isAuthenticated ?  */}
      {authState?.isAuthenticated ?
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: styles.screenOption,
            tabBarHideOnKeyboard: true
          }}
        >
          <Stack.Screen name={navigationString.TAB_ROUTE} component={TabRoute} />
          <Stack.Screen name={navigationString.RESET_PASS} component={ResetPass} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forBottomSheetAndroid,
          }} />
          <Stack.Screen name={navigationString.PRODUCT_INFO} component={ProductInfo} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forBottomSheetAndroid,
          }} />
          <Stack.Screen name={navigationString.SIGNUP_WITH_OTP} component={SignupWithOtp} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forBottomSheetAndroid,
          }} />
          <Stack.Screen name={navigationString.REGISTER} component={Register} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forHorizontalIOS,
          }} />
          <Stack.Screen name={navigationString.LOGIN_WITH_OTP} component={LoginWithOtp} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forHorizontalIOS,
          }} />
          <Stack.Screen name={navigationString.OTP_FORGOT} component={OtpForgot} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forHorizontalIOS,
          }} />
          <Stack.Screen name={navigationString.SEARCH_SCREEN} component={SearchScreen} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forBottomSheetAndroid,
          }} />
          <Stack.Screen name={navigationString.CHECKOUT} component={Checkout} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forHorizontalIOS,
          }} />
          <Stack.Screen name={navigationString.ORDER_COMPLETED} component={OrderCompleted} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forHorizontalIOS,
          }} />
          <Stack.Screen name={navigationString.SEND_ENQUIRY} component={SendEnquiry} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forHorizontalIOS,
          }} />
          <Stack.Screen name={navigationString.EDIT_PROFILE} component={EditProfile} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forHorizontalIOS,
          }} />
          <Stack.Screen name={navigationString.VIEW_ORDER} component={ViewOrder} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forHorizontalIOS,
          }} />
          <Stack.Screen name={navigationString.UPDATE_PROFILE} component={UpdateProfile} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forHorizontalIOS,
          }} />
          <Stack.Screen name={navigationString.REWARDS_SCREEN} component={RewardsScreen} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forHorizontalIOS,
          }} />
          <Stack.Screen name={navigationString.REDEEM_PROD} component={RedeemProd} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forHorizontalIOS,
          }} />
          <Stack.Screen name={navigationString.LOGIN} component={Login} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forHorizontalIOS,
          }} />
        </Stack.Navigator>
        :
        <Stack.Navigator
          initialRouteName={navigationString.LOGIN}
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: styles.screenOption,
            tabBarHideOnKeyboard: true
          }}
        >
          <Stack.Screen name={navigationString.LOGIN} component={Login} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forHorizontalIOS,
          }} />
          <Stack.Screen name={navigationString.SIGNUP_WITH_OTP} component={SignupWithOtp} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forBottomSheetAndroid,
          }} />
          <Stack.Screen name={navigationString.LOGIN_WITH_OTP} component={LoginWithOtp} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forHorizontalIOS,
          }} />
          <Stack.Screen name={navigationString.RESET_PASS} component={ResetPass} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forBottomSheetAndroid,
          }} />
          <Stack.Screen name={navigationString.REGISTER} component={Register} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forHorizontalIOS,
          }} />
          <Stack.Screen name={navigationString.OTP_SCREEN} component={Otp} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forHorizontalIOS,
          }} />
          <Stack.Screen name={navigationString.UPDATE_PROFILE} component={UpdateProfile} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forHorizontalIOS,
          }} />
          <Stack.Screen name={navigationString.REWARDS_SCREEN} component={RewardsScreen} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forHorizontalIOS,
          }} />
          <Stack.Screen name={navigationString.EDIT_PROFILE} component={EditProfile} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forHorizontalIOS,
          }} />
          <Stack.Screen name={navigationString.REDEEM_PROD} component={RedeemProd} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forHorizontalIOS,
          }} />
          <Stack.Screen name={navigationString.TAB_ROUTE} component={TabRoute} />
          <Stack.Screen name={navigationString.PRODUCT_INFO} component={ProductInfo} options={{
            cardStyleInterpolator:
              CardStyleInterpolators.forHorizontalIOS,
          }} />
        </Stack.Navigator>
      }

      {/* if user not logged in */}

    </NavigationContainer>


    // <TabBar/>
    // <BottomNav />
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
});

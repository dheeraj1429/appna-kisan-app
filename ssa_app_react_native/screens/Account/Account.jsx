import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ActivityIndicator, SafeAreaView, Linking, Image, StyleSheet, TouchableOpacity, PermissionsAndroid } from "react-native";
import { Surface, Avatar, Modal, Portal, Provider } from "react-native-paper";
import { Octicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { config } from "../../config";
import { Feather } from "@expo/vector-icons";
import imageImport from "../../Constants/imageImport";
import strings from "../../Constants/strings";
import { UseContextState } from "../../global/GlobalContext";
import navigationString from "../../Constants/navigationString";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { uploadFileToFirebase } from "../../Utils/helperFunctions";
import storage from '@react-native-firebase/storage';
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

function Account({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [contactUsModalVisible, setContactUsModalVisible] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [render, setRender] = useState(false);
  const [getUserProfile, setGetUserProfile] = useState()
  const { logoutAuthUser, authState, userData } = UseContextState();
  console.log("authStateauthStateauthStateauthState", authState?.userData)
  const [userDetails, setUserDetails] = useState(null);

  const [accessToken, setAccessToken] = useState(null);
  const [name, setName] = useState(null);
  const [rewardPoints, setRewardPoints] = useState(null);

  const userInfo = async () => {
    //console.log(accessToken,"access");

    try {
      const response = await fetch('https://whale-app-88bu8.ondigitalocean.app/api/user/get/user/info', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken,
          'x-user-type': 'b2c',
        },
      });

      console.log('Response in update profile:', response);

      if (response.ok) {
        const data = await response.json();

        if (data && data.success) {
          return data;
        } else {
          console.log('API returned an error:', data ? data.error : 'No data received');
        }
      } else {
        console.log('UserInfo HTTP request failed with status:', response.status);
      }
    } catch (error) {
      console.log('Error fetching Details:', error.message);
    }
  };


  useEffect(() => {
    //console.log(accessToken);
    if (accessToken) { //code
      const fetchList = async () => {
        try {
          const response = await userInfo();
          //setApiResponse(response);
          console.log("UserInfo asdfgg", response);
          setName(response.user.name);
          console.log({ rdp: response.user });
          return response; // Add this line if you want to return the response
        } catch (error) {
          Alert.alert('Error fetching UserInfo:', error);
        }
      };

      fetchList();
    }


  }, [accessToken]);

  useEffect(() => {
    if (userData && userData.user) {
      setAccessToken(userData.accessToken);
      console.log("userdata", userData);
    }
  }, [userData]);
  // const { userData } = UseContextState();

  // useEffect(() => {
  //   // Call fetchAuthuser to update the user data in the global context
  //  // fetchAuthuser();
  //   console.log(userData, "userData from home page");

  // }, [ userData]);
  // const clickToLogout =async ()=>{
  //   await logoutAuthUser()
  // }

  // get user profile picture


  const chartDetails = async ({ token }) => {
    try {
      const response = await fetch('https://whale-app-88bu8.ondigitalocean.app/api/user/get/user/info', {
        method: 'GET',
      });
      console.log(response, "response");
      if (response.status === 200) {
        const data = await response.json();
        console.log(data, "data");

        if (data.success) {
          // Save the data to state or local storage
          setUserDetails(data.user);

          // Alternatively, if you want to save it to local storage
          // AsyncStorage.setItem('userInfo', JSON.stringify(data.user));
        } else {
          console.log('API returned an error:', data.error);
        }
      } else {
        console.log('User info HTTP request failed with status:', response.status);
      }
    } catch (error) {
      console.log('Error fetching user info:', error.message);
    }
  };
  useEffect(() => {
    axios.get(`${config.BACKEND_URI}/api/get/auth/user/profile/picture/${authState?.user?._id}`, { withCredentials: true })
      .then(res => {
        console.log(res?.data);
        setGetUserProfile(res?.data)
      })
      .catch(err => {
        console.log(err);
      })
  }, [render])

  // UPLOAD IMAGE TO FIREBASE THEN DUMP INTO DB
  useEffect(() => {
    const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTYwZDI2ZDAxOTc2ZTNiMjE0ZDAwYTQiLCJ1c2VyVHlwZSI6IkIyQiIsImlzQXBwcm92ZWQiOnRydWUsImlhdCI6MTcwMDkyMzk4NH0.1lh8395Se9GbTVlXMa8yoYwdMJqedYq8wLVqUsOGmds";

    const fetchData = async () => {
      try {
        const apiResponse = await chartDetails({ token });

        // Handle the API response here
        if (apiResponse) {
          const { data } = apiResponse;
          // console.log(data);

          // You can update the state or perform other actions here
          // For example, set the data in your component state:
          setUserDetails(data);
          console.log(data, "data value page");
        }
      } catch (error) {
        console.log('Error fetching data:', error.message);
      }
    };

    // fetchData();
  }, []);

  const uploadProfile = async () => {
  }

  // console.log("profilePicture=====",profilePicture)

  return (
    <Provider>
      <Portal>
        <View style={styles.screenContainer}>
          {/* {loading &&   <View style={{justifyContent:'center',alignItems: "center",height:'70%'}} >
    <ActivityIndicator color={config.primaryColor} />

  </View>} */}
          <Surface style={styles.accountHeader}>
            <Text style={styles.accountHeadingText}> My Account</Text>
            <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate(navigationString.SEARCH_SCREEN)}  >
              <Octicons
                style={{ paddingRight: 10 }}
                name="search"
                size={20}
                color={config.primaryColor}
              />
            </TouchableOpacity>
          </Surface>
          <View style={styles.mainContainer}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarWithUser}>
                {/* <Avatar.Image style={{backgroundColor:'#fff'}} size={60} source={imageImport.UserDefaultImage} /> */}
                <TouchableOpacity
                  onPress={uploadProfile}
                  activeOpacity={0.6} >

                  {profilePicture?.assets ?
                    <Image
                      source={{ uri: profilePicture?.assets[0].uri }}
                      style={{ width: 56, height: 55, borderRadius: 40 }}
                    />
                    :
                    getUserProfile?.image_url ?
                      <Image
                        source={{ uri: getUserProfile?.image_url }}
                        style={{ width: 56, height: 55, borderRadius: 40 }}
                      />
                      :

                      <Image
                        source={imageImport.UserDefaultImage}
                        style={{ width: 56, height: 55, borderRadius: 40 }}
                      />

                  }

                </TouchableOpacity>
                <View style={styles.userTextBox} >
                  <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>


                    <Text style={styles.userText}>Hello {name}</Text>
                    {/* <Text style={styles.userText}>{name}</Text> */}
                    {/* <Text style={styles.userText}>{rewardPoints}</Text> */}

                    <MaterialIcons name="verified" size={25} color={config.primaryColor} />


                  </View>
                  <Text style={styles.phoneNumber}>{userData?.user?.mobile}</Text>

                </View>
              </View>
              <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate(navigationString.EDIT_PROFILE)}  >
                <MaterialIcons name="keyboard-arrow-right" size={29} color="#1e1e1e" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.listBox}>
            <View style={styles.changeLanguageBox}>
              {/* <Ionicons name="ios-information-circle-outline" size={24} color={config.primaryColor}/> */}
              <AntDesign name="infocirlceo" size={24} color={config.primaryColor} />
              <Text style={styles.languageText}>About Us{name}</Text>
            </View>
            <View style={styles.changeLanguageBox}>
              <Feather name="phone-call" size={24} color={config.primaryColor} />
              <Text onPress={() => setContactUsModalVisible(true)} style={styles.languageText}>Contact Us</Text>
            </View>
            <View style={styles.changeLanguageBox}>
              <AntDesign name="profile" size={24} color={config.primaryColor} />
              <Text onPress={() => navigation.navigate(navigationString.UPDATE_PROFILE)} style={styles.languageText}>Update Profile</Text>
            </View>
            <View style={styles.changeLanguageBox}>
              <MaterialCommunityIcons name="hand-coin-outline" size={24} color={config.primaryColor} />
              <Text onPress={() => navigation.navigate(navigationString.REWARDS_SCREEN)} style={styles.languageText}>Reward Points</Text>
            </View>
            <View style={styles.changeLanguageBox}>
              <MaterialIcons
                style={styles.headerIcon2}
                name="security"
                size={24}
                color={config.primaryColor}
              />
              <Text style={styles.languageText}>Terms & Conditions</Text>
            </View>
            <View style={styles.changeLanguageBox}>
              <MaterialIcons
                style={styles.headerIcon2}
                name="security"
                size={24}
                color={config.primaryColor}
              />
              <Text style={styles.languageText}>Privacy Policy</Text>
            </View>
            <TouchableOpacity activeOpacity={0.6} onPress={() => setModalVisible(true)} style={styles.changeLanguageBox}>
              <MaterialIcons
                style={styles.headerIcon2}
                name="exit-to-app"
                size={24}
                color={config.primaryColor}
              />
              <Text style={styles.languageText}>Logout</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.logBox}>
            <Image
              style={styles.logoImage}
              source={imageImport.LogoAccountScreen}
            />
            <Text style={styles.versionText} >Version: {strings.APP_VERSION}</Text>
          </View>
        </View>
        {/*========== CONTACT MODAL =========== */}
        <Modal visible={contactUsModalVisible} onDismiss={() => setContactUsModalVisible(false)} contentContainerStyle={styles.containerStyle}>


          <View style={{ flexDirection: 'column', alignItems: 'flex-start' }} >
            <TouchableOpacity onPress={() => Linking.openURL(strings.CALLUS)} activeOpacity={0.6} style={styles.chatnowAndCallusIconBox} >
              <Feather name="phone-call" size={30} color={config.primaryColor} />
              <Text style={styles.chatnowAndCallusText} >Call Us</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL(strings.WHATSAPP)} activeOpacity={0.6} style={{ ...styles.chatnowAndCallusIconBox, borderTopWidth: 0.5, borderColor: 'lightgray', }} >
              <FontAwesome name="whatsapp" size={30} color={config.primaryColor} />
              <Text style={styles.chatnowAndCallusText} >Chat Now</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        {/*========== CONTACT MODAL =========== */}
        {/*========== LOGOUT MODAL =========== */}
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.containerStyle}>
          <View>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#222', textAlign: 'center' }} >
              <MaterialIcons name="info-outline" size={24} color="#222" />
            </Text>
            <View  >
              <View style={{ paddingTop: 8, paddingBottom: 13 }} >
                <Text style={{ textAlign: 'center', color: 'gray' }} > Do you want to Logout?</Text>
                {/* <Text style={{textAlign:'center',color:'gray'}}  >is not registered !!</Text> */}
              </View>
              <View style={{ paddingTop: 8, borderTopColor: '#f2f2f2', borderTopWidth: 1 }} >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 30 }} >
                  <TouchableOpacity activeOpacity={0.5} onPress={() => setModalVisible(false)} >
                    <View >
                      <Text style={{ color: config.primaryColor, fontSize: 14, fontWeight: '700' }} >Cancel</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => {
                    console.log("Log Out Button Clicked");
                    logoutAuthUser();
                  }} >
                    <View  >
                      <Text style={{ color: config.primaryColor, fontSize: 14, fontWeight: '700' }} >Log out</Text>
                    </View>
                  </TouchableOpacity>

                </View>
              </View>
            </View>
          </View>
        </Modal>
        {/*========== LOGOUT MODAL =========== */}
      </Portal>
    </Provider>
  );
}

export default Account;

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: "white",
    flex: 1,
  },
  accountHeader: {
    width: "100%",
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 20,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  containerStyle: {
    backgroundColor: 'white',
    paddingTop: 15,
    paddingBottom: 12,
    marginHorizontal: 80,
    borderRadius: 10,
    zIndex: 2
  },
  accountHeadingText: {
    fontSize: 20,
    fontWeight: "600",
    color: config.primaryColor,
  },
  serachIcon: {
    paddingRight: 10,
  },
  mainContainer: {
    paddingHorizontal: 20,
  },
  avatarContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatarWithUser: {
    flexDirection: "row",
    alignItems: "center",
  },
  userTextBox: {
    paddingLeft: 20,
  },
  userText: {
    fontWeight: "600",
    fontSize: 18,
    textTransform: 'capitalize',
    color: "#1e1e1e"

  },
  phoneNumber: {
    fontSize: 13,
    fontWeight: '400',
    color: config.primaryColor
  },
  listBox: {
    paddingHorizontal: 24,
  },
  changeLanguageBox: {
    flexDirection: "row",
    borderTopColor: "#f2f2f2",
    borderTopWidth: 1,
    paddingVertical: 18,
  },
  languageText: {
    paddingLeft: 20,
    fontWeight: "400",
    color: "#3e3e3e",
    fontSize: 16,
  },
  logBox: {
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 160,
    height: 100,
  },
  versionText: {
    fontSize: 13,
    color: "gray",
    paddingTop: 10
  },
  chatnowAndCallusIconBox: {
    paddingHorizontal: 18,
    width: '100%',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  chatnowAndCallusText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '400',
    letterSpacing: 1,
    paddingVertical: 1,
    paddingLeft: 12
  },
});

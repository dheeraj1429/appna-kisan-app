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
import navigationString from "../../Constants/navigationString";
import axios from "axios";
import { clearLocalStorage, setItemToLocalStorage } from "../../Utils/localstorage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { UseContextState } from "../../global/GlobalContext";
import imageImport from "../../Constants/imageImport";
import { FlatList } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons'; 

function UpdateProfile({ route, navigation }) {
  const [loading, setLoading] = useState(false)
  const { authState, fetchAuthuser, userData } = UseContextState();
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [nameq, setNameq] = useState('');

  const [apiResponse, setApiResponse] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const  userType = userData?.user?.type;
  console.log(userType,"usertype");
  useEffect(() => {
    if (userData && userData.accessToken) {
      setAccessToken(userData.accessToken);
    }
  }, [userData]);
  const handleImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setSelectedImage(result.uri);
        setIsImagePickerOpen(false); // Close the image picker after selecting an image
      }
    } catch (error) {
      console.log("Error picking image:", error);
      Alert.alert("try again later after some time");
    }
  };



  // console.log(authState,"authState")
  const [editUserDetails, setEditUserDetails] = useState({
    customer_id: authState?.user?.user_id,
    username: authState?.user?.username,
    customer_phone_number: `${authState?.user?.phone_number}`,
    email: '',
    customer_business: '',
    gst_number: '',
    products: [],
    address: '',
    state: '',
    pincode: '',
    transport_detail: ''
  })

  // useFocusEffect(
  //   useCallback(() => {
  //     axios.get(`${config.BACKEND_URI}/api/app/get/user/by/userid/${authState?.user?.user_id}`, { withCredentials: true })
  //       .then(res => {
  //         // console.log("RESPONSE=>",res?.data?.user);
  //         setEditUserDetails((prev) => ({
  //           ...prev,
  //           email: res?.data?.user?.email,
  //           gst_number: res?.data?.user?.gst_number,
  //           address: res?.data?.user?.address,
  //           state: res?.data?.user?.state,
  //           pincode: `${res?.data?.user?.pincode}`,
  //           transport_detail: `${res?.data?.user?.transport_detail}`,
  //         }))
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       })
  //   }, [])
  // )

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);

  //       // Make an API request
  //       const response = await axios.get(BASE_URL, "https://example.com/api/data");

  //       // Update state with the fetched data
  //       setData(response.data);

  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setError("Error fetching data. Please try again.");

  //       setLoading(false);
  //     }
  //   };

  //   // Call the fetch data function
  //   fetchData();
  // }, []); // The empty dependency array ensures the effect runs only once (on mount)

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       setLoading(true);

  //       // Make an API request to get user details
  //       const response = await axios.get(`https://whale-app-88bu8.ondigitalocean.app/api/user/get/user/info/${authState?.user?.user_id}`, { withCredentials: true });

  //       // Update the user details in the state
  //       setEditUserDetails((prev) => ({
  //         ...prev,
  //         email: response?.data?.user?.email,
  //         gst_number: response?.data?.user?.gst_number,
  //         address: response?.data?.user?.address,
  //         state: response?.data?.user?.state,
  //         pincode: `${response?.data?.user?.pincode}`,
  //         transport_detail: `${response?.data?.user?.transport_detail}`,
  //       }));

  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //       setLoading(false);
  //     }
  //   };

  //   // Call the fetchUserData function
  //   fetchUserData();
  // }, [authState?.user?.user_id]);


  const goBack = () => {
    navigation.goBack();
  };
  // console.log("checkout-> ",editUserDetails)

  const handleChange = (form, name) => {
    // setEditUserDetails(value => ({
    //     ...value,
    //     [name]: form
    //   }))
    if (name == 'username') {
      setEditUserDetails(value => ({
        ...value,
        username: form.replace(/[^a-zA-Z ]/g, '')
      }))
    }
    if (name == 'customer_phone_number') {
      setEditUserDetails(value => ({
        ...value,
        customer_phone_number: form.replace(/[^0-9]/g, '')
      }))
    }
    if (name == 'pincode') {
      setEditUserDetails(value => ({
        ...value,
        pincode: form.replace(/[^0-9]/g, '')
      }))
    }
    if (name == 'email') {
      setEditUserDetails(value => ({
        ...value,
        email: form
      }))
    }
    if (name == 'gst_number') {
      setEditUserDetails(value => ({
        ...value,
        gst_number: form
      }))
    }
    if (name == 'address') {
      setEditUserDetails(value => ({
        ...value,
        address: form
      }))
    }
    if (name == 'state') {
      setEditUserDetails(value => ({
        ...value,
        state: form
      }))
    }
    if (name == 'transport_detail') {
      setEditUserDetails(value => ({
        ...value,
        transport_detail: form
      }))
    }

  }


  //   handle check out 
  const handleEditUser = async (userid) => {
    setLoading(true)
    await axios.patch(`${config.BACKEND_URI}/api/app/edit/user/profile/${userid}`, editUserDetails, { withCredentials: true })
      .then(res => {
        // console.log(res?.data);
        if (res?.data?.status === true) {
          setItemToLocalStorage('user', res?.data?.user);
          fetchAuthuser()
          navigation.navigate(navigationString.ACCOUNT)
          setLoading(false)
          setEditUserDetails({
            username: '',
            customer_phone_number: '',
            email: '',
            gst_number: '',
            address: '',
            state: '',
            pincode: '',
            transport_detail: ''
          })
        }
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })

  }


  const onClickState = (selectedState) => {
    setModalVisible(false)
    console.log(selectedState)
    setEditUserDetails((prev => ({ ...prev, state: selectedState })))
    // setSelectedFilter(selectedState)
  }


  const renderSelectedState = useCallback(({ item, index }) => {
    // console.log("item",item)
    return (
      <TouchableOpacity
        onPress={() => onClickState(item)}
        activeOpacity={0.4}
        style={{
          borderWidth: 0.6,
          borderColor: '#f2f2f2',
          paddingVertical: 7,
          paddingHorizontal: 13,
          borderRadius: 6,
          marginVertical: 3,
          marginHorizontal: 5,
          textTransform: 'capitalize',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Text style={{
          fontSize: 14,
          fontWeight: '500',
          color: '#999',
          letterSpacing: 1.2,
          textTransform: 'capitalize',
        }}>

          {item}
        </Text>
        <MaterialIcons name="radio-button-on" size={16} color={editUserDetails?.state == item ? config.primaryColor : '#999'} />

      </TouchableOpacity>
    )
  }, [editUserDetails?.state])
  // const userInfo = async () => {
  //   try {
  //     const response = await fetch('https://whale-app-88bu8.ondigitalocean.app/api/user/get/user/info', {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTY4NDg2YWI4YzYyYjFjNDc5YzllMmUiLCJuYW1lIjoiVmluYXkiLCJ1c2VyVHlwZSI6IkIyQyIsImlhdCI6MTcwMTMzMzA5OH0.DyM6Cv_VHo2gfh8bDAw5ZtowWv7M2YSRBItLd5qoGCI',
  //       },
  //       body: JSON.stringify({
  //         mobile: "8462971629",
  //         password: "Vinay@1234",
  //         userType: "B2C"
  //     }),
  //     });

  //     console.log('Response status:', response.status);

  //     if (response.ok) {
  //       const data = await response.json();

  //       if (data && data.success) {
  //         return data;
  //       } else {
  //         console.log('API returned an error:', data ? data.error : 'No data received');
  //       }
  //     } else {
  //       console.log('UserInfo HTTP request failed with status:', response.status);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching Details:', error.message);
  //   }
  // };
  const userInfo = async () => {
    console.log(accessToken,"access");

    try {
      const response = await fetch('https://whale-app-88bu8.ondigitalocean.app/api/user/get/user/info', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken,
          'x-user-type': userType,
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
    console.log(accessToken);
    if(accessToken) { //code
      const fetchList = async () => {
        try {
          const response = await userInfo();
          setApiResponse(response);
          console.log("UserInfo", response);
          return response; // Add this line if you want to return the response
        } catch (error) {
          Alert.alert('Error fetching UserInfo:', error);
        }
      }; 
    
      fetchList();
    }
   

  }, [accessToken]);

  const UpdateProfile = async () => {
    try {
      const profileData = {
        name: nameq,
      }
      if(password) {profileData.password = password}
      if (selectedImage) {
        profileData.profile = {
          path: "some_path",
          image_url: selectedImage || null,
          image_name: "some_name",
        }
      }
      const response = await axios.patch(`https://whale-app-88bu8.ondigitalocean.app/api/user/update/info`, profileData,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken,
          'x-user-type': userType,
        },
      });
      console.log("response of profile", response.data);
      //const dt = await response.json();
      //console.log("response of profile", dt,response);

      if (response.data.statusCode === 200) {
        //const data = await response.json();
        // Extract relevant information for the alert
        // Display alert with extracted information
        //console.log("response.data", data);
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Success',
          text2: response.data.message,
          visibilityTime: 4000, // 4 seconds
          autoHide: true,
        });
        //Alert.alert('Profile Updated', alertMessage);
      } else {
        console.log('Failed to update profile try again later:', response);
      }
    } catch (error) {
      //console.log('Error Failed to update profile try again later:', error.message);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: error.response.data.message,
        visibilityTime: 4000, // 4 seconds
        autoHide: true,
      });
    }
  };

  return (
    <Provider>
      <Portal>
        <View style={styles.screenContainer}>
          <StatusBar backgroundColor="#fff" />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingTop: 50, paddingBottom: 10 }} >
            <MaterialIcons onPress={goBack} name="keyboard-arrow-left" size={27} color={config.primaryColor} />
            <Text style={styles.headingText} >Update Profile</Text>
            <MaterialIcons name="keyboard-arrow-left" size={27} color='white' />
          </View>
          {loading ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:config.secondry}} >
              <ActivityIndicator size='large' color={config.primaryColor} />
            </View>
            :

          <View style={styles.commonFieldMainBox} >
            <View style={{
              marginTop: 15,
              // backgroundColor: "red",
              width: "65%",
              height: "27%",
              justifyContent: "center",
              alignSelf: "center",
              alignItems: "center",
              marginVertical: "5%",
              borderRadius: 270
            }}>

              {/* <ImageBackground
                source={require('../../assets/personimage.jpeg')}
                resizeMode="cover"
                style={{
                  width: "100%",
                  height: "100%",
                  borderColor: "white",
                  borderWidth: 2,
                  borderRadius: 270,
                  overflow: "hidden" // Ensure the content is clipped to the rounded border
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Button Pressed',
                      'You pressed the Camera!',
                      [
                        { text: 'OK', onPress: () => console.log('OK Pressed') }
                      ],
                      { cancelable: false }
                    );
                  }}
                >
                  <MaterialCommunityIcons
                    // style={{
                    //   position: "absolute",
                    //   top: "50%",
                    //   left: "50%",
                    //   //transform: [{ translateX: -14, translateY: -14 }], // Adjust based on icon size
                    //   //zIndex: 1,
                    //   opacity: 0.5 // Set the opacity to 0.5
                    // }}
                    style={{
                      position: "absolute",
                      top: 90,
                      left: "50%",
                      transform: [{ translateX: -10 }],
                      zIndex: 1,
                      opacity: 0.6
                    }}
                    name="camera"
                    size={28}
                    color={"white"}
                  />
                </TouchableOpacity>
              </ImageBackground> */}

              <ImageBackground
                source={selectedImage ? { uri: selectedImage } : require('../../assets/personimage.jpeg') }
                resizeMode="cover"
                style={{
                  width: "100%",
                  height: "100%",
                  borderColor: "white",
                  borderWidth: 2,
                  borderRadius: 270,
                  overflow: "hidden"
                }}
              >
                {!isImagePickerOpen && (
                  <TouchableOpacity onPress={() => handleImagePicker()}>
                    <MaterialCommunityIcons
                      style={{
                        position: "absolute",
                        top: 90,
                        left: "50%",
                        transform: [{ translateX: -10 }],
                        zIndex: 1,
                        opacity: 0.6
                      }}
                      name="camera"
                      size={30}
                      color={"black"}
                    />
                  </TouchableOpacity>
                )}
              </ImageBackground>


            </View>


            <View style={{ ...styles.commonFieldContainer, marginTop: -10 }} >
              <TextInput onChangeText={value => setNameq(value)} value={nameq} keyboardType={'default'} style={styles.commonField} placeholder='Full Name' />
              <MaterialCommunityIcons style={styles.commonIcon} name="account" size={20} />
            </View>

            {/* <View style={styles.commonFieldContainer} >
              <TextInput onChangeText={value => handleChange(value, 'email')} value={editUserDetails?.email} textContentType='emailAddress' style={{ ...styles.commonField, paddingRight: 16, textTransform: 'lowercase' }} placeholder='Email Address ' />
              <MaterialIcons style={styles.commonIcon} name="email" size={20} />
            </View> */}
            <View style={styles.commonFieldContainer}>
              <TextInput
                style={styles.commonField}
                onChangeText={(value) => setPassword(value.replace(/[^a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/g, ''))}
                secureTextEntry={true} // This hides the entered text for a password field
                maxLength={20} // Adjust the maximum length as needed
                placeholder='Password'
                value={password}

              />
              <FontAwesome5 style={{ ...styles.commonIcon, bottom: 15 }} name="lock" size={15} />
            </View>

            {/* address ,state, pincode */}
            <TouchableOpacity onPress={() => {
              UpdateProfile();
            }} activeOpacity={0.8} style={styles.checkoutBtn}>
              <Text style={styles.checkouttext}>Update Profile </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => {
      Alert.alert('Profile updated', ``);
    }}>
      <View style={styles.orderButton}>
        <Text style={styles.orderButtonText}>Redeem Product</Text>
      </View>
    </TouchableOpacity> */}

          </View>

    

  }

        </View>
        {/* <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.containerStyle}>
          <View>
            <View style={{ borderBottomWidth: 1, borderColor: '#f2f2f2', paddingTop: 6, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, letterSpacing: 1.4, fontWeight: '500', color: config.primaryColor, paddingLeft: 13 }}>Select State</Text>
              <MaterialIcons style={{ paddingRight: 9 }} onPress={() => setModalVisible(false)} name="close" size={22} color={config.primaryColor} />
            </View>
            <View style={{ borderWidth: 1, borderColor: '#f2f2f2', marginTop: 12, marginHorizontal: 10, borderRadius: 10 }} >
              <FlatList
                style={{ height: 300 }}
                data={statelist?.STATE}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                renderItem={renderSelectedState}
                keyExtractor={(item) => item}
              //   ItemSeparatorComponent={() => {
              //     return (
              //         <View
              //             style={{
              //                 height: "100%",

              //             }} />
              //     );
              // }}
              />
            </View>
          </View>
        </Modal> */}

      </Portal>
    </Provider>


  );
}

export default UpdateProfile;

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
  phoneFieldContainer: {
    position: 'relative',
    width: '100%'
  },
  indiaIcon: {
    position: 'absolute',
    bottom: 15.5,
    left: 15
  },
  nineOneText: {
    fontSize: 14,
    color: 'gray',

  },
  phoneField: {
    width: '100%',
    marginTop: 15,
    paddingHorizontal: 79,
    paddingVertical: 14,
    fontSize: 14,
    backgroundColor: '#f5f5f6',
    letterSpacing: 1.5,
    borderRadius: 16,
    borderWidth: 0.5,
    color: 'gray',
    borderColor: 'lightgray'

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
    textTransform: 'capitalize',
    backgroundColor: '#f5f5f6',
    letterSpacing: 1.5,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'lightgray'
  },
  commonFieldForState: {
    width: '100%',
    marginTop: 15,
    paddingLeft: 45,
    paddingRight: 14,
    paddingVertical: 13,
    fontSize: 14,
    textTransform: 'capitalize',
    backgroundColor: '#f5f5f6',
    letterSpacing: 1.5,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'lightgray'
  },
  commonIcon: {
    position: 'absolute',
    bottom: 12,
    left: 15,
    color: '#555'
  },

  checkouttext: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: 'white'
  },
  checkoutBtn: {
    width: "100%",
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 10,
    backgroundColor: config.primaryColor,
    borderRadius: 16,
    shadowColor: config.primaryColor,
    shadowOffset: { width: 10, height: 0 },
    shadowOpacity: 0.49,
    shadowRadius: 10,
    elevation: 5,
  }, containerStyle: {
    backgroundColor: 'white',
    paddingTop: 9,
    paddingBottom: 12,
    marginHorizontal: 60,
    borderRadius: 10,
    zIndex: 2
  }
});

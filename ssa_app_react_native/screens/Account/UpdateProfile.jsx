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


function UpdateProfile({ route, navigation }) {
  const [loading, setLoading] = useState(false)
  const { authState, fetchAuthuser } = UseContextState();
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Make an API request
        const response = await axios.get(BASE_URL,"https://example.com/api/data");

        // Update state with the fetched data
        setData(response.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data. Please try again.");

        setLoading(false);
      }
    };

    // Call the fetch data function
    fetchData();
  }, []); // The empty dependency array ensures the effect runs only once (on mount)


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



  return (
    <Provider>
      <Portal>
        <View style={styles.screenContainer}>
          <StatusBar backgroundColor="#fff" />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingTop: 50, paddingBottom: 10 }} >
            <MaterialIcons onPress={goBack} name="keyboard-arrow-left" size={27} color={config.primaryColor} />
            <Text style={styles.headingText} >Edit Profile</Text>
            <MaterialIcons name="keyboard-arrow-left" size={27} color='white' />
          </View>

          {loading && <View style={{ justifyContent: 'center', alignItems: 'center' }} >
            <ActivityIndicator color={config.primaryColor} size='large' />
          </View>
          }

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

              <ImageBackground source={require('../../assets/personimage.jpeg')} resizeMode="cover" style={{
                width: "100%",
                height: "100%",
                borderColor: "white",
                borderWidth: 2,
                borderRadius: 270,
                overflow: "hidden" // Ensure the content is clipped to the rounded border
              }}>
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
                  <MaterialCommunityIcons style={{ position: "absolute", top: 28, left: "75%", transform: [{ translateX: -10 }], zIndex: 1 }} name="camera" size={28} color={"white"} />
                </TouchableOpacity>
              </ImageBackground>

            </View>


            <View style={{ ...styles.commonFieldContainer, marginTop: -10 }} >
              <TextInput onChangeText={value => handleChange(value, 'username')} value={editUserDetails?.username} keyboardType={'default'} style={styles.commonField} placeholder='Full Name' />
              <MaterialCommunityIcons style={styles.commonIcon} name="account" size={20} />
            </View>

            <View style={styles.commonFieldContainer} >
              <TextInput onChangeText={value => handleChange(value, 'email')} value={editUserDetails?.email} textContentType='emailAddress' style={{ ...styles.commonField, paddingRight: 16, textTransform: 'lowercase' }} placeholder='Email Address ' />
              <MaterialIcons style={styles.commonIcon} name="email" size={20} />
            </View>
            <View style={styles.commonFieldContainer}>
              <TextInput
                style={styles.commonField}
                onChangeText={(value) => setPassword(value.replace(/[^a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/g, ''))}
                secureTextEntry={true} // This hides the entered text for a password field
                maxLength={20} // Adjust the maximum length as needed
                placeholder='Password'
              />
              <FontAwesome5 style={{ ...styles.commonIcon, bottom: 15 }} name="lock" size={15} />
            </View>

            {/* address ,state, pincode */}
            <TouchableOpacity onPress={() => handleEditUser(authState?.user?._id)} activeOpacity={0.8} style={styles.checkoutBtn}>
              <Text style={styles.checkouttext}>Update Profile </Text>
            </TouchableOpacity>

          </View>

          {/* for extra spacing */}
          {/* <View style={{ paddingBottom: 20 }} ></View> */}
          {/* for extra spacing */}



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

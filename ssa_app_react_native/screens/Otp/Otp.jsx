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
  Button,
  ToastAndroid,
} from "react-native";
import auth from '@react-native-firebase/auth';
import { firebase } from "@react-native-firebase/auth";
import { config } from "../../config";
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";
import navigationString from "../../Constants/navigationString";
import axios from "axios";
import { clearLocalStorage, setItemToLocalStorage } from "../../Utils/localstorage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { UseContextState } from "../../global/GlobalContext";
import Toast from 'react-native-toast-message';

function Otp({ route, navigation }) {
  // const {user_name,user_exists} = route.params;
  const { phoneNumber, user_name,user_exists } = route.params;
  const modifiedPhoneNumber = phoneNumber.substring(2);
  const [loading, setLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [autoverifyingLoading, setAutoverifyingLoading] = useState(false);
  const [resend, setResend] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [otp, setOtp] = useState('');
  const [code, setCode] = useState('');
  const [existingUser, setExistingUser] = useState();
  const [getUserID, setGetUserID] = useState('')
  const [userId, setUserId] = useState('');
  const [timer, setTimer] = useState(25);
  const { authState, fetchAuthuser } = UseContextState();
  // let phoneNumber = '919800980098'
  const goBack = () => {
    navigation.goBack();
  };

  function showAutoVerifyingScreen() {
    setAutoverifyingLoading(true)
    setTimeout(() => {
      setAutoverifyingLoading(false)

    }, 25000)
  }

  useEffect(() => {
    showAutoVerifyingScreen()
  }, [])


  useEffect(() => {
    let interval = setInterval(() => {
      setTimer(lastTimerCount => {
        lastTimerCount <= 1 && clearInterval(interval)
        return lastTimerCount - 1
      })
    }, 1000) //each count lasts for a second
    //cleanup the interval on complete
    return () => { clearInterval(interval); setTimer(30) }
  }, []);


  useEffect(() => {
    // signInWithPhoneNumber(phoneNumber);
    signInWithPhoneNumberCustom(phoneNumber);
    setResend(false)


  }, [phoneNumber, resend])

  const logOutFirebase = () => {
    firebase.auth().signOut();
  }

  function onAuthStateChanged(user) {
    if (user) {
      setExistingUser(user)
      logOutFirebase()

      console.log("USERRRRRRR--", user)
      // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
      // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
      // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
      // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
      console.log("AUTO VERIFIED CALLED")
      // auto verified means the code has also been automatically confirmed as correct/received
      // phoneAuthSnapshot.code will contain the auto verified sms code - no need to ask the user for input.
      setVerifyOtpLoading(true)
      // console.log(phoneAuthSnapshot);
      // const { verificationId, code } = phoneAuthSnapshot;
      // const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
      setCode(code)
      // Example usage if handling here and not in optionalCompleteCb:
      console.log('auto verified on android');
      // console.log("AUTO_VERIFIED-credential",credential)
      if (user_exists) {
        console.log("LOGIN CALLED");
        navigation.navigate(navigationString.RESET_PASS, { phone: modifiedPhoneNumber });
        console.log("navigate to reset page");
       // loginUser();
        setVerifyOtpLoading(false)
        return;
      }
      if (!user_exists) {
        console.log("SIGN UP CALLED")
       // registerUser();
        setVerifyOtpLoading(false)
        return;
      }

    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Handle the button press
  async function signInWithPhoneNumberCustom(phoneNumber) {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    console.log("CONFIRMATION++++++++", confirmation)
    setConfirm(confirmation);
  }



  const resendOtp = async () => {
    console.log("Resend otp")
    setCode('')
    setLoading(true)
    setInterval(() => {
      setLoading(false)
    }, 3000)
    setResend(prev => !prev)
  }

  // manually verify
  const verifyManuallyOtp = async () => {
    const confirmation = await firebase.auth().signInWithPhoneNumber(phoneNumber);
    setConfirm(confirmation);
    console.log(confirmation, "CONFIRMATION")
  }

  const confirmCode = async () => {
    setVerifyOtpLoading(true)
    if (code?.length < 6) {
      ToastAndroid.showWithGravityAndOffset(
        "Enter a Valid Otp !!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }
    console.log("VERIFIED SUCCESS+>", otp, code)

    try {
      console.log("CODE+>", code)
      await confirm.confirm(code);
     // navigation.navigate(navigationString.RESET_PASS);
      setVerifyOtpLoading(false)
    //  if (user_exists) {
    //     console.log("LOGIN CALLED")
    //    //await loginUser();
    //     setVerifyOtpLoading(false)
    //     return;
    //   }
    //   if (!user_exists) {
    //     console.log("SIGN UP CALLED")
    //     //await registerUser();
    //     setVerifyOtpLoading(false)
    //     return;
    //   }

    } catch (error) {
      console.log(error)
      setVerifyOtpLoading(false)
      alert('Invalid code.');
    }
  }


  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Login Successfully ✅',
      // text2: 'This is some something 👋'
    });
  }


  // LOGIN USER FUNC  
  const loginUser = async () => {
    await axios.get(`${config.BACKEND_URI}/api/app/login/user/${phoneNumber}`, { withCredentials: true })
      .then(res => {
        console.log(res?.data);
        if (res?.data?.status) {
          setItemToLocalStorage('user', res?.data?.user);
          setUserId('')
          fetchAuthuser();
          showToast()
           navigation.navigate(navigationString.RESET_PASS);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  // REGISTER USER FUCNC
  const registerUser = async () => {
    let data = {
      username: user_name,
      phone_number: phoneNumber,
    }
    await axios.post(`${config.BACKEND_URI}/api/app/create/user`, data, { withCredentials: true })
      .then(res => {
        console.log(res?.data);
        if (res?.data?.status) {
          setItemToLocalStorage('user', res?.data?.user);
          setUserId('')
          fetchAuthuser()
          showToast()
          // setVerifyOtpLoading(false)
          // navigation.navigate(navigationString.HOME);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }



  return (
    <View style={styles.screenContainer}>
      {loading && <View style={{ position: 'absolute', top: '0%', bottom: '0%', left: '0%', right: '0%', zIndex: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(52, 52, 52, 0.3)', padding: 14, borderRadius: 8 }} >
        <View style={{ paddingTop: 190 }} >
          <ActivityIndicator color={config.primaryColor} size='large' />
          <Text  >Resending otp...</Text>
        </View>
      </View>
      }

      {verifyOtpLoading && <View style={{ position: 'absolute', top: '0%', bottom: '0%', left: '0%', right: '0%', zIndex: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(52, 52, 52, 0.3)', padding: 14, borderRadius: 8 }} >
        <View style={{ paddingTop: 190 }} >
          <ActivityIndicator color={config.primaryColor} size='large' />
          <Text  >Verifying otp...</Text>
        </View>
      </View>
      }
      <StatusBar backgroundColor="#fff" />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingTop: 50, paddingBottom: 10 }} >
        <MaterialIcons onPress={goBack} name="keyboard-arrow-left" size={27} color={config.primaryColor} />
        <Text style={styles.headingText} >Verify</Text>
        <MaterialIcons name="keyboard-arrow-left" size={27} color='white' />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 20, paddingTop: 40 }} >
          <Text style={styles.codeText} >Code has been send to {phoneNumber}</Text>

          {autoverifyingLoading ?
            <View>
              <View style={styles.commonFieldContainer} >
                <TextInput
                  value={code} onChangeText={text => setCode(text.replace(/[^0-9]/g, ''))}
                  maxLength={6}
                  keyboardType='number-pad'
                  style={styles.commonField} placeholder='Detecting Your Otp*' />
                <MaterialIcons style={styles.commonIcon} name="lock" size={20} />
              </View>
              <View style={{ paddingTop: 12 }} >
                <ActivityIndicator color={config.primaryColor} size='large' />
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 12, }} >
                  <Text style={{ color: config.primaryColor, fontSize: 16, paddingRight: 3 }} >{timer}</Text>
                  <Text style={{ color: 'gray', textAlign: 'center', fontSize: 16 }} >Auto Detecting otp...</Text>
                </View>
              </View>
              {/* <TouchableOpacity activeOpacity={0.8} style={{...styles.signUpBtn,backgroundColor:'lightgray'}}>
            <Text style={{...styles.signInText,color:'gray'}}>Verify and Sign In </Text>
          </TouchableOpacity> */}
            </View>
            :

            <View>
              <View style={styles.commonFieldContainer} >
                <TextInput
                  value={code} onChangeText={text => setCode(text.replace(/[^0-9]/g, ''))}
                  autoFocus
                  maxLength={6}
                  keyboardType='number-pad'
                  style={styles.commonField} placeholder='Enter Your Otp*' />
                <MaterialIcons style={styles.commonIcon} name="lock" size={20} />
              </View>
              <View style={styles.otpResend}>
                <Text style={{ color: "gray" }}>Can't received? </Text>
                <Text onPress={resendOtp} style={{ color: config.primaryColor, fontWeight: "600" }}>
                  Resend OTP
                </Text>
              </View>
              <TouchableOpacity onPress={() => confirmCode()} activeOpacity={0.8} style={styles.signUpBtn}>
                <Text style={styles.signInText}>Verify and Sign In </Text>
              </TouchableOpacity>
            </View>
          }
        </View>
        {/* for extra spacing */}
        <View style={{ paddingBottom: 20 }} ></View>
        {/* for extra spacing */}
      </ScrollView>
    </View>





  )
}

export default Otp

const styles = StyleSheet.create({
  signUpBtn: {
    width: "100%",
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: config.primaryColor,
    borderRadius: 16,
    shadowColor: config.primaryColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 90,
    elevation: 9,
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
    // textTransform:'capitalize',
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

  signInText: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 1,
    color: "white",
  },
  codeText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
    color: 'gray',
    textAlign: 'center',
    paddingVertical: 30
  },
  otpField: {
    width: 50,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "lightgray",
    marginHorizontal: 5,
    backgroundColor: "#f5f5f6",
    paddingVertical: 10,
    textAlign: "center",
  },
  otpFieldInput: {
    width: 100,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "lightgray",
    marginHorizontal: 5,
    backgroundColor: "#f5f5f6",
    paddingVertical: 10,
    textAlign: "center",
  },
  otpResend: {
    flexDirection: 'row',
    marginVertical: 26,
    alignItems: 'center',
    justifyContent: 'center'

  },
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
    paddingHorizontal: 20,
  },
  phoneFieldContainer: {
    position: 'relative',
    width: '100%'
  },
  indiaIcon: {
    position: 'absolute',
    bottom: 14,
    left: 15
  },
  nineOneText: {
    fontSize: 14,

  },
  phoneField: {
    width: '100%',
    marginTop: 15,
    paddingHorizontal: 79,
    paddingVertical: 9,
    fontSize: 14,
    backgroundColor: '#f5f5f6',
    letterSpacing: 1.5,
    borderRadius: 16,
    borderWidth: 0.5,
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
    // textTransform:'capitalize',
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.49,
    shadowRadius: 10,
    elevation: 9,

  }
})




// import React, { useState, useRef } from 'react';
// import { View, Text, TextInput, Pressable } from 'react-native';
// import axios from 'axios';
// import Toast from 'react-native-toast-message';
// import { config } from '../../config';

// const Otp = ({ navigation,route }) => {
//     const [otp, setOtp] = useState(['', '', '', '', '', '']);
//     const otpInputs = Array.from({ length: 6 }, () => useRef(null));
//     const { phoneNumber } = route.params;

//     const handleResendOtp = () => {
//         axios.post(`https://whale-app-88bu8.ondigitalocean.app/api/`, {
//             phoneNumber: phoneNumber,
//         }, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         })
//         .then(response => {
//             console.log("response", response);
//             if (response.status === 201) {
//                 Toast.show({
//                     type: 'success',
//                     position: 'top',
//                     text1: 'Success',
//                     text2: response.data.message,
//                     visibilityTime: 4000, // 4 seconds
//                     autoHide: true,
//                 });
//             } else {
//                 console.log('Failed to send otp:', response.status);
//             }
//         })
//         .catch(error => {
//             console.log('Error sending otp:', error.message);
//             Toast.show({
//                 type: 'error',
//                 position: 'top',
//                 text1: 'API Error',
//                 text2: error.response?.data?.message || 'Unknown error',
//                 visibilityTime: 4000, // 4 seconds
//                 autoHide: true,
//             });
//         });
//     };
    

//     const handleVerifyOtp = async () => {
//         const enteredOtp = otp.join('');
    
//         axios.post(
//             'https://whale-app-88bu8.ondigitalocean.app/api',
//             { otp: enteredOtp },
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': 'Bearer ' + accessToken,
//                     'x-user-type': userType,
//                 }
//             }
//         )
//         .then(res => {
//             // Handle success
//             console.log(res,"response");
//             navigation.navigate(navigationString.TAB_ROUTE);
//         })
//         .catch(err => {
//             // Handle error
//             Toast.show({
//                 type: 'error',
//                 position: 'top',
//                 text1: 'API Error',
//                 text2: err.response?.data?.message || 'Unknown error',
//                 visibilityTime: 4000, // 4 seconds
//                 autoHide: true,
//             });
//         });
//     };
    

//     return (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//             <Text style={{ fontSize: 20, marginBottom: 20, color: config.primaryColor, fontWeight: "600" }}>Enter OTP that is send to {phoneNumber}</Text>
//             <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 300 }}>
//                 {otp.map((digit, index) => (
//                     <TextInput
//                         key={index}
//                         ref={otpInputs[index]}
//                         style={{
//                             borderWidth: 1,
//                             borderColor: 'black',
//                             width: 40,
//                             height: 40,
//                             textAlign: 'center',
//                             borderRadius:15
//                         }}
//                         value={digit}
//                         onChangeText={(text) => {
//                             const newOtp = [...otp];
//                             newOtp[index] = text;
//                             setOtp(newOtp);

//                             // Move to the next input field if text is entered
//                             if (text.length === 1 && index < 5) {
//                                 otpInputs[index + 1].current.focus();
//                             }
//                         }}
//                         keyboardType="numeric"
//                         maxLength={1}
//                     />
//                 ))}
//             </View>
//             <Pressable
//                 style={{ marginTop: 20 }}
//                 onPress={handleVerifyOtp}
//             >
//                 <Text style={{ fontSize: 16, color: config.primaryColor, fontWeight: "600" }}>Verify OTP</Text>
//             </Pressable>
//             <Pressable
//                 style={{ marginTop: 10 }}
//                 onPress={handleResendOtp}
//             >
//                 <Text style={{ fontSize: 16, color: config.primaryColor, fontWeight: "600" }}>Resend OTP</Text>
//             </Pressable>
//         </View>
//     );
// };

// export default Otp;




// // import React, { useState, useRef } from 'react';
// // import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Modal, Pressable } from 'react-native';
// // import { Entypo } from '@expo/vector-icons';
// // import { FontAwesome } from '@expo/vector-icons';

// // const Otp = (props) => {
// //     const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
// //     const [modalVisible, setModalVisible] = useState(false);
// //     const pinInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

// //     const handleSubmit = () => {
// //         const enteredPin = confirmPin.join('');
// //         // Check if enteredPin matches the expected PIN or handle as needed
// //         console.log(enteredPin);
// //     };

// //     const handlePinChange = (text, index) => {
// //         const numericRegex = /^[0-9]*$/; // Only allow numeric input
// //         if (numericRegex.test(text)) {
// //             const newConfirmPin = [...confirmPin];
// //             newConfirmPin[index] = text;
// //             setConfirmPin(newConfirmPin);

// //             // Focus on the next input field if available
// //             if (index < 3 && pinInputRefs[index + 1].current) {
// //                 pinInputRefs[index + 1].current.focus();
// //             }

// //         }
// //     };

// //     // const renderDialPadButton = (label) => {
// //     //     let iconComponent;

// //     //     if (label === 'X') {
// //     //         iconComponent = (
// //     //             <Icon
// //     //                 name="cross"
// //     //                 size={35}
// //     //                 color={theme.colors.sell}
// //     //             />
// //     //         );
// //     //     } else if (label === 'Y') {
// //     //         // Use a different icon (e.g., FontAwesomeIcon)
// //     //         iconComponent = (
// //     //             <FontAwesomeIcon
// //     //                 name="power-off"
// //     //                 size={30}
// //     //                 color="#FA8132"
// //     //             />
// //     //         );
// //     //     } else {
// //     //         iconComponent = (
// //     //             <Text style={styles.dialPadButtonText}>{label}</Text>
// //     //         );
// //     //     }

// //     //     return (
// //     //         <TouchableOpacity
// //     //             key={label}
// //     //             style={styles.dialPadButton}
// //     //             onPress={() => {
// //     //                 if (label === 'X') {
// //     //                     // Handle delete button press
// //     //                     const newConfirmPin = [...confirmPin];
// //     //                     const lastIndex = newConfirmPin.findIndex((value) => value !== '');
// //     //                     if (lastIndex >= 0) {
// //     //                         newConfirmPin[lastIndex] = '';
// //     //                         setConfirmPin(newConfirmPin);
// //     //                         if (pinInputRefs[lastIndex].current) {
// //     //                             pinInputRefs[lastIndex].current.focus();
// //     //                         }
// //     //                     }
// //     //                 } else if (label === 'Y') {
// //     //                     // Handle Y button press (Open modal)
// //     //                     setModalVisible(true);
// //     //                 } else {
// //     //                     // Handle numeric button press
// //     //                     const emptyIndex = confirmPin.findIndex((value) => value === '');
// //     //                     if (emptyIndex >= 0) {
// //     //                         handlePinChange(label, emptyIndex);
// //     //                     }
// //     //                 }
// //     //             }}
// //     //         >
// //     //             {iconComponent}
// //     //         </TouchableOpacity>
// //     //     );
// //     // };
// //     const renderDialPadButton = (label) => {
// //         let iconComponent;

// //         switch (label) {
// //             case 'X':
// //                 iconComponent = (
// //                     <Entypo
// //                         name="cross"
// //                         size={35}
// //                         color='red'
// //                     />
// //                 );
// //                 break;
// //             case 'Y':
// //                 // Use a different icon (e.g., FontAwesomeIcon)
// //                 iconComponent = (
// //                     <FontAwesome
// //                         name="power-off"
// //                         size={30}
// //                         color="#FA8132"
// //                     />
// //                 );
// //                 break;
// //             default:
// //                 iconComponent = (
// //                     <Text style={styles.dialPadButtonText}>{label}</Text>
// //                 );
// //                 break;
// //         }

// //         return (
// //             <TouchableOpacity
// //                 key={label}
// //                 style={styles.dialPadButton}
// //                 onPress={() => {
// //                     switch (label) {
// //                         case 'X':
// //                             // Handle delete button press
// //                             const newConfirmPin = [...confirmPin];
// //                             const lastIndex = newConfirmPin.findIndex((value) => value !== '');
// //                             if (lastIndex >= 0) {
// //                                 newConfirmPin[lastIndex] = '';
// //                                 setConfirmPin(newConfirmPin);
// //                                 if (pinInputRefs[lastIndex].current) {
// //                                     pinInputRefs[lastIndex].current.focus();
// //                                 }
// //                             }
// //                             break;
// //                         case 'Y':
// //                             // Handle Y button press (Open modal)
// //                             //setModalVisible(true);
// //                             setModalVisible(false);
// //                             break;
// //                         default:
// //                             // Handle numeric button press
// //                             const emptyIndex = confirmPin.findIndex((value) => value === '');
// //                             if (emptyIndex >= 0) {
// //                                 handlePinChange(label, emptyIndex);
// //                             }
// //                             break;
// //                     }
// //                 }}
// //             >
// //                 {iconComponent}
// //             </TouchableOpacity>
// //         );
// //     };


// //     return (
// //         <View style={styles.container}>
// //             <View>
// //                 <View style={styles.header}>
// //                     <Icon
// //                         name="cross"
// //                         size={24}
// //                         color="black"
// //                         onPress={() => props.navigation.goBack()}
// //                     />
// //                     <Text style={styles.headerText}>Verify OTP</Text>
// //                 </View>
// //                 <View style={styles.pinContainer}>
// //                     {confirmPin.map((value, index) => (
// //                         <TextInput
// //                             key={index}
// //                             secureTextEntry
// //                             editable={false} // Set the keyboardType to 'visible-password'
// //                             maxLength={1}
// //                             value={value}
// //                             onChangeText={(text) => handlePinChange(text, index)}
// //                             style={styles.pinInput}
// //                             ref={pinInputRefs[index]}
// //                         />
// //                     ))}
// //                 </View>
// //                 <View style={styles.dialPad}>
// //                     <View style={styles.dialPadRow}>
// //                         {['1', '2', '3'].map((label) => renderDialPadButton(label))}
// //                     </View>
// //                     <View style={styles.dialPadRow}>
// //                         {['4', '5', '6'].map((label) => renderDialPadButton(label))}
// //                     </View>
// //                     <View style={styles.dialPadRow}>
// //                         {['7', '8', '9'].map((label) => renderDialPadButton(label))}
// //                     </View>
// //                     <View style={styles.dialPadRow}>
// //                         {['Y', '0', 'X'].map((label) => renderDialPadButton(label))}
// //                     </View>
// //                 </View>

// //             </View>
// //             <Modal
// //                 animationType="slide"
// //                 transparent={true}
// //                 visible={modalVisible}
// //                 onRequestClose={() => {
// //                     Alert.alert('Modal has been closed.');
// //                     setModalVisible(!modalVisible);
// //                 }}>
// //                 <View style={styles.centeredView}>
// //                     {/* <View style={styles.modalView}>
// //                         <Text style={styles.modalHeading}>Logging out</Text>
// //                         <Text style={styles.modalText}>Are you sure?</Text>

// //                         <View style={styles.container2}>
// //                             <Pressable
// //                                 onPress={() => setModalVisible(!modalVisible)}>
// //                                 <Text style={styles.textStyle}>CANCEL</Text>
// //                             </Pressable>
// //                             <Text>       </Text>
// //                             <Pressable
// //                                 onPress={() => setModalVisible(!modalVisible)}>
// //                                 <Text style={styles.textStyle}>LOG OUT</Text>
// //                             </Pressable>
// //                         </View>
// //                     </View> */}
// //                 </View>
// //             </Modal>
// //         </View>
// //     );
// // };

// // const styles = StyleSheet.create({
// //     container2: {
// //         flexDirection: "row",
// //         justifyContent: "flex-end",
// //     },
// //     container: {
// //         flex: 1,
// //         backgroundColor: "white",
// //     },
// //     header: {
// //         backgroundColor: "green",
// //         padding: "5%",
// //         elevation: 7,
// //         shadowColor: "gray",
// //         shadowOpacity: 0.2,
// //         shadowRadius: 3,
// //         flexDirection: "row",
// //         justifyContent: "flex-start",
// //         alignItems: "center"
// //     },
// //     headerText: {
// //         color: "gray",
// //         fontSize: 25,
// //         fontWeight: 'bold',
// //         marginLeft: '2%',
// //     },
// //     pinContainer: {
// //         flexDirection: 'row',
// //         justifyContent: 'center',
// //         margin: '10%',
// //     },
// //     pinInput: {
// //         width: 47,
// //         height: 54,
// //         marginRight: 10,
// //         color: 'black',
// //         fontSize: 32,
// //         textAlign: 'center',
// //         fontWeight: 'bold',
// //         //borderWidth: 1,
// //         //borderColor: 'gray',
// //         borderRadius: 12,
// //         backgroundColor: "cyan",
// //     },
// //     dialPad: {
// //         marginTop: '15%',
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //     },
// //     dialPadRow: {
// //         flexDirection: 'row',
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //     },
// //     dialPadButton: {
// //         width: 70,
// //         height: 70,
// //         borderRadius: 50,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         borderColor: "green",
// //         borderWidth: 1,
// //         margin: 5,
// //     },
// //     dialPadButtonText: {
// //         color: 'black',
// //         fontSize: 32,
// //     },
// //     centeredView: {
// //         flex: 1,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         marginTop: 22,
// //     },
// //     modalView: {
// //         margin: 20,
// //         backgroundColor: 'white',
// //         borderRadius: 5,
// //         padding: 35,
// //         //alignItems: 'center',
// //         shadowColor: "gray",
// //         shadowOffset: {
// //             width: 0,
// //             height: 2,
// //         },
// //         shadowOpacity: 0.25,
// //         shadowRadius: 4,
// //         elevation: 5,
// //     },
// //     textStyle: {
// //         color: "green",
// //         fontSize: 20,
// //     },
// //     modalText: {
// //         marginBottom: 30,
// //         textAlign: "left",
// //         color: "black",
// //         fontSize: 20,
// //     },
// //     modalHeading: {
// //         color: "black",
// //         fontSize: 22,
// //         textAlign: "left",
// //         fontWeight: "bold",
// //     },
// // });

// // export default Otp;





// // import React, { useState, useEffect } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   ScrollView,
// //   TextInput,
// //   ActivityIndicator,
// //   Image,
// //   Button,
// //   ToastAndroid,
// // } from "react-native";
// // import auth from '@react-native-firebase/auth';
// // import { firebase } from "@react-native-firebase/auth";
// // import { config } from "../../config";
// // import { MaterialIcons } from '@expo/vector-icons';
// // import { StatusBar } from "expo-status-bar";
// // import navigationString from "../../Constants/navigationString";
// // import axios from "axios";
// // import { clearLocalStorage, setItemToLocalStorage } from "../../Utils/localstorage";
// // import { useFocusEffect } from "@react-navigation/native";
// // import { useCallback } from "react";
// // import { UseContextState } from "../../global/GlobalContext";
// // import Toast from 'react-native-toast-message';

// // function Otp({ route, navigation }) {
// //   // const {user_name,user_exists} = route.params;
// //   const { phoneNumber, name, user_exists, email, password } = route.params;
// //   const [loading, setLoading] = useState(false);
// //   const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
// //   const [autoverifyingLoading, setAutoverifyingLoading] = useState(false);
// //   const [resend, setResend] = useState(false);
// //   const [confirm, setConfirm] = useState(null);
// //   const [otp, setOtp] = useState('');
// //   const [code, setCode] = useState('');
// //   const [existingUser, setExistingUser] = useState();
// //   const [getUserID, setGetUserID] = useState('')
// //   const [userId, setUserId] = useState('');
// //   const [timer, setTimer] = useState(25);
// //   const { authState, fetchAuthuser } = UseContextState();
// //   // let phoneNumber = '919800980098'
// //   const goBack = () => {
// //     navigation.goBack();
// //   };

// //   function showAutoVerifyingScreen() {
// //     setAutoverifyingLoading(true)
// //     setTimeout(() => {
// //       setAutoverifyingLoading(false)

// //     }, 25000)
// //   }

// //   useEffect(() => {
// //     showAutoVerifyingScreen()
// //   }, [])


// //   useEffect(() => {
// //     let interval = setInterval(() => {
// //       setTimer(lastTimerCount => {
// //         lastTimerCount <= 1 && clearInterval(interval)
// //         return lastTimerCount - 1
// //       })
// //     }, 1000) //each count lasts for a second
// //     //cleanup the interval on complete
// //     return () => { clearInterval(interval); setTimer(30) }
// //   }, []);


// //   useEffect(() => {
// //     // signInWithPhoneNumber(phoneNumber);
// //     signInWithPhoneNumberCustom(phoneNumber);
// //     setResend(false)


// //   }, [phoneNumber, resend])

// //   const logOutFirebase = () => {
// //     firebase.auth().signOut();
// //   }

// //   function onAuthStateChanged(user) {
// //     if (user) {
// //       setExistingUser(user)
// //       logOutFirebase()

// //       console.log("USERRRRRRR--", user)
// //       // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
// //       // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
// //       // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
// //       // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
// //       console.log("AUTO VERIFIED CALLED")
// //       // auto verified means the code has also been automatically confirmed as correct/received
// //       // phoneAuthSnapshot.code will contain the auto verified sms code - no need to ask the user for input.
// //       setVerifyOtpLoading(true)
// //       // console.log(phoneAuthSnapshot);
// //       // const { verificationId, code } = phoneAuthSnapshot;
// //       // const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
// //       setCode(code)
// //       // Example usage if handling here and not in optionalCompleteCb:
// //       console.log('auto verified on android');
// //       // console.log("AUTO_VERIFIED-credential",credential)
// //       if (user_exists) {
// //         console.log("LOGIN CALLED")
// //         loginUser();
// //         setVerifyOtpLoading(false)
// //         return;
// //       }
// //       if (!user_exists) {
// //         console.log("SIGN UP CALLED")
// //         registerUser();
// //         setVerifyOtpLoading(false)
// //         return;
// //       }

// //     }
// //   }

// //   useEffect(() => {
// //     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
// //     return subscriber; // unsubscribe on unmount
// //   }, []);

// //   // Handle the button press
// //   async function signInWithPhoneNumberCustom(phoneNumber) {
// //     const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
// //     console.log("CONFIRMATION++++++++", confirmation)
// //     setConfirm(confirmation);
// //   }



// //   const resendOtp = async () => {
// //     console.log("Resend otp")
// //     setCode('')
// //     setLoading(true)
// //     setInterval(() => {
// //       setLoading(false)
// //     }, 3000)
// //     setResend(prev => !prev)
// //   }

// //   // manually verify
// //   const verifyManuallyOtp = async () => {
// //     const confirmation = await firebase.auth().signInWithPhoneNumber(phoneNumber);
// //     setConfirm(confirmation);
// //     console.log(confirmation, "CONFIRMATION")
// //   }

// //   const confirmCode = async () => {
// //     setVerifyOtpLoading(true)
// //     if (code?.length < 6) {
// //       ToastAndroid.showWithGravityAndOffset(
// //         "Enter a Valid Otp !!",
// //         ToastAndroid.LONG,
// //         ToastAndroid.BOTTOM,
// //         25,
// //         50
// //       );
// //       return;
// //     }
// //     console.log("VERIFIED SUCCESS+>", otp, code)
// //     try {
// //       console.log("CODE+>", code)
// //       await confirm.confirm(code);
// //       if (user_exists) {
// //         console.log("LOGIN CALLED")
// //         await loginUser();
// //         setVerifyOtpLoading(false)
// //         return;
// //       }
// //       if (!user_exists) {
// //         console.log("SIGN UP CALLED")
// //         await registerUser();
// //         setVerifyOtpLoading(false)
// //         return;
// //       }

// //     } catch (error) {
// //       console.log(error)
// //       setVerifyOtpLoading(false)
// //       alert('Invalid code.');
// //     }
// //   }


// //   const showToast = () => {
// //     Toast.show({
// //       type: 'success',
// //       text1: 'Login Successfully ✅',
// //       // text2: 'This is some something 👋'
// //     });
// //   }


// //   // LOGIN USER FUNC  
// //   const loginUser = async () => {
// //     await axios.get(`${config.BACKEND_URI}/api/app/login/user/${phoneNumber}`, { withCredentials: true })
// //       .then(res => {
// //         console.log(res?.data);
// //         if (res?.data?.status) {
// //           setItemToLocalStorage('user', res?.data?.user);
// //           setUserId('')
// //           fetchAuthuser();
// //           showToast()
// //           //  navigation.navigate(navigationString.HOME);
// //         }
// //       })
// //       .catch(err => {
// //         console.log(err);
// //       })
// //   }

// //   // REGISTER USER FUCNC
// //   const registerUser = async () => {
// //     let data = {
// //       name: name,
// //       mobile: phoneNumber,
// //       email: email,
// //       password: password
// //     }
// //     await axios.get(`${config.BASE_URL}/app/create/user/b2c`, { withCredentials: true }).then(res => {
// //       console.log(res?.data);
// //       if (res?.data?.status) {
// //         setItemToLocalStorage('user', res?.data?.user);
// //         setUserId('')
// //         fetchAuthuser()
// //         showToast()
// //         // setVerifyOtpLoading(false)
// //         // navigation.navigate(navigationString.HOME);
// //       }
// //     })
// //       .catch(err => {
// //         console.log(err);
// //       })
// //   }



// //   return (
// //     <View style={styles.screenContainer}>
// //       {loading && <View style={{ position: 'absolute', top: '0%', bottom: '0%', left: '0%', right: '0%', zIndex: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(52, 52, 52, 0.3)', padding: 14, borderRadius: 8 }} >
// //         <View style={{ paddingTop: 190 }} >
// //           <ActivityIndicator color={config.primaryColor} size='large' />
// //           <Text  >Resending otp...</Text>
// //         </View>
// //       </View>
// //       }

// //       {verifyOtpLoading && <View style={{ position: 'absolute', top: '0%', bottom: '0%', left: '0%', right: '0%', zIndex: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(52, 52, 52, 0.3)', padding: 14, borderRadius: 8 }} >
// //         <View style={{ paddingTop: 190 }} >
// //           <ActivityIndicator color={config.primaryColor} size='large' />
// //           <Text  >Verifying otp...</Text>
// //         </View>
// //       </View>
// //       }
// //       <StatusBar backgroundColor="#fff" />

// //       <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingTop: 50, paddingBottom: 10 }} >
// //         <MaterialIcons onPress={goBack} name="keyboard-arrow-left" size={27} color={config.primaryColor} />
// //         <Text style={styles.headingText} >Verify</Text>
// //         <MaterialIcons name="keyboard-arrow-left" size={27} color='white' />
// //       </View>
// //       <ScrollView showsVerticalScrollIndicator={false}
// //       >
// //         <View style={{ paddingHorizontal: 20, paddingTop: 40 }} >
// //           <Text style={styles.codeText} >Code has been send to {phoneNumber}</Text>

// //           {autoverifyingLoading ?
// //             <View>
// //               <View style={styles.commonFieldContainer} >
// //                 <TextInput
// //                   value={code} onChangeText={text => setCode(text.replace(/[^0-9]/g, ''))}
// //                   maxLength={6}
// //                   keyboardType='number-pad'
// //                   style={styles.commonField} placeholder='Detecting Your Otp*' />
// //                 <MaterialIcons style={styles.commonIcon} name="lock" size={20} />
// //               </View>
// //               <View style={{ paddingTop: 12 }} >
// //                 <ActivityIndicator color={config.primaryColor} size='large' />
// //                 <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 12, }} >
// //                   <Text style={{ color: config.primaryColor, fontSize: 16, paddingRight: 3 }} >{timer}</Text>
// //                   <Text style={{ color: 'gray', textAlign: 'center', fontSize: 16 }} >Auto Detecting otp...</Text>
// //                 </View>
// //               </View>
// //               {/* <TouchableOpacity activeOpacity={0.8} style={{...styles.signUpBtn,backgroundColor:'lightgray'}}>
// //             <Text style={{...styles.signInText,color:'gray'}}>Verify and Sign In </Text>
// //           </TouchableOpacity> */}
// //             </View>
// //             :

// //             <View>
// //               <View style={styles.commonFieldContainer} >
// //                 <TextInput
// //                   value={code} onChangeText={text => setCode(text.replace(/[^0-9]/g, ''))}
// //                   autoFocus
// //                   maxLength={6}
// //                   keyboardType='number-pad'
// //                   style={styles.commonField} placeholder='Enter Your Otp*' />
// //                 <MaterialIcons style={styles.commonIcon} name="lock" size={20} />
// //               </View>
// //               <View style={styles.otpResend}>
// //                 <Text style={{ color: "gray" }}>Can't received? </Text>
// //                 <Text onPress={resendOtp} style={{ color: config.primaryColor, fontWeight: "600" }}>
// //                   Resend OTP
// //                 </Text>
// //               </View>
// //               <TouchableOpacity onPress={() => confirmCode()} activeOpacity={0.8} style={styles.signUpBtn}>
// //                 <Text style={styles.signInText}>Verify and Sign In </Text>
// //               </TouchableOpacity>
// //             </View>
// //           }
// //         </View>
// //         {/* for extra spacing */}
// //         <View style={{ paddingBottom: 20 }} ></View>
// //         {/* for extra spacing */}
// //       </ScrollView>
// //     </View>





// //   )
// // }

// // export default Otp

// // const styles = StyleSheet.create({
// //   signUpBtn: {
// //     width: "100%",
// //     marginTop: 20,
// //     alignItems: "center",
// //     paddingVertical: 12,
// //     paddingHorizontal: 10,
// //     backgroundColor: config.primaryColor,
// //     borderRadius: 16,
// //     shadowColor: config.primaryColor,
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 1,
// //     shadowRadius: 90,
// //     elevation: 9,
// //   },
// //   commonFieldContainer: {
// //     position: 'relative',
// //     width: '100%'
// //   },
// //   commonField: {
// //     width: '100%',
// //     marginTop: 15,
// //     paddingHorizontal: 45,
// //     paddingVertical: 9,
// //     fontSize: 14,
// //     // textTransform:'capitalize',
// //     backgroundColor: '#f5f5f6',
// //     letterSpacing: 1.5,
// //     borderRadius: 16,
// //     borderWidth: 0.5,
// //     borderColor: 'lightgray'
// //   },
// //   commonIcon: {
// //     position: 'absolute',
// //     bottom: 12,
// //     left: 15,
// //     color: '#555'
// //   },

// //   signInText: {
// //     fontSize: 15,
// //     fontWeight: "600",
// //     letterSpacing: 1,
// //     color: "white",
// //   },
// //   codeText: {
// //     marginTop: 15,
// //     fontSize: 16,
// //     fontWeight: '500',
// //     color: 'gray',
// //     textAlign: 'center',
// //     paddingVertical: 30
// //   },
// //   otpField: {
// //     width: 50,
// //     borderRadius: 20,
// //     borderWidth: 0.5,
// //     borderColor: "lightgray",
// //     marginHorizontal: 5,
// //     backgroundColor: "#f5f5f6",
// //     paddingVertical: 10,
// //     textAlign: "center",
// //   },
// //   otpFieldInput: {
// //     width: 100,
// //     borderRadius: 20,
// //     borderWidth: 0.5,
// //     borderColor: "lightgray",
// //     marginHorizontal: 5,
// //     backgroundColor: "#f5f5f6",
// //     paddingVertical: 10,
// //     textAlign: "center",
// //   },
// //   otpResend: {
// //     flexDirection: 'row',
// //     marginVertical: 26,
// //     alignItems: 'center',
// //     justifyContent: 'center'

// //   },
// //   screenContainer: {
// //     backgroundColor: "white",
// //     flex: 1,
// //   },
// //   headingText: {
// //     color: config.primaryColor,
// //     fontSize: 17,
// //     letterSpacing: 1,
// //     fontWeight: '600',
// //   },
// //   commonFieldMainBox: {
// //     marginTop: 12,
// //     width: '100%',
// //     paddingHorizontal: 20,
// //   },
// //   phoneFieldContainer: {
// //     position: 'relative',
// //     width: '100%'
// //   },
// //   indiaIcon: {
// //     position: 'absolute',
// //     bottom: 14,
// //     left: 15
// //   },
// //   nineOneText: {
// //     fontSize: 14,

// //   },
// //   phoneField: {
// //     width: '100%',
// //     marginTop: 15,
// //     paddingHorizontal: 79,
// //     paddingVertical: 9,
// //     fontSize: 14,
// //     backgroundColor: '#f5f5f6',
// //     letterSpacing: 1.5,
// //     borderRadius: 16,
// //     borderWidth: 0.5,
// //     borderColor: 'lightgray'

// //   },
// //   commonFieldContainer: {
// //     position: 'relative',
// //     width: '100%'
// //   },
// //   commonField: {
// //     width: '100%',
// //     marginTop: 15,
// //     paddingHorizontal: 45,
// //     paddingVertical: 9,
// //     fontSize: 14,
// //     // textTransform:'capitalize',
// //     backgroundColor: '#f5f5f6',
// //     letterSpacing: 1.5,
// //     borderRadius: 16,
// //     borderWidth: 0.5,
// //     borderColor: 'lightgray'
// //   },
// //   commonIcon: {
// //     position: 'absolute',
// //     bottom: 12,
// //     left: 15,
// //     color: '#555'
// //   },

// //   checkouttext: {
// //     fontSize: 15,
// //     fontWeight: '600',
// //     letterSpacing: 1.5,
// //     color: 'white'
// //   },
// //   checkoutBtn: {
// //     width: "100%",
// //     marginTop: 20,
// //     alignItems: "center",
// //     paddingVertical: 13,
// //     paddingHorizontal: 10,
// //     backgroundColor: config.primaryColor,
// //     borderRadius: 16,
// //     shadowColor: config.primaryColor,
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.49,
// //     shadowRadius: 10,
// //     elevation: 9,

// //   }
// // })


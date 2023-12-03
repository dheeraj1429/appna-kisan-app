import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
  ToastAndroid,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  BackHandler,
  Pressable
} from "react-native";
import { config } from "../../config";
import { Modal, Portal, Provider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";
import navigationString from "../../Constants/navigationString";
import { setItemToLocalStorage } from "../../Utils/localstorage";
import axios from "axios";
import { FontAwesome5 } from '@expo/vector-icons';
import { UseContextState } from "../../global/GlobalContext";
import Toast from 'react-native-toast-message';
import { logger } from "react-native-logs";

function Login({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState('PhoneNumber');
  const { authState, fetchAuthuser } = UseContextState();
  const [details, setDetails] = useState([]);
  const log = logger.createLogger();
const [modalVisible1, setModalVisible1] = useState(false);
  const [email, setEmail] = useState('');
const [forgotField, setForgotField] = useState('');
  const [password, setPassword] = useState('');
  //const { setUserData } = UseContextState();
  const { saveUserData } = UseContextState();

  const handleOptionClick = (option) => {
    setSelectedOption(option); // Update the selectedOption state when a TouchableOpacity is pressed
  };
  //log.info('phoneNumber', phoneNumber);

  const goBack = () => {
    // navigation.goBack();
    BackHandler.exitApp()
  };
  const handleSignupPhone = async () => {
    if (phoneNumber.length >= 10) {

      try {
        const response = await axios.post(
          `${config.BASE_URL}/app/login/user/b2b/b2c`,
          {
            email: email,
            mobile: phoneNumber,
            password: password,
          },
          { withCredentials: true }
        );
        log.info("response", response);

        //log.info("response.data",response.data);

        if (response.status === 200) {
          setLoading(false);
          log.info("response.data", response.data);
          log.info("API call successful");
          //navigation.navigate(navigationString.LOGIN);
          //setItemToLocalStorage('user',response?.data?.user);
          //setUserId('')
          fetchAuthuser();
          //showToast()
          navigation.navigate(navigationString.HOME);
          // Handle successful API response here
        } else if (response.status === 422) {
          setLoading(false);
          log.info("Validation error");
          // Handle validation error, possibly by displaying error messages
          log.info(response.data); // Assuming the server provides validation error details
        } else {
          setLoading(false);
          log.info("API call failed");
          // Handle API failure if needed
        }
      } catch (error) {
        setLoading(false);
        //log.info("Error in API call:", error?.data?.message);
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'API Error',
          text2: error.data.message,
          visibilityTime: 4000, // 4 seconds
          autoHide: true,
        });
        //Alert.alert(error.response);
        // Handle API error if needed
      }

      // navigation.navigate(navigationString.OTP_SCREEN,{phoneNumber:`+91 ${phoneNumber}`});
    }
    else {
      ToastAndroid.showWithGravityAndOffset(
        "Enter a Valid Credentials!!",
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
        25,
        50
      );

    }
  }

  const handleSignup = async () => {
    if ((email && password.length >= 4) || phoneNumber) {
      try {
        const response = await axios.post(
          // `${config.BASE_URL}login/user/b2b/b2c`,
          `https://whale-app-88bu8.ondigitalocean.app/api/app/login/user/b2b/b2c`,
          {
            email: email || undefined, // Use email if provided, otherwise undefined
            mobile: phoneNumber || undefined, // Use phoneNumber if provided, otherwise undefined
            password: password || undefined,
            userType: "B2B"
          },
          { withCredentials: true }
        );
        log.info("response in login", response);

        if (response.status === 200) {
          setLoading(false);
          log.info("response.data", response.data);
          // log.info("API call successful");
          fetchAuthuser();
          const userData = response.data;
          //fetchAuthuser(userData);
          saveUserData(userData); // Save userData to the context

          // setDetails(response.data);
          // log.info("response.data.accessToken", response.data.accessToken);
          // log.info("response.data.user.id", response.data.user._id);
          navigation.navigate(navigationString.TAB_ROUTE);
          // navigation.navigate(navigationString.TAB_ROUTE, { details });

        } else if (response.status === 422) {
          setLoading(false);
          log.info("Validation error");
          log.info(response.data);
        } else {
          setLoading(false);
          log.info("API call failed");
        }
      } catch (error) {
        setLoading(false);
        log.info("Error in API call:", error.response);
        //Alert.alert("Please fill valid credentials");
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'API Error',
          text2: error.response.data.message,
          visibilityTime: 4000, // 4 seconds
          autoHide: true,
        });
      }
    } else {
      ToastAndroid.showWithGravityAndOffset(
        "Enter a Valid Credentials",
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
        25,
        50
      );
    }
  };

  const goToRegister = () => {
    navigation.navigate(navigationString.REGISTER)
  }
  return (
    <Provider>
      <Portal>
        <View style={{ flex: 1, backgroundColor: '#fff' }} >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingTop: 50, paddingBottom: 10 }} >
            <MaterialIcons onPress={goBack} name="" size={24} color={config.primaryColor} />
            <Text style={styles.headingText} >Sign in to Your Account</Text>
            <MaterialIcons name="keyboard-arrow-left" size={27} color='white' />
          </View>

          {loading ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
              <ActivityIndicator size='large' color={config.primaryColor} />
            </View>
            :
            <ScrollView showsVerticalScrollIndicator={false}>


              <View style={styles.loginContainer}>


                <View style={styles.phoneFieldContainer}>
                  <TextInput
                    maxLength={10}
                    keyboardType="numeric"
                    style={styles.phoneField}
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChangeText={(value) => setPhoneNumber(value.replace(/[^0-9]/g, ''))}
                  />
                  <View style={styles.indiaIcon}>
                    <Text style={styles.nineOneText}>🇮🇳 + 9 1</Text>
                  </View>
                </View>



              </View>
              <Text style={styles.orText}>or</Text>

              <View style={styles.registerContainer}  >
                <View style={styles.commonFieldMainBox} >




                  <View style={styles.commonFieldContainer}>
                    <TextInput
                      style={styles.commonField}
                      onChangeText={(value) => setEmail(value.replace(/[^a-zA-Z0-9@._-]/g, ''))}
                      keyboardType='email-address' // This sets the keyboard to the email address format
                      maxLength={50} // Adjust the maximum length as needed
                      placeholder='Email'
                    />
                    <FontAwesome5 style={{ ...styles.commonIcon, bottom: 15 }} name="envelope" size={15} />
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



                </View>

                <TouchableOpacity onPress={handleSignup} activeOpacity={0.8} style={styles.signUpBtn}>
                  <Text style={styles.signInText}>Sign in</Text>
                </TouchableOpacity>
                <View style={{ marginVertical: "5%" }}>

                  <Text onPress={() => setModalVisible1(true)}
                   style={{ color: config.primaryColor, fontWeight: "600" }}>
                    Forgot Password
                  </Text>
                </View>
                <Text style={styles.orText}>or</Text>
                <View style={styles.dontHaveAccountBox}>
                  <Text style={{ color: "gray" }}>Don't have an account? </Text>
                  <Text onPress={goToRegister} style={{ color: config.primaryColor, fontWeight: "600" }}>
                    Sign up{" "}
                  </Text>
                </View>

              </View>


            </ScrollView>
          }

        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible1}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible1(!modalVisible1);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{fontSize:15}}>Forgot Password ?</Text>
              <Text style={{fontSize:15}}>Enter your register phone number</Text>
              <View style={styles.commonFieldContainer}>
                    <TextInput
                      style={styles.commonField}
                      value={forgotField}
                      onChangeText={(value) => setForgotField(value.replace(/[^0-9]/g, ''))}
                    />
                  </View>
              <View style={{flexDirection:"row", justifyContent:"space-evenly",alignContent:"center",}}>
                <Pressable
                style={styles.Btn}
                  onPress={() => setModalVisible1(!modalVisible1)}>
                  <Text style={styles.textStyle}>CANCEL</Text>
                </Pressable>
                <Text>    </Text>
                <Pressable
                style={styles.Btn}
                  onPress={() => {
                    setModalVisible1(!modalVisible1);
                   // handleForgotPassword();
                    //navigation.navigate(navigationString.OTP_FORGOT);
                  }}>
                  <Text style={styles.textStyle}>SEND</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.containerStyle}>
          <View>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#222', textAlign: 'center' }} > User Not Exists </Text>
            <View  >
              <View style={{ paddingTop: 8, paddingBottom: 13 }} >
                <Text style={{ textAlign: 'center', color: 'gray' }} > Phone number you entered</Text>
                <Text style={{ textAlign: 'center', color: 'gray' }}  >is not registered !!</Text>
              </View>
              <TouchableOpacity activeOpacity={0.5} onPress={() => setModalVisible(false)} >
                <View style={{ paddingTop: 6, borderTopColor: '#f2f2f2', borderTopWidth: 1 }} >
                  <Text style={{ color: config.primaryColor, textAlign: 'center', fontSize: 14, fontWeight: '700' }} >OK</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
}

export default Login;

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: 30,
    marginTop: "30%",

  },
  registerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 30,
  },
  commonFieldMainBox: {
    marginTop: 12,
    width: '100%'
  },
  commonIcon: {
    position: 'absolute',
    bottom: 12,
    left: 15,
    color: '#555'
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
  headingText: {
    color: config.primaryColor,
    fontSize: 17,
    letterSpacing: 1,
    fontWeight: '500',
  },
  containerStyle: {
    backgroundColor: 'white',
    paddingTop: 15,
    paddingBottom: 12,
    marginHorizontal: 80,
    borderRadius: 10,
    zIndex: 2
  },
  loginHeading: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "500",
  },
  phoneFieldContainer: {
    position: "relative",
    width: "100%",
  },
  indiaIcon: {
    position: "absolute",
    bottom: 14,
    left: 15,
  },
  nineOneText: {
    fontSize: 15,
  },
  commonFieldContainer: {
    position: 'relative',
    width: '100%'
  },
  phoneField: {
    width: "100%",
    marginTop: 15,
    paddingHorizontal: 79,
    paddingVertical: 9,
    fontSize: 15,
    backgroundColor: "#f5f5f6",
    letterSpacing: 3,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: "lightgray",
  },
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
  Btn: {
    width: "50%",
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
  signInText: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 1,
    color: "white",
  },
  orText: {
    marginVertical: 20,
    color: "gray",
    textAlign: "center",
    justifyContent: "center"
  },
  dontHaveAccountBox: {
    flexDirection: "row",
    // marginTop:10,
  },
  codeText: {
    marginTop: 15,
    fontSize: 12
  },
  otpContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
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
    marginTop: 16
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

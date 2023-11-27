import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, ToastAndroid, TextInput, ScrollView, TouchableOpacity, Alert } from "react-native"
import { config } from '../../config';
import { Checkbox, Modal, Portal, Provider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import navigationString from '../../Constants/navigationString';
import axios from 'axios';
import { UseContextState } from '../../global/GlobalContext';
import { clearLocalStorage, setItemToLocalStorage } from '../../Utils/localstorage';
function Register({ navigation }) {
  const [checked, setChecked] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [panNum, setPanNum] = useState('');
  const [aadharNum, setAadharNum] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gstNum, setGstNum] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('B2B');
  const {authState,fetchAuthuser} = UseContextState();

  const goBack = () => {
    navigation.goBack();
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option); // Update the selectedOption state when a TouchableOpacity is pressed
  };


  // useEffect(() => {
  //   // const xyz = axios.get("")

  //   axios.get('https://api.publicapis.org/entries').then(res => console.log(res))
  // }, [])

  const handleCreateBtnB2B = async () => {
    if (!name.length > 0) {
      ToastAndroid.showWithGravityAndOffset(
        "Please enter your name!!",
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
        25,
        50
      );
      return;
    }
    if (!gstNum.length > 0) {
      ToastAndroid.showWithGravityAndOffset(
        "Please enter GST number!!",
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
        25,
        50
      );
      return;
    }
    if (phoneNumber.length != 10) {
      ToastAndroid.showWithGravityAndOffset(
        "Enter a Valid Phone number!!",
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
        25,
        50
      );
      return;
    }
    if (address.length < 4) {
      ToastAndroid.showWithGravityAndOffset(
        "Please enter address!!",
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
        25,
        50
      );
      return;
    }
    if (email.length < 5) {
      ToastAndroid.showWithGravityAndOffset(
        "Please enter valid email address!!",
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
        25,
        50
      );
      return;
    }
    if (password.length < 4) {
      ToastAndroid.showWithGravityAndOffset(
        "Please enter valid paasword!!",
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
        25,
        50
      );
      return;
    }
    if (phoneNumber.length >= 10 && name.length > 0 && gstNum.length > 0 && address.length > 0 && email.length > 0 && password.length > 0 && checked) {
      setLoading(true)
      // await axios.get(`${config.BACKEND_URI}/api/app/check/user/exists/${phoneNumber}`, { withCredentials: true })
      //   .then(res => {
      //     console.log(res?.data)
      //     if (!res?.data?.user_exists) {
      //       setLoading(false);
      //       navigation.navigate(navigationString.OTP_SCREEN, { user_exists: false, user_name: name, phoneNumber: `+91 ${phoneNumber}` });
      //     } else {
      //       setLoading(false);
      //       setModalVisible(true);
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     setLoading(false);
      //   })
      try {
        const response = await axios.post(
          `${config.BASE_URL}/app/create/user/b2b`,
          {
            name: name,
            ownerName: ownerName,
            email: email,
            mobile: phoneNumber,
            password: password,
            address: address,
            pan: {
              number: panNum,
              //images: [{ image_url: "some_image_url", image_name: "some_name", path: "some_path" }],
            },
            aadhaar: {
              number: aadharNum,
              //images: [{ image_url: "some_image_url", image_name: "some_name", path: "some_path" }],
            },
            gstNo: {
              number: gstNum, // Replace with the GST number you want to send
              //images: [{ image_url: "some_image_url", image_name: "some_name", path: "some_path" }],
            },
          },
          { withCredentials: true }
        );
        console.log("response",response);
  
        //console.log("response.data",response.data);
    
        if (response.status === 200) {
          setLoading(false);
          console.log("response.data",response.data);
          console.log("API call successful");
          //navigation.navigate(navigationString.LOGIN);
          //setItemToLocalStorage('user',response?.data?.user);
          //setUserId('')
          fetchAuthuser();
          //showToast()
          navigation.navigate(navigationString.LOGIN);
          // Handle successful API response here
        } else if (response.status === 422) {
        setLoading(false);
        console.log("Validation error");
        // Handle validation error, possibly by displaying error messages
        console.log(response.data); // Assuming the server provides validation error details
      }  else {
          setLoading(false);
          console.log("API call failed");
          // Handle API failure if needed
        }
      } catch (error) {
        setLoading(false);
        console.error("Error in API call:", error.response);
        Alert.alert(error.response);
        // Handle API error if needed
      }
      console.log("Name:", name);
      console.log("Owner Name:", ownerName);
      console.log("Phone Number:", phoneNumber);
      console.log("PAN Number:", panNum);
      console.log("Email:", email);
      console.log("Password:", password);
      console.log("Aadhar Number:", aadharNum);
      console.log("GST Number:", gstNum);
      console.log("address:", address);
      setLoading(false);

    }
    // else{
    //   ToastAndroid.showWithGravityAndOffset(
    //     "Enter a Valid Phone number!!",
    //     ToastAndroid.LONG,
    //     ToastAndroid.CENTER,
    //     25,
    //     50
    //   );

    // }
  }

  // const handleCreateBtnB2C = async () => {
  //   console.log("function called");
  //   if (!name.length > 0) {
  //     showToast("Please enter your name!!");
  //     return;
  //   }
  
  //   if (phoneNumber.length !== 10) {
  //     showToast("Enter a valid phone number!!");
  //     return;
  //   }
  
  //   if (email.length < 5) {
  //     showToast("Please enter a valid email address!!");
  //     return;
  //   }
  
  //   if (password.length < 4) {
  //     showToast("Please enter a valid password!!");
  //     return;
  //   }
  
  //   if (
  //     phoneNumber.length >= 10 &&
  //     name.length > 0 &&
  //     email.length > 0 &&
  //     password.length > 0 &&
  //     checked
  //   ) {
  //     setLoading(true);
  //     try {
  //       console.log("before api");
  //       const res = await axios.post(
  //         `${config.BASE_URL}/app/create/user/b2c`,
  //         { withCredentials: true }
  //       );
  
  //       console.log(res?.data);
  
  //       if (!res?.data?.user_exists) {
  //         setLoading(false);
  //         console.log("try if");
  //         navigation.navigate(navigationString.OTP_SCREEN, {
  //           user_exists: false,
  //           name: name,
  //           mobile: `+91 ${phoneNumber}`,
  //           email: email,
  //           password: password,
  //         });
  //       } else {
  //         setLoading(false);
  //         setModalVisible(true);
  //         console.log("try else");
  //       }
  //     } catch (err) {
  //       console.log(err);
  //       setLoading(false);
  //       console.log("catch");
  //     }
  
  //     console.log("Name:", name);
  //     console.log("Phone Number:", phoneNumber);
  //     console.log("Email:", email);
  //     console.log("Password:", password);
  //     console.log("Address:", address);
  
  //     // setLoading(false);
  //   } else {
  //     showToast("Enter a valid phone number!!");
  //   }
  // };
  
  const handleCreateBtnB2C = async () => {
    if (!isFieldValid(name, "Name")) return;
    if (!isFieldValid(phoneNumber, "Phone Number", 10)) return;
    if (!isFieldValid(email, "Email", 5, "email")) return;
    if (!isFieldValid(password, "Password", 4)) return;
  
    setLoading(true);
  console.log(config.BASE_URL);
    try {
      const response = await axios.post(
        `${config.BASE_URL}/app/create/user/b2c`,
        {
          name: name,
          email: email,
          mobile: phoneNumber,
          password: password,
        },
        { withCredentials: true }
      );
      console.log("response",response);

      console.log("response.data",response.data);
  
      if (response.status === 200) {
        setLoading(false);
        console.log("response.data.data",response.data.data);
        console.log("API call successful");
        //navigation.navigate(navigationString.LOGIN);
        //setItemToLocalStorage('user',response?.data?.user);
        //setUserId('')
        fetchAuthuser();
        //showToast()
        navigation.navigate(navigationString.LOGIN);
        // Handle successful API response here
      } else if (response.status === 422) {
      setLoading(false);
      console.log("Validation error");
      // Handle validation error, possibly by displaying error messages
      console.log(response.data); // Assuming the server provides validation error details
    }  else {
        setLoading(false);
        console.log("API call failed");
        // Handle API failure if needed
      }
    } catch (error) {
      setLoading(false);
      console.error("Error in API call:", error.response);
      Alert.alert(error.response);
      // Handle API error if needed
    }
  };
  
  const isFieldValid = (value, fieldName, minLength, fieldType) => {
    if (!value || value.length < minLength) {
      showToast(`Please enter a valid ${fieldName}!`);
      return false;
    }
  
    if (fieldType === "email" && !isValidEmail(value)) {
      showToast("Please enter a valid email address!");
      return false;
    }
  
    return true;
  };
  
  const isValidEmail = (email) => {
    // Add your email validation logic here
    // For a simple example, we'll just check for the presence of '@'
    return email.includes("@");
  };
  
  const showToast = (message) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.CENTER,
      25,
      50
    );
  };
  
  
  const goToLogin = () => {
    navigation.navigate(navigationString.LOGIN)
  }
  return (
    <Provider>
      <Portal>

        <View style={{ flex: 1, backgroundColor: '#fff' }}  >

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingTop: 50, paddingBottom: 10 }} >
            <MaterialIcons onPress={goBack} name="" size={24} color={config.primaryColor} />
            <Text style={styles.headingText} >Create an Account</Text>
            <MaterialIcons name="" size={27} color='white' />
          </View>
          {loading ?
            <View style={{ justifyContent: 'center', alignItems: 'center' }} >
              <ActivityIndicator size='large' color={config.primaryColor} />
            </View>
            :
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={[styles.buttonContainer, { flexDirection: "row", justifyContent: "space-evenly" }]}>

                <TouchableOpacity onPress={() => handleOptionClick('B2B')}
                  style={[styles.btnConrainer, {
                    paddingVertical: "2%",
                    paddingHorizontal: "15%",
                    borderRadius: 16,
                    backgroundColor: selectedOption === 'B2B' ? config.primaryColor : 'transparent',
                  }]}>
                  <Text style={[{ color: selectedOption === 'B2B' ? "white" : "black", fontWeight: "600", fontSize: 15 }]}>
                    B2B
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleOptionClick('B2C')}
                  style={{
                    paddingVertical: "2%",
                    paddingHorizontal: "15%",
                    borderRadius: 16,
                    backgroundColor: selectedOption === 'B2C' ? config.primaryColor : 'transparent',
                  }}>
                  <Text style={[{ color: selectedOption === 'B2C' ? "white" : "black", fontWeight: "600", fontSize: 15 }]}>
                    B2C
                  </Text>
                </TouchableOpacity>

              </View>

              {selectedOption === 'B2B' && (
                <View style={styles.registerContainer}  >
                  <View style={styles.commonFieldMainBox} >
                    <View style={styles.commonFieldContainer} >
                      <TextInput
                        value={name}
                        onChangeText={(value) => setName(value.replace(/[^a-zA-Z ]/g, ''))}
                        maxLength={20}
                        style={styles.commonField} placeholder='Full Name' />
                      <MaterialCommunityIcons style={styles.commonIcon} name="account" size={20} />
                    </View>
                    <View style={styles.commonFieldContainer} >
                      <TextInput
                        value={ownerName}
                        onChangeText={(value) => setOwnerName(value)}
                        maxLength={20}
                        style={styles.commonField} placeholder='Company Name' />
                      <MaterialCommunityIcons style={styles.commonIcon} name="account-circle" size={20} />
                    </View>

                    <View style={styles.phoneFieldContainer} >
                      <TextInput
                        maxLength={10}
                        keyboardType="numeric"
                        style={styles.phoneField}
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChangeText={(value) => setPhoneNumber(value.replace(/[^0-9]/g, ''))}
                      />
                      <View style={styles.indiaIcon} >
                        <Text style={styles.nineOneText}  >🇮🇳  + 9 1</Text>
                      </View>
                    </View>

                    <View style={styles.commonFieldContainer} >
                      <TextInput
                        style={styles.commonField}
                        onChangeText={(value) => setPanNum(value.replace(/[^0-9]/g, ''))}
                        keyboardType='defult'
                        maxLength={10}
                        placeholder='Pan Number' />
                      <FontAwesome5 style={{ ...styles.commonIcon, bottom: 15 }} name="money-check" size={15} />
                    </View>

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


                    <View style={styles.commonFieldContainer} >
                      <TextInput style={styles.commonField}
                        onChangeText={(value) => setAadharNum(value.replace(/[^0-9]/g, ''))}
                        keyboardType='defult'
                        maxLength={12}
                        placeholder='Aadhar Number' />
                      <FontAwesome5 style={{ ...styles.commonIcon, bottom: 15 }} name="address-card" size={15} />
                    </View>

                    <View style={styles.commonFieldContainer} >
                      <TextInput style={styles.commonField}
                        onChangeText={(value) => setGstNum(value.replace(/[^0-9]/g, ''))}
                        keyboardType='defult'
                        maxLength={10}
                        placeholder='Gst Number' />
                      <FontAwesome5 style={{ ...styles.commonIcon, bottom: 15 }} name="id-card-alt" size={15} />
                    </View>

                    <View style={styles.commonFieldContainer} >
                      <TextInput keyboardType='numeric'
                        style={styles.commonField}
                        placeholder='Upload Document' />
                      <FontAwesome name="image" size={21} style={styles.commonIcon} />
                    </View>


                    <View style={styles.commonFieldContainer} >
                      <TextInput keyboardType='default'
                      value={address}
                        style={styles.commonField}
                        placeholder='Address'
                        onChangeText={(value) => setAddress(value)}
                      />
                      <FontAwesome name="address-card" size={21} style={styles.commonIcon} />
                    </View>

                  </View>
                  <View style={styles.termsAndCondition} >
                    <Checkbox
                      color={config.primaryColor}
                      status={checked ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setChecked(!checked);
                      }}
                    />
                    <Text style={{ fontSize: 12 }} >Accept Terms & Conditions</Text>
                  </View>

                  <TouchableOpacity
                    onPress={handleCreateBtnB2B}
                    activeOpacity={0.8} style={styles.signUpBtn} >
                    <Text style={styles.signInText} >
                      Create and Verify
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.orText} >or</Text>
                  <View style={styles.dontHaveAccountBox} >
                    <Text style={{ color: 'gray' }} >Already have an account? </Text>
                    <Text onPress={goToLogin} style={{ color: config.primaryColor, fontWeight: '600' }} >Sign in </Text>
                  </View>
                </View>

              )}
              {selectedOption === 'B2C' && (
                <View style={styles.registerContainer}  >
                  <View style={styles.commonFieldMainBox} >
                    <View style={styles.commonFieldContainer} >
                      <TextInput
                        value={name}
                        onChangeText={(value) => setName(value.replace(/[^a-zA-Z ]/g, ''))}
                        maxLength={20}
                        style={styles.commonField} placeholder='Full Name' />
                      <MaterialCommunityIcons style={styles.commonIcon} name="account" size={20} />
                    </View>

                    <View style={styles.phoneFieldContainer} >
                      <TextInput
                        maxLength={10}
                        keyboardType="numeric"
                        style={styles.phoneField}
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChangeText={(value) => setPhoneNumber(value.replace(/[^0-9]/g, ''))}
                      />
                      <View style={styles.indiaIcon} >
                        <Text style={styles.nineOneText}  >🇮🇳  + 9 1</Text>
                      </View>
                    </View>

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


                    <View style={styles.commonFieldContainer} >
                      <TextInput
                        keyboardType='default'
                        style={styles.commonField}
                        placeholder='Address'
                        onChangeText={(value) => setAddress(value.replace(/[^a-zA-Z0-9 ,.-]/g, ''))}
                      />
                      <FontAwesome name="address-card" size={21} style={styles.commonIcon} />
                    </View>

                  </View>
                  <View style={{ height: 150 }}>

                  </View>

                  <View style={[styles.termsAndCondition,]} >
                    <Checkbox
                      color={config.primaryColor}
                      status={checked ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setChecked(!checked);
                      }}
                    />
                    <Text style={{ fontSize: 12 }} >Accept Terms & Conditions</Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      handleCreateBtnB2C();
                      console.log("button Clicked");
                    }}
                    activeOpacity={0.8} style={styles.signUpBtn} >
                    <Text style={styles.signInText} >
                      Create and Verify
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.orText} >or</Text>
                  <View style={styles.dontHaveAccountBox} >
                    <Text style={{ color: 'gray' }} >Already have an account? </Text>
                    <Text onPress={goToLogin} style={{ color: config.primaryColor, fontWeight: '600' }} >Sign in </Text>
                  </View>
                </View>

              )}

            </ScrollView>
          }
        </View>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.containerStyle}>
          <View>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#222', textAlign: 'center' }} > User Already Exists </Text>
            <View  >
              <View style={{ paddingTop: 8, paddingBottom: 13 }} >
                <Text style={{ textAlign: 'center', color: 'gray' }} > Phone number you entered</Text>
                <Text style={{ textAlign: 'center', color: 'gray' }}  >is already registered</Text>
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

  )
}

export default Register

const styles = StyleSheet.create({
  registerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 30,
  },
  containerStyle: {
    backgroundColor: 'white',
    paddingTop: 15,
    paddingBottom: 12,
    marginHorizontal: 80,
    borderRadius: 10,
    zIndex: 2
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 95,
    paddingVertical: 60,
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
  headingText: {
    color: config.primaryColor,
    fontSize: 17,
    letterSpacing: 1,
    fontWeight: '500',
  },
  registerHeading: {
    fontSize: 20,
    fontWeight: '600'
  },
  commonFieldMainBox: {
    marginTop: 12,
    width: '100%'
  },
  phoneFieldContainer: {
    position: 'relative',
    width: '100%'
  },
  indiaIcon: {
    position: 'absolute',
    bottom: 15,
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
    letterSpacing: 2,
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
    backgroundColor: '#f5f5f6',
    letterSpacing: 2,
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
  orText: {
    marginVertical: 20,
    color: 'gray'
  },
  dontHaveAccountBox: {
    flexDirection: 'row',
    // marginTop:10,
  },
  termsAndCondition: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: 10
  }
})
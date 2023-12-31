import {
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { logger } from "react-native-logs";
import { Checkbox, Modal, Portal, Provider } from "react-native-paper";
import Toast from "react-native-toast-message";
import navigationString from "../../Constants/navigationString";
import { config } from "../../config";
import { UseContextState } from "../../global/GlobalContext";

function Register({ navigation }) {
  const [checked, setChecked] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [panNum, setPanNum] = useState("");
  const [aadharNum, setAadharNum] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gstNum, setGstNum] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("B2B");
  const { authState, fetchAuthuser } = UseContextState();
  const [selectedImage, setSelectedImage] = useState(null);
  const { saveUserData } = UseContextState();
  const [image, setImage] = useState(null);
  var log = logger.createLogger();

  const goBack = () => {
    navigation.goBack();
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option); // Update the selectedOption state when a TouchableOpacity is pressed
  };

  // useEffect(() => {
  //   // const xyz = axios.get("")

  //   axios.get('https://api.publicapis.org/entries').then(res => log.info(res))
  // }, [])

  const handleCreateBtnB2B = async () => {
    //log.info(selectedImage, "selectedImageeeeee");
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
    if (!ownerName.length > 0) {
      ToastAndroid.showWithGravityAndOffset(
        "Please enter Company name!!",
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
        25,
        50
      );
      return;
    }
    // if (!panNum.length > 0) {
    //   ToastAndroid.showWithGravityAndOffset(
    //     "Please enter PAN number!!",
    //     ToastAndroid.LONG,
    //     ToastAndroid.CENTER,
    //     25,
    //     50
    //   );
    //   return;
    // }
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
    if (password.length < 6) {
      ToastAndroid.showWithGravityAndOffset(
        "Please enter valid paasword!!",
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
        25,
        50
      );
      return;
    }
    // if (aadharNum.length < 4) {
    //   ToastAndroid.showWithGravityAndOffset(
    //     "Please enter valid aadhar!!",
    //     ToastAndroid.LONG,
    //     ToastAndroid.CENTER,
    //     25,
    //     50
    //   );
    //   return;
    // }
    // if (!selectedImage.image_url) {
    //   ToastAndroid.showWithGravityAndOffset(
    //     "Please select an Image!!",
    //     ToastAndroid.LONG,
    //     ToastAndroid.CENTER,
    //     25,
    //     50
    //   );
    //   return;
    // }
    if (
      phoneNumber.length >= 10 &&
      name.length > 0 &&
      ownerName.length > 0 &&
      email.length > 0 &&
      password.length > 0 &&
      checked
    ) {
      setLoading(true);
      // try {
      //   const response = await axios.post(
      //     `${config.BASE_URL}/app/create/user/b2b`,
      //     {
      //       name: name,
      //       email: email,
      //       owner_name: ownerName,
      //       mobile: phoneNumber,
      //       password: password,
      //       address: address,
      //       pan: panNum,
      //       aaadhaar: aadharNum,
      //       gstNo: gstNum,
      //     },
      //     { withCredentials: true }
      //   );

      //   log.info(response.data);

      //   if (response.status === 200) {
      //     setLoading(false);
      //     log.info(response.data.data);
      //     log.info("API call successful");
      //     // Handle successful API response here
      //   } else if (response.status === 422) {
      //     setLoading(false);
      //     log.info("Validation error");
      //     // Handle validation error, possibly by displaying error messages
      //     log.info(response.data); // Assuming the server provides validation error details
      //   } else {
      //     setLoading(false);
      //     log.info("API call failed");
      //     // Handle API failure if needed
      //   }
      // } catch (error) {
      //   setLoading(false);
      //   log.info("Error in API call:", error.response);
      //   Alert.alert("try again later after some time");
      //   // Handle error if needed
      // }
      // await axios.get(`${config.BACKEND_URI}/api/app/check/user/exists/${phoneNumber}`, { withCredentials: true })
      //   .then(res => {
      //     log.info(res?.data)
      //     if (!res?.data?.user_exists) {
      //       setLoading(false);
      //       navigation.navigate(navigationString.OTP_SCREEN, { user_exists: false, user_name: name, phoneNumber: `+91 ${phoneNumber}` });
      //     } else {
      //       setLoading(false);
      //       setModalVisible(true);
      //     }
      //   })
      //   .catch(err => {
      //     log.info(err);
      //     setLoading(false);
      //   })
      try {
        // const imageToFirebase = await uploadFileToFirebase(
        //   `/ssastore/banners/xyz/`,
        //   image
        // );

        const userBody = {
          owner_name: name,
          company_name: ownerName,
          email: email,
          mobile: phoneNumber,
          password: password,
          address: address,
          // pan: {
          // number: panNum,
          // images: [{ image_url: selectedImage?.image_url, image_name: "some_name", path: "some_path" }],
          // },
          // aadhaar: {
          // number: aadharNum,
          //images: [{ image_url: selectedImage?.image_url, image_name: "some_name", path: "some_path" }],
          // },
          // gstNo: {
          //   number: gstNum, // Replace with the GST number you want to send
          //   images: [{ image_url: selectedImage.image_url, image_name: "some_name", path: "some_path" }],
          // },
        };

        if (panNum) {
          userBody.pan.number = panNum;
        }

        if (aadharNum) {
          userBody.aadhaar.number = aadharNum;
        }

        if (gstNum) {
          userBody.gstNo = {
            number: gstNum,
            //images: [{ image_url: selectedImage?.image_url, image_name: "some_name", path: "some_path" }],
          };
        }
        if (selectedImage?.image_url) {
          userBody.aadhaar.images = [
            {
              image_url: selectedImage?.image_url,
              image_name: "some_name",
              path: "some_path",
            },
          ];
        }
        log.info("userData ", userBody);
        const response = await axios.post(
          `${config.BASE_URL}/app/create/user/b2b`,
          userBody,
          { withCredentials: true }
        );
        log.info("response", response);

        //log.info("response.data",response.data);

        if (response.status === 201) {
          setLoading(false);
          log.info("response.data", response.data);
          log.info("API call successful");
          //navigation.navigate(navigationString.LOGIN);
          //setItemToLocalStorage('user',response?.data?.user);
          //setUserId('')
          //fetchAuthuser();
          //showToast()
          fetchAuthuser();
          const userData = response.data;
          saveUserData(userData); // Save userData to the context
          Toast.show({
            type: "success",
            position: "top",
            text1: "Success",
            text2: response.message,
            visibilityTime: 4000, // 4 seconds
            autoHide: true,
          });
          navigation.navigate(navigationString.REGISTRATION_OTP, {
            data: response.data,
            user_exists: true,
            phoneNumber: `+91 ${phoneNumber}`,
          });

          //  navigation.navigate(navigationString.TAB_ROUTE);
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
        log.info("hjbkjbkjhError in API call:", error);
        console.log(error.response.data, "errorresponse");
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2: error.response.data.message,
          visibilityTime: 4000, // 4 seconds
          autoHide: true,
        });
        //Alert.alert("try again later after some time");
        // Handle error if needed
      }
      log.info("Name:", name);
      log.info("Owner Name:", ownerName);
      log.info("Phone Number:", phoneNumber);
      log.info("PAN Number:", panNum);
      log.info("Email:", email);
      log.info("Password:", password);
      log.info("Aadhar Number:", aadharNum);
      log.info("GST Number:", gstNum);
      log.info("address:", address);
      setLoading(false);
      console.log(image, "imageof blob");
    }
  };

  // const handleCreateBtnB2C = async () => {
  //   log.info("function called");
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
  //       log.info("before api");
  //       const res = await axios.post(
  //         `${config.BASE_URL}/app/create/user/b2c`,
  //         { withCredentials: true }
  //       );

  //       log.info(res?.data);

  //       if (!res?.data?.user_exists) {
  //         setLoading(false);
  //         log.info("try if");
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
  //         log.info("try else");
  //       }
  //     } catch (err) {
  //       log.info(err);
  //       setLoading(false);
  //       log.info("catch");
  //     }

  //     log.info("Name:", name);
  //     log.info("Phone Number:", phoneNumber);
  //     log.info("Email:", email);
  //     log.info("Password:", password);
  //     log.info("Address:", address);

  //     // setLoading(false);
  //   } else {
  //     showToast("Enter a valid phone number!!");
  //   }
  // };

  const handleCreateBtnB2C = async (event) => {
    event.preventDefault();
    if (!isFieldValid(name, "Name")) return;
    if (!isFieldValid(phoneNumber, "Phone Number", 10)) return;
    if (!isFieldValid(email, "Email", 5, "email")) return;
    if (!isFieldValid(password, "Password", 4)) return;
    if (selectedImage) {
      log.info("Selected Image URL:", selectedImage.image_url);
      // Now you can send selectedImage.image_url to your API
    }
    setLoading(true);
    //log.info(config.BASE_URL);
    try {
      const response = await axios.post(
        `https://whale-app-88bu8.ondigitalocean.app/api/app/create/user/b2c`,
        // `https://whale-app-88bu8.ondigitalocean.app/create/user/b2c`,
        {
          name: name,
          email: email,
          mobile: phoneNumber,
          password: password,
        },
        { withCredentials: true }
      );
      log.info("response", response);

      log.info("response.data", response.data);

      if (response.status === 201) {
        setLoading(false);
        log.info("response.data.data", response.data);
        // log.info("response.user", response.user);
        // log.info("response.data.user", response.data.user);

        log.info("API call successful");
        //Alert.alert("Account Sucessfully created");
        //navigation.navigate(navigationString.LOGIN);
        //setItemToLocalStorage('user',response?.data?.user);
        //setUserId('')
        //fetchAuthuser();
        //showToast()
        fetchAuthuser();
        const userData = response.data;
        saveUserData(userData); // Save userData to the context
        navigation.navigate(navigationString.REGISTRATION_OTP, {
          data: response.data,
          user_exists: true,
          phoneNumber: `+91 ${phoneNumber}`,
        });
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
      log.info("Error in API call:", error.response);
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error",
        text2: error.response.data.message,
        visibilityTime: 4000, // 4 seconds
        autoHide: true,
      });
      //Alert.alert("try again later after some time");
      // Handle error if needed
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

  const getBlobFroUri = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    return blob;
  };
  const handleImageUpload = async () => {
    try {
      const result = await selectImage("Select Image");
      console.log(result, "result of image");
      // Update the state with the selected image and its URL
      if (!result.cancelled) {
        setSelectedImage({ image_url: result.uri });
        const blob = await getBlobFroUri(result.uri);
        console.log(blob, "blob");
        setImage(blob._data);
      }
    } catch (error) {
      // Handle error
      log.info("Error in image selection:", error);
    }
  };

  const selectImage = async (title) => {
    try {
      const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Disabling the crop option
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });

      if (!cancelled) {
        return { uri };
      } else {
        throw new Error("User cancelled image selection");
      }
    } catch (error) {
      throw new Error("Error in image selection: " + error.message);
    }
  };

  const goToLogin = () => {
    navigation.navigate(navigationString.LOGIN);
  };
  return (
    <Provider>
      <Portal>
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingTop: 50,
              paddingBottom: 10,
            }}
          >
            <MaterialIcons
              onPress={goBack}
              name=""
              size={24}
              color={config.primaryColor}
            />
            <Text style={styles.headingText}>Create an Account</Text>
            <MaterialIcons name="" size={27} color="white" />
          </View>
          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: config.secondry,
              }}
            >
              <ActivityIndicator size="large" color={config.primaryColor} />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={[
                  styles.buttonContainer,
                  { flexDirection: "row", justifyContent: "space-evenly" },
                ]}
              >
                <TouchableOpacity
                  onPress={() => handleOptionClick("B2B")}
                  style={[
                    styles.btnConrainer,
                    {
                      paddingVertical: "2%",
                      paddingHorizontal: "15%",
                      borderRadius: 16,
                      backgroundColor:
                        selectedOption === "B2B"
                          ? config.primaryColor
                          : "transparent",
                    },
                  ]}
                >
                  <Text
                    style={[
                      {
                        color: selectedOption === "B2B" ? "white" : "black",
                        fontWeight: "600",
                        fontSize: 15,
                      },
                    ]}
                  >
                    B2B
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleOptionClick("B2C")}
                  style={{
                    paddingVertical: "2%",
                    paddingHorizontal: "15%",
                    borderRadius: 16,
                    backgroundColor:
                      selectedOption === "B2C"
                        ? config.primaryColor
                        : "transparent",
                  }}
                >
                  <Text
                    style={[
                      {
                        color: selectedOption === "B2C" ? "white" : "black",
                        fontWeight: "600",
                        fontSize: 15,
                      },
                    ]}
                  >
                    B2C
                  </Text>
                </TouchableOpacity>
              </View>

              {selectedOption === "B2B" && (
                <View style={styles.registerContainer}>
                  <View style={styles.commonFieldMainBox}>
                    <View style={styles.commonFieldContainer}>
                      <TextInput
                        value={name}
                        onChangeText={(value) =>
                          setName(value.replace(/[^a-zA-Z ]/g, ""))
                        }
                        maxLength={20}
                        style={styles.commonField}
                        placeholder="Full Name"
                      />
                      <MaterialCommunityIcons
                        style={styles.commonIcon}
                        name="account"
                        size={20}
                      />
                    </View>
                    <View style={styles.commonFieldContainer}>
                      <TextInput
                        value={ownerName}
                        onChangeText={(value) => setOwnerName(value)}
                        maxLength={20}
                        style={styles.commonField}
                        placeholder="Company Name"
                      />
                      <MaterialCommunityIcons
                        style={styles.commonIcon}
                        name="account-circle"
                        size={20}
                      />
                    </View>

                    <View style={styles.phoneFieldContainer}>
                      <TextInput
                        maxLength={10}
                        keyboardType="numeric"
                        style={styles.phoneField}
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChangeText={(value) =>
                          setPhoneNumber(value.replace(/[^0-9]/g, ""))
                        }
                      />
                      <View style={styles.indiaIcon}>
                        <Text style={styles.nineOneText}>🇮🇳 + 9 1</Text>
                      </View>
                    </View>

                    <View style={styles.commonFieldContainer}>
                      <TextInput
                        style={styles.commonField}
                        //onChangeText={(value) => setPanNum(value)}
                        onChangeText={(value) => setPanNum(value.toUpperCase())}
                        keyboardType="defult"
                        //maxLength={10}
                        placeholder="Pan Number Optional"
                        value={panNum}
                      />
                      <FontAwesome5
                        style={{ ...styles.commonIcon, bottom: 15 }}
                        name="money-check"
                        size={15}
                      />
                    </View>
                    <View style={styles.commonFieldContainer}>
                      <TextInput
                        style={styles.commonField}
                        onChangeText={(value) =>
                          setEmail(value.replace(/[^a-zA-Z0-9@._-]/g, ""))
                        }
                        keyboardType="email-address" // This sets the keyboard to the email address format
                        maxLength={50} // Adjust the maximum length as needed
                        placeholder="Email"
                        value={email}
                      />
                      <FontAwesome5
                        style={{ ...styles.commonIcon, bottom: 15 }}
                        name="envelope"
                        size={15}
                      />
                    </View>
                    <View style={styles.commonFieldContainer}>
                      <TextInput
                        style={styles.commonField}
                        onChangeText={(value) => setPassword(value)}
                        secureTextEntry={true} // This hides the entered text for a password field
                        maxLength={20} // Adjust the maximum length as needed
                        placeholder="Password"
                        value={password}
                      />
                      <FontAwesome5
                        style={{ ...styles.commonIcon, bottom: 15 }}
                        name="lock"
                        size={15}
                      />
                    </View>
                    <View style={styles.commonFieldContainer}>
                      <TextInput
                        style={styles.commonField}
                        onChangeText={(value) => setAadharNum(value)}
                        keyboardType="defult"
                        //maxLength={12}
                        placeholder="Aadhar (3456 3456 3456) Opti.."
                        value={aadharNum}
                      />
                      <FontAwesome5
                        style={{ ...styles.commonIcon, bottom: 15 }}
                        name="address-card"
                        size={15}
                      />
                    </View>

                    <View style={styles.commonFieldContainer}>
                      <TextInput
                        style={styles.commonField}
                        onChangeText={(value) => setGstNum(value)}
                        keyboardType="defult"
                        //maxLength={10}
                        placeholder="Gst Number Optional"
                        value={gstNum}
                      />
                      <FontAwesome5
                        style={{ ...styles.commonIcon, bottom: 15 }}
                        name="id-card-alt"
                        size={15}
                      />
                    </View>

                    {/* <View style={styles.commonFieldContainer} >
                      <TextInput keyboardType='numeric'
                        style={styles.commonField}
                        placeholder='Upload Document' />
                      <FontAwesome name="image" size={21} style={styles.commonIcon} />
                    </View> */}
                    <View style={styles.commonFieldContainer}>
                      <TouchableOpacity onPress={handleImageUpload}>
                        <View style={styles.commonField}>
                          <FontAwesome
                            name="image"
                            size={21}
                            style={styles.commonIcon}
                          />

                          {selectedImage ? (
                            // <Image source={{ uri: selectedImage.image_url }} style={{ width: 50, height: 50 }} />
                            <Text style={styles.imageText}>
                              Image URL: {selectedImage.image_url}
                            </Text>
                          ) : (
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "flex-start",
                              }}
                            >
                              {/* <View>
                                <FontAwesome name="image" size={21} style={styles.commonIcon} />
                              </View> */}
                              <View>
                                <Text style={{ color: "gray" }}>
                                  Select Image
                                </Text>
                              </View>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>

                      {/* {selectedImage && (
        <Text style={styles.imageText}>Image URL: {selectedImage.image_url}</Text>
      )} */}

                      {/* Your other UI components... */}
                    </View>

                    <View style={styles.commonFieldContainer}>
                      <TextInput
                        keyboardType="default"
                        value={address}
                        style={styles.commonField}
                        placeholder="Address"
                        onChangeText={(value) => setAddress(value)}
                      />
                      <FontAwesome
                        name="address-card"
                        size={21}
                        style={styles.commonIcon}
                      />
                    </View>
                  </View>
                  <View style={styles.termsAndCondition}>
                    <Checkbox
                      color={config.primaryColor}
                      status={checked ? "checked" : "unchecked"}
                      onPress={() => {
                        setChecked(!checked);
                      }}
                    />
                    <Text style={{ fontSize: 12 }}>
                      Accept Terms & Conditions
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={handleCreateBtnB2B}
                    activeOpacity={0.8}
                    style={styles.signUpBtn}
                  >
                    <Text style={styles.signInText}>Create and Verify</Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity onPress={() => {
                    navigation.navigate(navigationString.SIGNUP_WITH_OTP);
                  }} activeOpacity={0.8} style={styles.signUpBtn}>
                    <Text style={styles.signInText}>Sign up with OTP</Text>
                  </TouchableOpacity> */}
                  <Text style={styles.orText}>or</Text>
                  <View style={styles.dontHaveAccountBox}>
                    <Text style={{ color: "gray" }}>
                      Already have an account?{" "}
                    </Text>
                    <Text
                      onPress={goToLogin}
                      style={{ color: config.primaryColor, fontWeight: "600" }}
                    >
                      Sign in{" "}
                    </Text>
                  </View>
                </View>
              )}
              {selectedOption === "B2C" && (
                <View style={styles.registerContainer}>
                  <View style={styles.commonFieldMainBox}>
                    <View style={styles.commonFieldContainer}>
                      <TextInput
                        value={name}
                        onChangeText={(value) =>
                          setName(value.replace(/[^a-zA-Z ]/g, ""))
                        }
                        maxLength={20}
                        style={styles.commonField}
                        placeholder="Full Name"
                      />
                      <MaterialCommunityIcons
                        style={styles.commonIcon}
                        name="account"
                        size={20}
                      />
                    </View>

                    <View style={styles.phoneFieldContainer}>
                      <TextInput
                        maxLength={10}
                        keyboardType="numeric"
                        style={styles.phoneField}
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChangeText={(value) =>
                          setPhoneNumber(value.replace(/[^0-9]/g, ""))
                        }
                      />
                      <View style={styles.indiaIcon}>
                        <Text style={styles.nineOneText}>🇮🇳 + 9 1</Text>
                      </View>
                    </View>

                    <View style={styles.commonFieldContainer}>
                      <TextInput
                        style={styles.commonField}
                        onChangeText={(value) =>
                          setEmail(value.replace(/[^a-zA-Z0-9@._-]/g, ""))
                        }
                        keyboardType="email-address" // This sets the keyboard to the email address format
                        maxLength={50} // Adjust the maximum length as needed
                        placeholder="Email"
                        value={email}
                      />
                      <FontAwesome5
                        style={{ ...styles.commonIcon, bottom: 15 }}
                        name="envelope"
                        size={15}
                      />
                    </View>

                    <View style={styles.commonFieldContainer}>
                      <TextInput
                        style={styles.commonField}
                        onChangeText={(value) => setPassword(value)}
                        secureTextEntry={true} // This hides the entered text for a password field
                        maxLength={20} // Adjust the maximum length as needed
                        placeholder="Password"
                        value={password}
                      />
                      <FontAwesome5
                        style={{ ...styles.commonIcon, bottom: 15 }}
                        name="lock"
                        size={15}
                      />
                    </View>

                    <View style={styles.commonFieldContainer}>
                      <TextInput
                        keyboardType="default"
                        style={styles.commonField}
                        placeholder="Address"
                        value={address}
                        onChangeText={(value) =>
                          setAddress(value.replace(/[^a-zA-Z0-9 ,.-]/g, ""))
                        }
                      />
                      <FontAwesome
                        name="address-card"
                        size={21}
                        style={styles.commonIcon}
                      />
                    </View>
                  </View>
                  <View style={{ height: 150 }}></View>

                  <View style={[styles.termsAndCondition]}>
                    <Checkbox
                      color={config.primaryColor}
                      status={checked ? "checked" : "unchecked"}
                      onPress={() => {
                        setChecked(!checked);
                      }}
                    />
                    <Text style={{ fontSize: 12 }}>
                      Accept Terms & Conditions
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={(event) => {
                      handleCreateBtnB2C(event);
                      log.info("button Clicked");
                    }}
                    activeOpacity={0.8}
                    style={styles.signUpBtn}
                  >
                    <Text style={styles.signInText}>Create and Verify</Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity onPress={() => {
                    navigation.navigate(navigationString.SIGNUP_WITH_OTP);
                  }} activeOpacity={0.8} style={styles.signUpBtn}>
                    <Text style={styles.signInText}>Sign up with OTP</Text>
                  </TouchableOpacity> */}
                  <Text style={styles.orText}>or</Text>
                  <View style={styles.dontHaveAccountBox}>
                    <Text style={{ color: "gray" }}>
                      Already have an account?{" "}
                    </Text>
                    <Text
                      onPress={goToLogin}
                      style={{ color: config.primaryColor, fontWeight: "600" }}
                    >
                      Sign in{" "}
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>
          )}
        </View>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.containerStyle}
        >
          <View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#222",
                textAlign: "center",
              }}
            >
              {" "}
              User Already Exists{" "}
            </Text>
            <View>
              <View style={{ paddingTop: 8, paddingBottom: 13 }}>
                <Text style={{ textAlign: "center", color: "gray" }}>
                  {" "}
                  Phone number you entered
                </Text>
                <Text style={{ textAlign: "center", color: "gray" }}>
                  is already registered
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setModalVisible(false)}
              >
                <View
                  style={{
                    paddingTop: 6,
                    borderTopColor: "#f2f2f2",
                    borderTopWidth: 1,
                  }}
                >
                  <Text
                    style={{
                      color: config.primaryColor,
                      textAlign: "center",
                      fontSize: 14,
                      fontWeight: "700",
                    }}
                  >
                    OK
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
}

export default Register;

const styles = StyleSheet.create({
  registerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: 30,
  },
  containerStyle: {
    backgroundColor: "white",
    paddingTop: 15,
    paddingBottom: 12,
    marginHorizontal: 80,
    borderRadius: 10,
    zIndex: 2,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headingText: {
    color: config.primaryColor,
    fontSize: 17,
    letterSpacing: 1,
    fontWeight: "500",
  },
  registerHeading: {
    fontSize: 20,
    fontWeight: "600",
  },
  commonFieldMainBox: {
    marginTop: 12,
    width: "100%",
  },
  phoneFieldContainer: {
    position: "relative",
    width: "100%",
  },
  indiaIcon: {
    position: "absolute",
    bottom: 15,
    left: 15,
  },
  nineOneText: {
    fontSize: 14,
  },
  phoneField: {
    width: "100%",
    marginTop: 15,
    paddingHorizontal: 79,
    paddingVertical: 9,
    fontSize: 14,
    backgroundColor: "#f5f5f6",
    letterSpacing: 2,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: "lightgray",
  },
  commonFieldContainer: {
    position: "relative",
    width: "100%",
  },
  commonField: {
    width: "100%",
    marginTop: 15,
    paddingHorizontal: 40,
    paddingVertical: 9,
    fontSize: 14,
    backgroundColor: "#f5f5f6",
    letterSpacing: 2,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: "lightgray",
  },
  commonIcon: {
    position: "absolute",
    bottom: 12,
    left: 15,
    color: "#555",
  },
  signUpBtn: {
    width: "100%",
    marginTop: 10,
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
  },
  dontHaveAccountBox: {
    flexDirection: "row",
    // marginTop:10,
  },
  termsAndCondition: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 10,
  },
});

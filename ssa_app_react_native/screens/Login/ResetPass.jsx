import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Provider, Portal } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { config } from "../../config";
import Toast from "react-native-toast-message";
import { setPhone, phone } from "../../global/GlobalContext";
import axios from "axios";

const ResetPass = ({ route, navigation }) => {
  const { phoneNumber } = route.params;
  console.log("phoneNumber", phoneNumber);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordRegex =
    /^(?=(.*[a-zA-Z]{2}))(?=.*\d)(?=.*(\*))(?=.*(^))(?=.*(%))(?=.*(#))(?=.*($))(?=.*(@))$/;
  const { phone } = route.params;
  const handleNewPasswordChange = (value) => {
    setNewPassword(value);
    if (value.length < 6) console.log("Min length 6");
    else if (!passwordRegex.test(value))
      console.log(
        "Must contain 1 UpperCase, 1 LowerCase, 1 Number, 1 Special Character"
      );
  };

  const handleConfirmPasswordChange = (value) => setConfirmPassword(value);

  const handleChangePassword = async () => {
    console.log("clicked");
    console.log("clicked");

    if (newPassword === confirmPassword) {
      try {
        const response = await axios.patch(
          `${config.BASE_URL}app/update-password `,
          {
            phoneNumber: phoneNumber,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.statusCode === 200) {
          Toast.show({
            type: "success",
            position: "top",
            text1: "Success",
            text2: response.data.message,
            visibilityTime: 4000, // 4 seconds
            autoHide: true,
          });
        } else {
          console.log("Failed to update password, try again later:", response);
        }
      } catch (error) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2: error.response.data.message,
          visibilityTime: 4000, // 4 seconds
          autoHide: true,
        });
        //console.log(error,"errormsj");
      }
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error",
        text2: "Passwords do not match",
        visibilityTime: 4000, // 4 seconds
        autoHide: true,
      });
    }
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
              onPress={() => navigation.goBack()}
              name="keyboard-arrow-left"
              size={27}
              color={config.primaryColor}
            />
            <Text style={styles.headingText}>Change Password</Text>
            <MaterialIcons name="keyboard-arrow-left" size={27} color="white" />
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.loginContainer}>
              <Text style={styles.textheading}>Enter New Password</Text>
              <View style={styles.commonFieldContainer}>
                <TextInput
                  editable={true}
                  placeholder=""
                  placeholderTextColor="gray"
                  value={newPassword}
                  onChangeText={handleNewPasswordChange}
                  style={styles.commonField}
                />
              </View>

              <Text style={styles.textheading}>Re-enter Password</Text>
              <View style={styles.commonFieldContainer}>
                <TextInput
                  editable={true}
                  placeholder=""
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
                  style={styles.commonField}
                />
              </View>

              <TouchableOpacity
                style={styles.signUpBtn}
                onPress={handleChangePassword}
              >
                <Text style={{ color: "white", fontWeight: "600" }}>
                  Change Password
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Portal>
    </Provider>
  );
};
export default ResetPass;

const styles = StyleSheet.create({
  commonFieldContainer: {
    position: "relative",
    width: "100%",
  },
  headingText: {
    color: config.primaryColor,
    fontSize: 17,
    letterSpacing: 1,
    fontWeight: "500",
  },
  loginContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: 30,
    marginTop: "30%",
  },
  headerContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    padding: "2%",
    justifyContent: "flex-start",
    alignContent: "center",
    alignItems: "center",
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
  heading: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
    marginLeft: "5%",
  },
  container: {
    backgroundColor: "gray",
    paddingHorizontal: "3%",
    paddingVertical: "8%",
    height: "80%",
  },
  textheading: {
    color: "gray",
    fontSize: 14,
    fontWeight: "bold",
  },
  inputContainter: {
    width: "100%",
    backgroundColor: "gray",
    borderRadius: 46,
    padding: "2%",
    marginTop: "2%",
    borderColor: "gray",
    borderWidth: 2,
    fontSize: 22,
  },
  buttonContainer2: {
    width: "100%",
    backgroundColor: "gray",
    borderRadius: 40,
    padding: "2%",
    fontSize: 22,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  buttonText: {
    color: "gray",
    fontSize: 22,
  },
  validationMessage: {
    color: "red",
    fontSize: 15,
  },
  commonField: {
    width: "100%",
    marginTop: 15,
    paddingHorizontal: 45,
    paddingVertical: 9,
    fontSize: 14,
    backgroundColor: "#f5f5f6",
    letterSpacing: 2,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: "lightgray",
  },
});

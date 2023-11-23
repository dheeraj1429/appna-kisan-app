import React,{useState,useEffect} from "react";
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
  BackHandler
} from "react-native";
import { config } from "../../config";
import {Modal, Portal,Provider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";
import navigationString from "../../Constants/navigationString";
import { setItemToLocalStorage } from "../../Utils/localstorage";
import axios from "axios";


function Login({navigation}) {
  const [ phoneNumber , setPhoneNumber ] = useState('')
  const [modalVisible, setModalVisible] = useState(false);
  const [ loading , setLoading ] = useState(false);
  
  console.log('phoneNumber',phoneNumber);

  const goBack = () => {
    // navigation.goBack();
    BackHandler.exitApp()
  };
  const handleSignup=async()=>{
    if(phoneNumber.length >= 10){
      
     await axios.get(`${config.BACKEND_URI}/api/app/check/user/exists/${phoneNumber}`,{withCredentials:true})
      .then(res=>{
        console.log(res?.data)
        if(res?.data?.user_exists){
          setLoading(false);
          navigation.navigate(navigationString.OTP_SCREEN,{user_exists:true,phoneNumber:`+91 ${phoneNumber}`});
        }else{
          setLoading(false);
          setModalVisible(true)
        }
      })
      .catch(err=>{
        console.log(err);
        setLoading(false);
      })
      
      // navigation.navigate(navigationString.OTP_SCREEN,{phoneNumber:`+91 ${phoneNumber}`});
    }
    else{
      ToastAndroid.showWithGravityAndOffset(
        "Enter a Valid Phone number!!",
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
        25,
        50
      );

    }
  }

  const goToRegister=()=>{
    navigation.navigate(navigationString.REGISTER)
  }
  return (
    <Provider>
    <Portal>
    <View style={{flex:1,backgroundColor:'#fff'}} >
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:10,paddingTop:50,paddingBottom:10}} >
<MaterialIcons  onPress={goBack} name="close" size={24} color={config.primaryColor} />
<Text style={styles.headingText} >Continue with Phone</Text>
<MaterialIcons  name="keyboard-arrow-left" size={27} color='white' />
</View>
    {
      loading ?
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}} >
      <ActivityIndicator size='large' color={config.primaryColor} />
     </View>
      :
      <View style={styles.loginContainer}>
    

      <Text style={styles.loginHeading}>Sign in to Your Account</Text>
      <View style={styles.phoneFieldContainer}>
        <TextInput
           maxLength={10}
          keyboardType="numeric"
          style={styles.phoneField}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={(value)=>setPhoneNumber(value.replace(/[^0-9]/g,''))}
        />
        <View style={styles.indiaIcon}>
          <Text style={styles.nineOneText}>🇮🇳 + 9 1</Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleSignup} activeOpacity={0.8} style={styles.signUpBtn}>
        <Text style={styles.signInText}>Sign in</Text>
      </TouchableOpacity>
      {/* <Text style={styles.codeText} >Code has been send to +91 ******4800</Text> */}
      {/* <TextInput
        maxLength={6}
          keyboardType="numeric"
          style={styles.otpFieldInput}
          placeholder="0"
        /> */}
      {/* <View style={styles.otpContainer}>
        <TextInput
        maxLength={1}
          keyboardType="numeric"
          style={styles.otpField}
          placeholder="0"
        />
        <TextInput
        maxLength={1}
          keyboardType="numeric"
          style={styles.otpField}
          placeholder="0"
        />
        <TextInput
        maxLength={1}
          keyboardType="numeric"
          style={styles.otpField}
          placeholder="0"
        />
        <TextInput
        maxLength={1}
          keyboardType="numeric"
          style={styles.otpField}
          placeholder="0"
        />
        <TextInput
        maxLength={1}
          keyboardType="numeric"
          style={styles.otpField}
          placeholder="0"
        />
        <TextInput
        maxLength={1}
          keyboardType="numeric"
          style={styles.otpField}
          placeholder="0"
        />
      </View> */}
      {/* <View style={styles.otpResend}>
        <Text style={{ color: "gray" }}>Can't received? </Text>
        <Text style={{ color: config.primaryColor, fontWeight: "600" }}>
        Resend OTP
        </Text>
      </View>
      <TouchableOpacity activeOpacity={0.8} style={styles.signUpBtn}>
        <Text style={styles.signInText}>Verify OTP </Text>
      </TouchableOpacity> */}
      <Text style={styles.orText}>or</Text>
      <View style={styles.dontHaveAccountBox}>
        <Text style={{ color: "gray" }}>Don't have an account? </Text>
        <Text onPress={goToRegister} style={{ color: config.primaryColor, fontWeight: "600" }}>
          Sign up{" "}
        </Text>
      </View>
    </View>
    }
    </View>
     <Modal visible={modalVisible} onDismiss={()=>setModalVisible(false)} contentContainerStyle={styles.containerStyle}>
     <View>
     <Text style={{fontSize:16,fontWeight:'700',color:'#222',textAlign:'center'}} > User Not Exists </Text>
       <View  >
       <View style={{paddingTop:8,paddingBottom:13}} >
       <Text style={{textAlign:'center',color:'gray'}} > Phone number you entered</Text>
       <Text style={{textAlign:'center',color:'gray'}}  >is not registered !!</Text>
       </View>
      <TouchableOpacity activeOpacity={0.5} onPress={()=>setModalVisible(false)} >
        <View style={{paddingTop:6,borderTopColor:'#f2f2f2',borderTopWidth:1}} >
          <Text style={{color:config.primaryColor,textAlign:'center',fontSize:14,fontWeight:'700'}} >OK</Text>
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
  },
  headingText:{
    color:config.primaryColor,
    fontSize:17,
    letterSpacing:1,
    fontWeight:'500',
  },
  containerStyle:{
    backgroundColor: 'white',
  paddingTop: 15,
  paddingBottom:12,
  marginHorizontal:80,
  borderRadius:10,
zIndex:2
},
  loginHeading: {
    marginTop:10,
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
  codeText:{
    marginTop:15,
    fontSize:12
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
  otpFieldInput:{
    width:100,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "lightgray",
    marginHorizontal: 5,
    backgroundColor: "#f5f5f6",
    paddingVertical: 10,
    textAlign: "center",
  },
  otpResend:{
    flexDirection:'row',
    marginTop:16
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

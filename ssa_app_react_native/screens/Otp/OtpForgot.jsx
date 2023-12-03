import React,{useState,useEffect} from "react";
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

function OtpForgot({route,navigation}) {
    // const {user_name,user_exists} = route.params;
    //const {phoneNumber,name,user_exists,email,password} = route.params;
    const [ loading , setLoading ] = useState(false);
    const [ verifyOtpLoading , setVerifyOtpLoading ] = useState(false);
    const [ autoverifyingLoading , setAutoverifyingLoading ] = useState(false);
    const [ resend , setResend ] = useState(false);
    const [confirm, setConfirm] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [existingUser, setExistingUser] = useState();
    const [ getUserID , setGetUserID ] = useState('')
    const [ userId , setUserId ] = useState('');
    const [ timer , setTimer ] = useState(25);
    const {authState,fetchAuthuser} = UseContextState();
// let phoneNumber = '919800980098'
    const goBack = () => {
        navigation.goBack();
      };

   function showAutoVerifyingScreen(){
    setAutoverifyingLoading(true)
    setTimeout(()=>{
      setAutoverifyingLoading(false)

    },25000)
   }

   useEffect(()=>{
    showAutoVerifyingScreen()
   },[])


   useEffect(() => {
    let interval = setInterval(() => {
      setTimer(lastTimerCount => {
          lastTimerCount <= 1 && clearInterval(interval)
          return lastTimerCount - 1
      })
    }, 1000) //each count lasts for a second
    //cleanup the interval on complete
    return () => {clearInterval(interval);setTimer(30)}
  }, []);


      useEffect(()=>{
            // signInWithPhoneNumber(phoneNumber);
            signInWithPhoneNumberCustom(phoneNumber);
            setResend(false)
       

        },[phoneNumber,resend])

       const logOutFirebase = () => {
          firebase.auth().signOut();
      }
      
        function onAuthStateChanged(user) {
          if (user) {
            setExistingUser(user)
            logOutFirebase()

            console.log("USERRRRRRR--",user)
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
                    if(user_exists){
                      console.log("LOGIN CALLED")
                       loginUser();
                      setVerifyOtpLoading(false)
                      return;
                    }
                    if(!user_exists){
                      console.log("SIGN UP CALLED")
                       registerUser();
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
          console.log("CONFIRMATION++++++++",confirmation)
          setConfirm(confirmation);
        }



    const resendOtp = async()=>{
        console.log("Resend otp")
        setCode('')
        setLoading(true)
        setInterval(()=>{
          setLoading(false)
        },3000)
        setResend(prev=>!prev)
      }

      // manually verify
      const verifyManuallyOtp=async()=>{
        const confirmation = await firebase.auth().signInWithPhoneNumber(phoneNumber);
              setConfirm(confirmation);
              console.log(confirmation,"CONFIRMATION")
      }

  const confirmCode=async()=>{
    setVerifyOtpLoading(true)
    if(code?.length < 6 ){
      ToastAndroid.showWithGravityAndOffset(
        "Enter a Valid Otp !!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    } 
    console.log("VERIFIED SUCCESS+>",otp,code)
    try {
      console.log("CODE+>",code)
      await confirm.confirm(code);
      if(user_exists){
        console.log("LOGIN CALLED")
        await loginUser();
        setVerifyOtpLoading(false)
        return;
      }
      if(!user_exists){
        console.log("SIGN UP CALLED")
        await registerUser();
        setVerifyOtpLoading(false)
      return;
      }

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
  const loginUser=async()=>{
    await axios.get(`${config.BACKEND_URI}/api/app/login/user/${phoneNumber}`,{withCredentials:true})
    .then(res=>{
     console.log(res?.data);
     if(res?.data?.status){
         setItemToLocalStorage('user',res?.data?.user);
         setUserId('')
         fetchAuthuser();
         showToast()
        //  navigation.navigate(navigationString.HOME);
     }
    })
    .catch(err=>{
     console.log(err);
    })
  }

  // REGISTER USER FUCNC
  const registerUser=async()=>{
    let data = {
      name:name,
      mobile:phoneNumber,
      email:email,
      password:password
  }
  await axios.get(`${config.BASE_URL}/app/create/user/b2c`, { withCredentials: true }) .then(res=>{
  console.log(res?.data);
  if(res?.data?.status){
      setItemToLocalStorage('user',res?.data?.user);
      setUserId('')
      fetchAuthuser()
      showToast()
      // setVerifyOtpLoading(false)
      // navigation.navigate(navigationString.HOME);
  }
 })
 .catch(err=>{
  console.log(err);
 })
  }



  return (
    <View style={styles.screenContainer}>
    { loading && <View style={{position:'absolute',top:'0%',bottom:'0%',left:'0%',right:'0%',zIndex:2,justifyContent:'center',alignItems:'center',backgroundColor: 'rgba(52, 52, 52, 0.3)',padding:14,borderRadius:8}} >
   <View style={{paddingTop:190}} >
   <ActivityIndicator color={config.primaryColor} size='large' />
    <Text  >Resending otp...</Text>
   </View>
    </View> 
    }

{ verifyOtpLoading && <View style={{position:'absolute',top:'0%',bottom:'0%',left:'0%',right:'0%',zIndex:2,justifyContent:'center',alignItems:'center',backgroundColor: 'rgba(52, 52, 52, 0.3)',padding:14,borderRadius:8}} >
   <View style={{paddingTop:190}} >
   <ActivityIndicator color={config.primaryColor} size='large' />
    <Text  >Verifying otp...</Text>
   </View>
    </View> 
    }
<StatusBar backgroundColor="#fff" />

<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:10,paddingTop:50,paddingBottom:10}} >
<MaterialIcons  onPress={goBack} name="keyboard-arrow-left" size={27} color={config.primaryColor} />
<Text style={styles.headingText} >Verify</Text>
<MaterialIcons  name="keyboard-arrow-left" size={27} color='white' />
</View>
<ScrollView showsVerticalScrollIndicator={false}
>
<View style={{paddingHorizontal:20,paddingTop:40}} >
      <Text style={styles.codeText} >Code has been send to {phoneNumber}</Text>

    {autoverifyingLoading ?
    <View>
    <View style={styles.commonFieldContainer} >
    <TextInput 
    value={code} onChangeText={text => setCode(text.replace(/[^0-9]/g,''))}
     maxLength={6}
     keyboardType='number-pad'
     style={styles.commonField} placeholder='Detecting Your Otp*' />
      <MaterialIcons style={styles.commonIcon} name="lock" size={20} />
    </View>
    <View style={{paddingTop:12}} >
       <ActivityIndicator color={config.primaryColor} size='large' />
       <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',paddingTop:12,}} >
       <Text style={{color:config.primaryColor,fontSize:16,paddingRight:3}} >{timer}</Text>
    <Text style={{color:'gray',textAlign:'center',fontSize:16}} >Auto Detecting otp...</Text>
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
value={code} onChangeText={text => setCode(text.replace(/[^0-9]/g,''))}
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
      <TouchableOpacity onPress={()=>confirmCode()} activeOpacity={0.8} style={styles.signUpBtn}>
        <Text style={styles.signInText}>Verify and Sign In </Text>
      </TouchableOpacity>
      </View>
    }
   </View>
{/* for extra spacing */}
<View style={{paddingBottom:20}} ></View>
{/* for extra spacing */}
</ScrollView>
</View>




   
  )
}

export default OtpForgot

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
      commonFieldContainer:{
        position:'relative',
        width:'100%'
      },
      commonField:{
        width:'100%',
        marginTop:15,
        paddingHorizontal:45,
        paddingVertical:9,
        fontSize:14,
        // textTransform:'capitalize',
        backgroundColor:'#f5f5f6',
        letterSpacing:1.5,
         borderRadius: 16,
        borderWidth:0.5,
        borderColor:'lightgray'
      },
      commonIcon:{
        position:'absolute',
        bottom:12,
        left:15,
        color:'#555'
      },
    
      signInText: {
        fontSize: 15,
        fontWeight: "600",
        letterSpacing: 1,
        color: "white",
      },
      codeText:{
        marginTop:15,
        fontSize:16,
        fontWeight:'500',
        color:'gray',
        textAlign:'center',
        paddingVertical:30
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
        marginVertical:26,
        alignItems:'center',
        justifyContent:'center'
        
      },
      screenContainer: {
        backgroundColor: "white",
        flex: 1,    
      },
      headingText:{
        color:config.primaryColor,
        fontSize:17,
        letterSpacing:1,
        fontWeight:'600',
      },
      commonFieldMainBox:{
        marginTop:12,
        width:'100%',
        paddingHorizontal:20,
      },
      phoneFieldContainer:{
        position:'relative',
        width:'100%'
      },
      indiaIcon:{
        position:'absolute',
        bottom:14,
        left:15
      },
      nineOneText:{
        fontSize:14,
    
      },
      phoneField:{
        width:'100%',
        marginTop:15,
        paddingHorizontal:79,
        paddingVertical:9,
        fontSize:14,
        backgroundColor:'#f5f5f6',
        letterSpacing:1.5,
         borderRadius: 16,
        borderWidth:0.5,
        borderColor:'lightgray'
    
      },
      commonFieldContainer:{
        position:'relative',
        width:'100%'
      },
      commonField:{
        width:'100%',
        marginTop:15,
        paddingHorizontal:45,
        paddingVertical:9,
        fontSize:14,
        // textTransform:'capitalize',
        backgroundColor:'#f5f5f6',
        letterSpacing:1.5,
         borderRadius: 16,
        borderWidth:0.5,
        borderColor:'lightgray'
      },
      commonIcon:{
        position:'absolute',
        bottom:12,
        left:15,
        color:'#555'
      },
    
      checkouttext:{
        fontSize:15,
        fontWeight:'600',
        letterSpacing:1.5,
        color:'white'
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


   
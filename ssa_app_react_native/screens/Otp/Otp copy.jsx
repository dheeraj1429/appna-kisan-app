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

function Otp({route,navigation}) {
    const {phoneNumber,user_name,user_exists} = route.params;
    const [ loading , setLoading ] = useState(false);
    const [ verifyOtpLoading , setVerifyOtpLoading ] = useState(false);
    const [ resend , setResend ] = useState(false);
    const [confirm, setConfirm] = useState(null);
    const [otp, setOtp] = useState('');
    const [code, setCode] = useState('');
    const [ getUserID , setGetUserID ] = useState('')
    const [ userId , setUserId ] = useState('');
    const {authState,fetchAuthuser} = UseContextState();

    const goBack = () => {
        navigation.goBack();
      };

    //   useEffect(()=>{
      
    //   },[])

    // const logOutFirebase = () => {
    //     firebase.auth().signOut();
    //     if (firebase.auth().currentUser)
    //         firebase.auth().currentUser.delete();
    //     console.log("LOG OUT SESSION CALLED")
    // }

      useEffect(()=>{
            signInWithPhoneNumber(phoneNumber);
            setResend(false)

        },[phoneNumber,resend])


      

      const signInWithPhoneNumber=async(phone)=>{
        // const confirmation = await auth().verifyPhoneNumber(phoneNumber);
        // const confirmation = await auth().signInWithPhoneNumber(phoneNumber,false);
        // setConfirm(confirmation);
        // console.log(confirmation,"CONFIRMATION")

       const newConfirmation = firebase.auth()
        .verifyPhoneNumber(phoneNumber)
        .on('state_changed', async(phoneAuthSnapshot) => {
          // console.log(newConfirmation,"newConfirmation")
          // setConfirm(newConfirmation);
          switch (phoneAuthSnapshot.state) {
            // ------------------------
            //  IOS AND ANDROID EVENTS
            // ------------------------
            case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
            console.log('CODE_SENT code sent');

            const credentials = firebase.auth.PhoneAuthProvider
            console.log(credentials,"credentials")

            
              // on ios this is the final phone auth state event you'd receive
              // so you'd then ask for user input of the code and build a credential from it
              // as demonstrated in the `signInWithPhoneNumber` example above
              break; 
            case firebase.auth.PhoneAuthState.ERROR: // or 'error'
              console.log('ERROR verification error');
              console.log(phoneAuthSnapshot.error);
              setVerifyOtpLoading(false)
              break;
      
            // ---------------------
            // ANDROID ONLY EVENTS
            // ---------------------
            case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
                const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
                setConfirm(confirmation);
                console.log(confirmation,"CONFIRMATION")
            console.log('auto verify on android timed out');

            // proceed with your manual code input flow, same as you would do in
            // CODE_SENT if you were on IOS
            break;
            case firebase.auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
            console.log("AUTO VERIFIED CALLED")
              // auto verified means the code has also been automatically confirmed as correct/received
              // phoneAuthSnapshot.code will contain the auto verified sms code - no need to ask the user for input.
              setVerifyOtpLoading(true)
              // console.log(phoneAuthSnapshot);
              const { verificationId, code } = phoneAuthSnapshot;
              const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
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
              break;
          }
        }, (error) => {
          console.log(error);
          // verificationId is attached to error if required
          console.log(error.verificationId);
        }, (phoneAuthSnapshot) => {
          // console.log(phoneAuthSnapshot);
          setVerifyOtpLoading(false)
          // alert('Invalid code.');
        });
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
      username:user_name,
      phone_number:phoneNumber,
  }
 await axios.post(`${config.BACKEND_URI}/api/app/create/user`,data,{withCredentials:true})
 .then(res=>{
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
{/* for extra spacing */}
<View style={{paddingBottom:20}} ></View>
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


   
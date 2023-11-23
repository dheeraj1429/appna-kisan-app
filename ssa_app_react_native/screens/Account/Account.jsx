import React,{useState,useEffect,useCallback} from "react";
import { View, Text,ActivityIndicator, SafeAreaView,Linking, Image, StyleSheet, TouchableOpacity, PermissionsAndroid } from "react-native";
import { Surface, Avatar,Modal, Portal,Provider  } from "react-native-paper";
import { Octicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { config } from "../../config";
import { Feather } from "@expo/vector-icons";
import imageImport from "../../Constants/imageImport";
import strings from "../../Constants/strings";
import { UseContextState } from "../../global/GlobalContext";
import navigationString from "../../Constants/navigationString";
import {launchCamera ,launchImageLibrary} from 'react-native-image-picker';
import { uploadFileToFirebase } from "../../Utils/helperFunctions";
import storage from '@react-native-firebase/storage';
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";


function Account({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [contactUsModalVisible, setContactUsModalVisible] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading , setLoading ] = useState(false);
  const [render , setRender ] = useState(false);
  const [getUserProfile , setGetUserProfile ] = useState()
  const {logoutAuthUser,authState} = UseContextState();
  console.log("authStateauthStateauthStateauthState",authState?.user)

  // const clickToLogout =async ()=>{
  //   await logoutAuthUser()
  // }
  console.log("getUserProfile",getUserProfile)

  // get user profile picture
  useFocusEffect(
    useCallback(()=>{
      axios.get(`${config.BACKEND_URI}/api/app/get/auth/user/profile/picture/${authState?.user?._id}`,{withCredentials:true})
      .then(res=>{
        console.log(res?.data);
        if(res?.data?.profile){
          setGetUserProfile(res?.data?.profile)
        }
        if(!res?.data?.profile){
          setGetUserProfile(null)
        }
      })
      .catch(err=>{
        console.log(err);
      })
      
    },[render])
  )


  // useEffect(()=>{
  //   axios.get(`${config.BACKEND_URI}/api/get/auth/user/profile/picture/${authState?.user?._id}`,{withCredentials:true})
  //   .then(res=>{
  //     console.log(res?.data);
  //     setGetUserProfile(res?.data)
  //   })
  //   .catch(err=>{
  //     console.log(err);
  //   })
  // },[render])

  // UPLOAD IMAGE TO FIREBASE THEN DUMP INTO DB
  const uploadProfile = async()=>{
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
        return
      }
    } catch (err) {
      console.log(err);
    }
    let _image = await launchImageLibrary({
      mediaTypes: 'image',
      allowsEditing: true,
      aspect: [4,3],
      quality: 1,
    });
    if(!_image?.assets) return 
    // console.log("JSON.stringify(_image)",JSON.stringify(_image));
    // console.log("JSON.stringify(_image)22222",_image?.assets[0].uri);
    let profileUploadToFirebase;
    if (!_image.cancelled) {
      setProfilePicture(_image);
      // profileUploadToFirebase = await uploadFileToFirebase(`/ssastore/users/${authState?.user?._id}/`,_image?.assets[0]);
       // console.log("FILE UPLOADED FUNCTION-----------",everyFile)
    const currentDate = new Date().toUTCString()
    const path = `/ssastore/users/${authState?.user?._id}/`
    const everyFile = _image?.assets[0]
    const fileRef = storage().ref(`${path}${currentDate}--${everyFile?.fileName}`)
  const uploadUri = Platform.OS === 'ios' ? everyFile.uri.replace('file://', '') : everyFile.uri;
    const task = fileRef.putFile(uploadUri);
    task.on('state_changed', taskSnapshot => {
      // console.log(`${taskSnapshot.bytesTransferred} transferred 
      // out of ${taskSnapshot.totalBytes}`);
    });
    let downloadURL;
    task.then(() => {
      console.log('Image uploaded to the bucket!');
        }).then(async()=>{
          await fileRef.getDownloadURL()
          .then(async resultUrl=>{
            // console.log("downloaddownloaddownloaddownload",resultUrl)
            downloadURL= resultUrl
            profileUploadToFirebase =  {image_name:currentDate+"--"+everyFile?.fileName,image_url:downloadURL,path:path}
            console.log("-------------------------------------------------------------------9",profileUploadToFirebase)
            setLoading(true)
            axios.patch(`${config.BACKEND_URI}/api/app/edit/user/profile/picture/by/id/${authState?.user?._id}`,{...profileUploadToFirebase},{withCredentials:true})
              .then(res=>{
                console.log("RESPONSE=============================",res?.data?.previousProfile);
                setLoading(false)
                setRender(prev=>!prev)
                // setRefreshing(false)

                // Create a reference to the file to delete
                    let desertRef = storage().ref(`${res?.data?.previousProfile?.path}${res?.data?.previousProfile?.image_name}`);

                    // Delete the file
                    desertRef.delete().then(function() {
                      // File deleted successfully
                      console.log("image deleted")
                    }).catch(function(error) {
                      // Uh-oh, an error occurred!
                      console.log(" Uh-oh, an error occurred!",error)
                    });




              })
              .catch(err=>{
                console.log(err);
                // setRefreshing(false)
              })


           })
        })
        



    }
    // console.log("profileUploadToFirebase=>>>>>>",profileUploadToFirebase)
  
    }

    // console.log("profilePicture=====",profilePicture)

  return (
    <Provider>
    <Portal>
    <View style={styles.screenContainer}>
      {/* {loading &&   <View style={{justifyContent:'center',alignItems: "center",height:'70%'}} >
    <ActivityIndicator color={config.primaryColor} />

  </View>} */}
      <Surface style={styles.accountHeader}>
        <Text style={styles.accountHeadingText}> My Account</Text>
        <TouchableOpacity activeOpacity={0.6} onPress={()=>navigation.navigate(navigationString.SEARCH_SCREEN)}  >
      <Octicons
        style={{paddingRight: 10}}
        name="search"
        size={20}
        color={config.primaryColor}
      />
      </TouchableOpacity>
      </Surface>
      <View style={styles.mainContainer}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWithUser}>
            {/* <Avatar.Image style={{backgroundColor:'#fff'}} size={60} source={imageImport.UserDefaultImage} /> */}
         <TouchableOpacity onPress={uploadProfile} activeOpacity={0.6} >

          {profilePicture?.assets ?
              <Image 
              source={{uri:profilePicture?.assets[0].uri}}
              style={{width:56,height:55,borderRadius:40}}
              />
            :
            getUserProfile?.image_url ?
            <Image 
            source={{uri:getUserProfile?.image_url}}
            style={{width:56,height:55,borderRadius:40}}
            />
            :

            <Image 
            source={imageImport.UserDefaultImage}
            style={{width:56,height:55,borderRadius:40}}
            />

        }
        
          </TouchableOpacity>
            <View style={styles.userTextBox} >

            <Text style={styles.userText}>Hello {authState?.user?.username?.slice(0,14)}</Text>
            <Text style={styles.phoneNumber}>{authState?.user?.phone_number}</Text>
            </View>
          </View>
          <TouchableOpacity activeOpacity={0.6} onPress={()=>navigation.navigate(navigationString.EDIT_PROFILE)}  >
          <MaterialIcons name="keyboard-arrow-right" size={29} color="#1e1e1e" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.listBox}>
           <View style={styles.changeLanguageBox}>
           {/* <Ionicons name="ios-information-circle-outline" size={24} color={config.primaryColor}/> */}
           <AntDesign name="infocirlceo" size={24} color={config.primaryColor} />
          <Text  style={styles.languageText}>About Us</Text>
        </View>
         <View style={styles.changeLanguageBox}>
          <Feather name="phone-call" size={24} color={config.primaryColor} />
          <Text onPress={()=>setContactUsModalVisible(true)} style={styles.languageText}>Contact Us</Text>
        </View>
     
        <View style={styles.changeLanguageBox}>
          <MaterialIcons
            style={styles.headerIcon2}
            name="security"
            size={24}
            color={config.primaryColor}
          />
          <Text style={styles.languageText}>Terms & Conditions</Text>
        </View>
        <View style={styles.changeLanguageBox}>
          <MaterialIcons
            style={styles.headerIcon2}
            name="security"
            size={24}
            color={config.primaryColor}
          />
          <Text style={styles.languageText}>Privacy Policy</Text>
        </View>
        <TouchableOpacity activeOpacity={0.6} onPress={()=>setModalVisible(true)} style={styles.changeLanguageBox}>
          <MaterialIcons
            style={styles.headerIcon2}
            name="exit-to-app"
            size={24}
            color={config.primaryColor}
          />
          <Text style={styles.languageText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.logBox}>
        <Image
          style={styles.logoImage}
          source={imageImport.LogoAccountScreen}
        />
        <Text style={styles.versionText} >Version: {strings.APP_VERSION}</Text>
      </View>
    </View>
    {/*========== CONTACT MODAL =========== */}
    <Modal visible={contactUsModalVisible} onDismiss={()=>setContactUsModalVisible(false)} contentContainerStyle={styles.containerStyle}>
  
    
     <View style={{flexDirection:'column',alignItems:'flex-start'}} >
       <TouchableOpacity onPress={()=>Linking.openURL(strings.CALLUS)}  activeOpacity={0.6} style={styles.chatnowAndCallusIconBox} >
         <Feather name="phone-call" size={30}  color={config.primaryColor}/>
        <Text style={styles.chatnowAndCallusText} >Call Us</Text>
        </TouchableOpacity>
       <TouchableOpacity onPress={()=>Linking.openURL(strings.WHATSAPP)}  activeOpacity={0.6} style={{...styles.chatnowAndCallusIconBox,  borderTopWidth:0.5, borderColor:'lightgray',}} >
       <FontAwesome name="whatsapp" size={30}  color={config.primaryColor}/>
        <Text style={styles.chatnowAndCallusText} >Chat Now</Text>
       </TouchableOpacity>
        </View>

    </Modal>
    {/*========== CONTACT MODAL =========== */}
    {/*========== LOGOUT MODAL =========== */}
     <Modal visible={modalVisible} onDismiss={()=>setModalVisible(false)} contentContainerStyle={styles.containerStyle}>
     <View>
     <Text style={{fontSize:16,fontWeight:'700',color:'#222',textAlign:'center'}} >
     <MaterialIcons name="info-outline" size={24} color="#222" />
       </Text>
       <View  >
       <View style={{paddingTop:8,paddingBottom:13}} >
       <Text style={{textAlign:'center',color:'gray'}} > Do you want to Logout?</Text>
       {/* <Text style={{textAlign:'center',color:'gray'}}  >is not registered !!</Text> */}
       </View>
       <View style={{paddingTop:8,borderTopColor:'#f2f2f2',borderTopWidth:1}} >
       <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:30}} >
       <TouchableOpacity activeOpacity={0.5} onPress={()=>setModalVisible(false)} >
        <View >
          <Text style={{color:config.primaryColor,fontSize:14,fontWeight:'700'}} >Cancel</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={logoutAuthUser} >
        <View  >
          <Text style={{color:config.primaryColor,fontSize:14,fontWeight:'700'}} >Log out</Text>
        </View>
        </TouchableOpacity>

       </View>
       </View>
       </View>
     </View>
    </Modal>
    {/*========== LOGOUT MODAL =========== */}
       </Portal>
       </Provider>
  );
}

export default Account;

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: "white",
    flex: 1,
  },
  accountHeader: {
    width: "100%",
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 20,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  containerStyle:{
    backgroundColor: 'white',
  paddingTop: 15,
  paddingBottom:12,
  marginHorizontal:80,
  borderRadius:10,
zIndex:2
},
  accountHeadingText: {
    fontSize: 20,
    fontWeight: "600",
    color: config.primaryColor,
  },
  serachIcon: {
    paddingRight: 10,
  },
  mainContainer: {
    paddingHorizontal: 20,
  },
  avatarContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatarWithUser: {
    flexDirection: "row",
    alignItems: "center",
  },
  userTextBox:{
    paddingLeft: 20,
  },
  userText: {
    fontWeight: "600",
    fontSize: 18,
    textTransform:'capitalize',
    color:"#1e1e1e"
   
  },
  phoneNumber:{
  fontSize:13,
  fontWeight:'400',
  color:config.primaryColor
  },
  listBox: {
    paddingHorizontal: 24,
  },
  changeLanguageBox: {
    flexDirection: "row",
    borderTopColor: "#f2f2f2",
    borderTopWidth: 1,
    paddingVertical: 18,
  },
  languageText: {
    paddingLeft: 20,
    fontWeight: "400",
    color: "#3e3e3e",
    fontSize: 16,
  },
  logBox: {
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 160,
    height: 100,
  },
  versionText:{
    fontSize:13,
    color:"gray",
    paddingTop:10
  },
  chatnowAndCallusIconBox:{
    paddingHorizontal:18,
    width:'100%',
    paddingVertical:10,
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center'
  },
  chatnowAndCallusText:{
    fontSize:16,
    color:'#555',
    fontWeight:'400',
    letterSpacing:1,
    paddingVertical:1,
    paddingLeft:12
  },
});

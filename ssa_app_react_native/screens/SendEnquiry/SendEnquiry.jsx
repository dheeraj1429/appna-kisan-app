import React,{useCallback,useEffect,useState} from 'react'
import { useFocusEffect } from '@react-navigation/native';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    FlatList,
    Linking,
    TextInput,
    ActivityIndicator,
    Image,
    ToastAndroid
  } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { Surface,Modal, Portal,Provider } from "react-native-paper";
import { MaterialIcons,FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Octicons } from "@expo/vector-icons";
import { config } from '../../config';
import { UseContextState } from '../../global/GlobalContext';
import navigationString from '../../Constants/navigationString';
import axios from 'axios';
import imageImport from '../../Constants/imageImport';
import strings from '../../Constants/strings';


function SendEnquiry({route,navigation}) {
    const {order_id} = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [ message , setMessage ] = useState('')
  const {authState} = UseContextState();

//   console.log(authState)


  const handleSendMessage=async(order_id)=>{
    if(message?.length < 14){
        return ToastAndroid.showWithGravityAndOffset(
            "Enter atleast 14 character.",
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50
          );
    }
    const data = {
        user_id:authState?.user?.user_id,
        order_id:order_id,
        username:authState?.user?.username,
        phone_number:authState?.user?.phone_number,
        message:message
    }
    await axios.post(`${config.BACKEND_URI}/api/app/send/enquiry/for/order`,{...data},{withCredentials:true})
    .then(res=>{
        console.log(res?.data);
        setModalVisible(true)
        setMessage('')
    })
    .catch(err=>{
        console.log(err)
    })
    
  }

    const goBack=()=>{
        navigation.goBack()
    }
    

  return (
    <Provider>
    <Portal>
    <View style={{flex:1,backgroundColor:'white',}} >
    <StatusBar backgroundColor="white" />
    <Surface style={styles.productHeader}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
    <MaterialIcons  onPress={goBack} name="keyboard-arrow-left" size={27} color={config.primaryColor} />
    <Text style={styles.searchResultText}>Send Enquiry</Text> 
    </View>
    <View style={{flexDirection:'row',alignItems:'center'}} >
      <View style={styles.headerIconsContainer} >
        <TouchableOpacity activeOpacity={0.6} onPress={()=>navigation.navigate(navigationString.SEARCH_SCREEN)} >
          <Octicons
            style={styles.serachIcon}
            name="search"
            size={20}
            color={config.primaryColor}
          />
        </TouchableOpacity>
          <MaterialIcons
            onPress={()=>Linking.openURL(strings.CALLUS)}
            style={styles.headerIcon1}
            name="support-agent"
            size={24}
            color={config.primaryColor}
          />
        <FontAwesome name="whatsapp" onPress={()=>Linking.openURL(strings.WHATSAPP)} style={styles.headerIcon2} size={24} color={config.primaryColor} />
        </View>
    </View>
  </Surface>
<View style={{paddingHorizontal:20,paddingTop:12}}  >
    <Text style={{paddingHorizontal:4,fontSize:12,fontWeight:'500',color:'#222'}} >Sending Enquiry For #Order ID : {order_id}</Text>
<View style={{...styles.commonFieldContainer}} >
<TextInput autoFocus multiline value={message} onChangeText={value=>setMessage(value)}  numberOfLines={8}   keyboardType={'default'} style={styles.commonField} placeholder='Your Message*' />
<TouchableOpacity  onPress={()=>handleSendMessage(order_id)} activeOpacity={0.8} style={styles.checkoutBtn}>
<Text style={styles.checkouttext}>Send Message </Text>
</TouchableOpacity>
</View>
</View>
  </View>
  <Modal visible={modalVisible} onDismiss={()=>setModalVisible(false)} contentContainerStyle={styles.containerStyle}>
          <View>
          <Text style={{fontSize:16,fontWeight:'700',color:'#222',textAlign:'center'}} >
          <MaterialIcons name="info-outline" size={24} color="#222" />
            </Text>
            <View  >
            <View style={{paddingTop:8,paddingHorizontal:20,paddingBottom:13}} >
            <Text style={{textAlign:'center',color:'gray'}} > {strings.AFTER_SEND_MESSAGE_BOX}</Text>
            {/* <Text style={{textAlign:'center',color:'gray'}}  >is not registered !!</Text> */}
            </View>
            <View style={{paddingTop:8,borderTopColor:'#f2f2f2',borderTopWidth:1}} >
            <View style={{alignItems:'center',paddingHorizontal:0}} >
            <TouchableOpacity activeOpacity={0.5} onPress={()=>{setModalVisible(false);goBack()}} >
             <View >
               <Text style={{color: config.primaryColor,textAlign:'center' ,fontSize:14,fontWeight:'700'}} >OK</Text>
             </View>
             </TouchableOpacity>
            </View>
            </View>
            </View>
          </View>
         </Modal>
         </Portal>
         </Provider>
  )
}

export default SendEnquiry


const styles=StyleSheet.create({
    productHeader: {
        width: "100%",
        backgroundColor:'white',
        paddingTop: 45,
        paddingBottom: 14,
        paddingHorizontal: 15, 
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      },
      searchResultText: {
        fontSize: 16,
        textTransform:'capitalize',
        paddingLeft:2,
        fontWeight: "500",
        color:config.primaryColor,
      },
      serachIcon: {
        paddingRight: 10,
        borderColor: "lightgray",
        borderWidth: 1,
        paddingHorizontal: 13,
        paddingVertical: 10,
        borderRadius: 40,
      },
      headerIconsContainer:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
      },
      headerIcon1: {
        borderColor: "lightgray",
        borderWidth: 1,
        backgroundColor: "white",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 40,
        marginLeft: 8,
        shadowProp: {
          shadowColor: "#171717",
          shadowOffset: { width: 12, height: 4 },
          shadowOpacity: 0.49,
          shadowRadius: 3,
        },
      },
      headerIcon2:{
        borderColor:'lightgray',
        borderWidth:1,
        backgroundColor:'white',
        paddingLeft:12.5,
        paddingRight:11,
        paddingVertical:10,
        borderRadius:40,
        marginLeft:8,
        shadowProp: {
          shadowColor: '#171717',
          shadowOffset: {width: 12, height: 4},
          shadowOpacity: 0.49,
          shadowRadius: 3,
        },
      
      },
      brandSuggestion:{
        backgroundColor:'#f5f5f6',
        paddingHorizontal:16,
        paddingVertical:6,
        marginVertical:1,
        marginHorizontal:5,
        color:'gray',
        borderRadius:30,
        borderWidth:0.5,
        borderColor:'lightgray',
        textTransform:'capitalize'
      },
      commonFieldContainer:{
        // width:'100%',
      },
      commonField:{
        width:'100%',
        marginTop:10,
        paddingHorizontal:12,
        textAlignVertical:'top',
        paddingVertical:12,
        fontSize:14,
        // backgroundColor:'#f9f9f9',
        letterSpacing:1.5,
         borderRadius: 16,
        borderWidth:0.5,
        color:'gray',
        fontWeight:'500',
        borderColor:'lightgray'
      },
      checkouttext:{
        fontSize:14,
        fontWeight:'600',
        letterSpacing:1.5,
        color:'white'
      },
      checkoutBtn: {
        width: "50%",
        marginTop: 20,
        alignItems: "center",
        paddingVertical: 13,
        paddingHorizontal: 12,
        backgroundColor: config.primaryColor,
        borderRadius: 16,
        shadowColor: config.primaryColor,
        shadowOffset: { width: 10, height: 0 },
        shadowOpacity: 0.49,
        shadowRadius: 10,
        elevation: 5,
      },
      containerStyle:{
        backgroundColor: 'white',
      paddingTop: 15,
      paddingBottom:12,
      marginHorizontal:80,
      borderRadius:10,
    zIndex:2
    },
     
})
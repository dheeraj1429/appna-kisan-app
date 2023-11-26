import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator,
    Image
  } from "react-native";
import { config } from '../../config';
import imageImport from '../../Constants/imageImport';
import navigationString from '../../Constants/navigationString';

function OrderCompleted({navigation}) {
  return (
    <View style={{flex:1,height:'100%',justifyContent:'center',alignItems:'center',backgroundColor:'#fff'}} >
     <Image 
         source={imageImport.OrderCompleted}
         style={{width:250,height:250}}
     />
     <View style={{position:'absolute'}} >
     <View style={{position:'relative',bottom:-130,justifyContent:'center',alignItems:'center'}} >

  
     <Text style={{fontSize:20,color:config.primaryColor,fontWeight:'600'}} >Thank You !!</Text>
     <Text style={{fontSize:15}} >Your Order Is Booked</Text>
     <TouchableOpacity onPress={()=>navigation.navigate(navigationString.ORDER)}
      activeOpacity={0.7} style={{borderColor:config.primaryColor,borderWidth:1,borderRadius:40,marginTop:16}} >
        <Text style={{fontSize:15,color:config.primaryColor,paddingHorizontal:16,paddingVertical:5,}} >Got It</Text>
        </TouchableOpacity> 
        </View>
        </View>
 </View> 
  )
}

export default OrderCompleted
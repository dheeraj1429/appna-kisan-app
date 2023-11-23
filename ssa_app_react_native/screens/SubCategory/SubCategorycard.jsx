import React from 'react'
import {Text,View,Image,TouchableOpacity,StyleSheet} from "react-native"
import { Avatar } from 'react-native-paper'
import { config } from '../../config'
import navigationString from '../../Constants/navigationString'

function SubCategorycard({itemImage,itemName,navigation,subCategoryInfo}) {
  const goToSearchResult=()=>{
    // navigation.navigate(navigationString.SEARCH_RESULT,{searchThroughSubCategory:itemName})
    navigation.navigate(navigationString.SEARCH_RESULT,
      {searchThroughSubCategory:{
        main_category:subCategoryInfo?.parent_main_category,
        category:subCategoryInfo?.parent_category,
        sub_category:subCategoryInfo?.name
          }
      }
        )
  }
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={goToSearchResult} style={styles.brandCatgory} >
         <View style={styles.brandBox} >
             <Image
     style={{width:200,height:200,borderRadius:10}}
    source={{
      uri:itemImage}}/>
  {/* <Text style={styles.brandName}> {itemName?.slice(0,10)}</Text> */}
  <Text style={styles.brandName}> {itemName}</Text>
   </View>
   </TouchableOpacity>


  )
}

export default SubCategorycard

const styles= StyleSheet.create({
    brandBox:{
        alignItems:'center',
        borderWidth:1,
        borderColor:'#f2f2f2',
        borderRadius:10,
        padding:5,
 
       
      },
      brandName:{
        paddingTop:5,
        paddingBottom:2,
        fontSize:16,
        letterSpacing:1.6,
        color:config.primaryColor,
        fontWeight:'500',
        textTransform:'capitalize'
    
      },
      brandCatgory:{
        paddingHorizontal:15,
       
        paddingTop:15,

        
      },
})
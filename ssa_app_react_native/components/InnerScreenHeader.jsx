import React from 'react'
import { View,Text,StyleSheet,Linking,TouchableOpacity } from 'react-native'
import { Surface } from 'react-native-paper'
import { config } from '../config'
import { Octicons } from "@expo/vector-icons";
import { MaterialIcons,FontAwesome } from '@expo/vector-icons';
import navigationString from '../Constants/navigationString';
import strings from '../Constants/strings';



function InnerScreenHeader({navigation,title,goBack}) {
   
  return (
    <View >
         <Surface style={styles.accountHeader}>
        <View style={{flexDirection:'row',alignItems:'center'}} >
        {/* <Ionicons name="arrow-back" onPress={goBack} size={24} color='#555' /> */}
        {/* <AntDesign name="arrowleft" size={22} color="#555" /> */}
        <MaterialIcons onPress={goBack} name="keyboard-arrow-left" size={27} color={config.primaryColor} />
        {/* <Ionicons name="chevron-back" size={24} color={config.primaryColor} /> */}
        <Text style={styles.accountHeadingText}> {title}</Text>
        </View>
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
      </Surface>
    </View>
  )
}

export default InnerScreenHeader

const styles = StyleSheet.create({
    screenContainer: {
        backgroundColor: "white",

      },
      accountHeader: {
        width: "100%",
        paddingTop: 55,
        paddingBottom: 14,
        paddingHorizontal:15,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      },
      accountHeadingText: {
        fontSize: 17,
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
})
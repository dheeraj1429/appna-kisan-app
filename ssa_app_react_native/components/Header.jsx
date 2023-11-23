import React from "react";

// import { StatusBar } from "expo-status-bar";
import { StyleSheet, Image,TextInput, Text,Dimensions,SafeAreaView ,View,Linking } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import strings from "../Constants/strings";
import { FontAwesome } from '@expo/vector-icons';
import { config } from "../config";
import imageImport from "../Constants/imageImport";

function Header() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const onChangeSearch = (query) => setSearchQuery(query);

  const openHelpCenter = ()=>{
    return alert("HELP CENTER")
  }

  return (
    // <View>
    //   <View style={styles.headerContainer}>
    //     <Appbar.Header style={styles.headerContainer} statusBarHeight={25}>
    //       {/* <Appbar.BackAction onPress={_goBack} /> */}
    //       <Appbar.Content title="SSA" titleStyle={{ color: "white" }} />
    //       <MaterialIcons
    //         style={styles.headerIcon}
    //         name="support-agent"
    //         size={24}
    //         color="white"
    //       />
    //       <MaterialCommunityIcons
    //         style={styles.headerIcon}
    //         name="cart"
    //         size={24}
    //         color="white"
    //       />
    //     </Appbar.Header>
    //     <View style={styles.searchBox}>
    //       <TextInput
    //         style={styles.searchBar}
    //         placeholder="Search Anything..."
    //         onChangeText={onChangeSearch}
    //         value={searchQuery}
    //       />
    //       <MaterialIcons
    //         style={styles.serachIcon}
    //         name="search"
    //         size={24}
    //         color="black"
    //       />
    //     </View>
    //   </View>
    // </View>
    <View style={styles.headerMain} >
      <View style={styles.headerStyle} >
        {/* <Text style={{fontSize:18,color:config.primaryColor,fontWeight:'700'}} >Supreme Sales Agency</Text> */}
       <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}} >
       <Image 
        style={{width:155,height:55}}
        source={imageImport?.HeaderLogo}
        />
        {/* <Text style={{fontSize:16,color:config.primaryColor,fontWeight:'700',paddingLeft:6}} >Apna Kisan</Text> */}
       </View>
        <View style={styles.headerIconsContainer} >
        <MaterialIcons
            onPress={()=>Linking.openURL(strings.CALLUS)}
            style={styles.headerIcon1}
            name="support-agent"
            size={24}
            color={config.primaryColor}
          />
          <FontAwesome name="whatsapp" onPress={()=>Linking.openURL(strings.WHATSAPP)} style={styles.headerIcon2} size={24} color={config.primaryColor} />
{/* <FontAwesome onPress={openHelpCenter}  style={styles.headerIcon2} name="language" size={24}  color={config.primaryColor} /> */}
        </View>
      </View>
      {/* <View style={styles.searchBox}>
           <TextInput
             style={styles.searchBar}
             placeholder="What are you looking for?"
             onChangeText={onChangeSearch}
             value={searchQuery}
           />
           <Octicons  style={styles.serachIcon} name="search" size={20}  />
         </View> */}

    </View>
  );
}

export default Header;

const styles = StyleSheet.create({

  headerMain:{
    paddingTop:50,
    paddingHorizontal:20,
    backgroundColor:'white',
    // borderBottomEndRadius:25,
    // borderBottomStartRadius:25


  },
  headerStyle:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
  },
  headerIconsContainer:{
    flexDirection:'row'
  },
  headerIcon1:{
    borderColor:'lightgray',
    borderWidth:1,
    backgroundColor:'white',
    paddingHorizontal:10,
    paddingVertical:10,
    borderRadius:40,
    marginLeft:14,
    shadowProp: {
      shadowColor: '#171717',
      shadowOffset: {width: 12, height: 4},
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
    marginLeft:14,
    shadowProp: {
      shadowColor: '#171717',
      shadowOffset: {width: 12, height: 4},
      shadowOpacity: 0.49,
      shadowRadius: 3,
    },
  
  },
  searchBox: {
    marginTop:16,
    justifyContent: "center",
    position: "relative",
  },
   
  searchBar: {
    paddingVertical:10,
    backgroundColor: "#f5f5f6",
    borderRadius: 12,
    fontSize: 16,
    paddingHorizontal: 45,
    marginBottom: 10,
    borderColor:'lightgray',
    borderWidth:0.5,
    fontWeight:'600'
  },
  serachIcon: {
    position: "absolute",
    left: 13,
    color: config.primaryColor,
    paddingBottom: 8,
  },
});

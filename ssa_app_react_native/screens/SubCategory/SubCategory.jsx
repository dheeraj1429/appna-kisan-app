import React, { useCallback,useState,useEffect } from "react";
import { config } from "../../config";
import {
  View,
  StyleSheet,
  RefreshControl,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator
} from "react-native";
import { Avatar } from "react-native-paper";
import { SectionList } from "react-native";
import navigationString from "../../Constants/navigationString";
import { Entypo } from "@expo/vector-icons";
import InnerScreenHeader from "../../components/InnerScreenHeader";
import SubCategorycard from "./SubCategorycard";
import imageImport from "../../Constants/imageImport";
import ProductCard from "../../components/ProductCard";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

function SubCategory({ route,navigation }) {
  const [ data , setData ] = useState();
  const [refreshing, setRefreshing] = React.useState(false);
  const [ loading , setLoading ] = useState(false)
  const { category_id,brand_name } = route.params;
  console.log("CATEGORY ID-----",category_id,"Brand-----",brand_name)
// console.log(data)
useFocusEffect(
  useCallback(()=>{
    setLoading(true)
    axios.get(`${config.BACKEND_URI}/api/get/sub/category/and/related/products?brand_id=${category_id}&brand_name=${brand_name}`,{withCredentials:true})
    .then(res=>{
      // console.log(res.data)
      setData(res?.data)
      setLoading(false)
      setRefreshing(false)
    })
    .catch(err=>{
      console.log(err)
      setRefreshing(false)
    })
  },[category_id,refreshing])
)

  
  const onRefresh = async()=>{
    setRefreshing(true)
  }

  let emptySeeAllButton = {empty:true,}
  data?.subcategory[0].subcategory?.length === 7  &&  data?.subcategory[0].subcategory?.push(emptySeeAllButton)  
 const renderItem = useCallback(({ item, index }) => {
   console.log("SUB CATEGORY __",item)
   return (
     <View>
       {item.empty ? (
         <TouchableOpacity
         onPress={()=>navigation.navigate(navigationString.SEARCH_RESULT,{searchThroughBrandCategory:brand_name})}
           activeOpacity={0.7}
           style={{ alignItems: "center",...styles?.seeAllContainer }}
         >
           <Entypo
             style={styles.seeAllBtn}
             name="chevron-small-right"
             size={30}
           />
           <Text style={styles.seeAllText}>See All</Text>
         </TouchableOpacity>
       ) : (
         <SubCategorycard navigation={navigation} 
         itemImage={item.image?.image_url} itemName={item.name} 
         subCategoryInfo={item}
         />
       )}
     </View>
   );
 }, []);
  // ========= OLD ============
   // SET EMPTY PRODUCT FOR GRID ALIGNMENT
  //  let emptySeeAllButton = {empty:true,}
  //  data?.subcategory[0].subcategory?.length === 7  &&  data?.subcategory[0].subcategory?.push(emptySeeAllButton)  
  // const renderItem = useCallback(({ item, index }) => {
  //   console.log("SUB CATEGORY __",item)
  //   return (
  //     <View>
  //       {item.empty ? (
  //         <TouchableOpacity
  //         onPress={()=>navigation.navigate(navigationString.SEARCH_RESULT,{searchThroughBrandCategory:brand_name})}
  //           activeOpacity={0.7}
  //           style={{ alignItems: "center",...styles?.seeAllContainer }}
  //         >
  //           <Entypo
  //             style={styles.seeAllBtn}
  //             name="chevron-small-right"
  //             size={30}
  //           />
  //           <Text style={styles.seeAllText}>See All</Text>
  //         </TouchableOpacity>
  //       ) : (
  //         <SubCategorycard navigation={navigation} 
  //         itemImage={item.image?.image_url} itemName={item.name} 
  //         subCategoryInfo={item}
  //         />
  //       )}
  //     </View>
  //   );
  // }, []);
  // ============ OLD ========

   // SET EMPTY PRODUCT FOR GRID ALIGNMENT
   let emptyArr = {empty:true,product_images:[]}
   data?.products?.length  % 2 != 0  &&  data?.products?.push(emptyArr)  
  const renderProducts = useCallback(({ item, index }) => {
    // console.log("items sub category",item)
       
return  (
  <View>
    { item.empty 
     ?
    ( <View style={
    
      { backgroundColor: "#fff", //#f2f2f2
       width: 165,
       height: 250,
       borderRadius: 30,
       margin: 5,
       padding: 20,
       overflow: "hidden",}
     
    } >
 
     </View>)
     :
     (<ProductCard product_id={item._id} 
        product_code={item.product_code}
        product_name={item?.product_name}
        product_main_category={item?.product_main_category} 
        product_category={item?.product_category} 
        product_subcategory={item?.product_subcategory} 
        product_variant={item?.product_variant} 
        product_images={item?.product_images} 
        new_arrival={item?.new_arrival}
        navigation={navigation} />)
   }
  </View>
 )  

  }, []);

  return (
    <View style={styles.screenContainer}>
      <InnerScreenHeader
        title={brand_name}
        navigation={navigation}
        goBack={() => navigation.goBack()}
      />
      <View style={styles.brandContainer}>
        <View style={styles.brandHeadingBox}>
          {/* <Text style={styles.brandText}>{Data.title}</Text> */}
          <TouchableOpacity activeOpacity={0.7}>
            {/* <Text style={styles.seeAll} >See All</Text> */}
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading ? 
    //   <View style={{flex:1,height:'100%',justifyContent:'center',alignItems:'center'}} >
    //   <ActivityIndicator size='large' animating={true} color={config.primaryColor} />
    //  </View> 
    <View style={{ flex:1,height:'100%',justifyContent:'center',alignItems: "center",}} >
    <Image
    source={imageImport.LoaderGif}
    style={{width:100,height:100,}}
    />

  </View>
      : 
      // <FlatList
      // refreshControl={
      //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      // }
      //     ListHeaderComponent={
      //       <View style={styles.brandContainerFlatlist}>
      //         <FlatList
      //           ListFooterComponent={
      //             <View style={styles.releventProductBox}>
      //               <Text
      //                 style={{
      //                   fontSize: 16,
      //                   fontWeight: "600",
      //                   color: config.primaryColor,
      //                 }}
      //               >
      //                 Related Products
      //               </Text>
      //             </View>
      //           }
      //           numColumns={1}
      //           data={data?.subcategory[0].subcategory}
      //           renderItem={renderItem}
      //           keyExtractor={(item, index) => item._id}
      //         />
      //       </View>
      //     }
      //     numColumns={2}
      //     data={data?.products}
      //     contentContainerStyle={{ alignItems: "center", width: "100%" }}
      //     ListFooterComponent={() => (
      //        !loading  && data?.products?.length <= 0  ? 
      //         <View style={{height:'100%' ,alignItems: "center",marginTop:70}} >
             
      //      <TouchableOpacity activeOpacity={0.6} onPress={()=>{navigation.navigate(navigationString.SEARCH_SCREEN);}}  style={styles.notFoundProduct} >
      //         <Text style={styles.notFoundText} >Product Not Found</Text>
      //        </TouchableOpacity>
      //       </View>
      //         :
      //       <View style={{ paddingBottom: 175 }}></View>
      //     )}
      //     showsVerticalScrollIndicator={false}
      //     renderItem={renderProducts}
      //     keyExtractor={(item, index) => item._id}
      //   />
      <View style={styles.brandContainerFlatlist}>
      <FlatList
        // ListFooterComponent={
        //   <View style={styles.releventProductBox}>
        //     <Text
        //       style={{
        //         fontSize: 16,
        //         fontWeight: "600",
        //         color: config.primaryColor,
        //       }}
        //     >
        //       Related Products
        //     </Text>
        //   </View>
        // }
        numColumns={1}
        data={data?.subcategory[0].subcategory}
        scrollEnabled={true}
        renderItem={renderItem}
        keyExtractor={(item, index) => item._id}
      />
    </View>

      }
        
        {/* <ProductCard/>
     <ProductCard/> */}
      
      </View>
    </View>
  );
}

export default SubCategory;

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: "white",
    flex: 1,
  },
  brandContainer: {
    paddingHorizontal: 15,
    paddingBottom: 0,
  },
  brandHeadingBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  brandText: {
    fontSize: 20,
    fontWeight: "600",
    textTransform: "capitalize",
    color: config.primaryColor,
  },
  seeAll: {
    fontWeight: "600",
    fontSize: 13,
    color: "white",
    backgroundColor: config.primaryColor,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  brandBox: {
    alignItems: "center",
  },
  brandName: {
    paddingVertical: 5,
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  brandCatgory: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingTop: 15,
  },
  brandContainerFlatlist: {
    paddingBottom: 5,
    alignItems: "center",
  },

  brandText: {
    fontSize: 18,
    fontWeight: "600",
    textTransform: "capitalize",
    color: config.primaryColor,
  },
  brandBox: {
    alignItems: "center",
  },
  seeAllContainer:{
    marginLeft:18
  },
  seeAllBtn: {
    backgroundColor: config.primaryColor,
    borderRadius: 40,
    padding: 8,
    margin: 8,
    color: "white",
    marginTop: 20,
    // marginLeft: 28,
  },
  seeAllText: {
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: "400",
    // marginLeft: 8,
    textTransform: "capitalize",
  },
  releventProductBox: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  notFoundProduct:{
    backgroundColor:config.primaryColor,
    paddingHorizontal:30,
    paddingVertical:10,
    borderRadius:6
  },
  notFoundText:{
    color:'white',
    fontSize:16,
    fontWeight:'500'
  }
});

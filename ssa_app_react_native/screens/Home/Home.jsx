import React, { useEffect, useState } from "react";
import { View, RefreshControl, StyleSheet, TextInput, Text, TouchableOpacity, ActivityIndicator, Dimensions, ScrollView } from "react-native";
import Header from "../../components/Header";
import { config } from "../../config";
import BrandCard from "../../components/BrandCard";
import HomeBanner from "../../components/HomeBanner";
import { Octicons } from '@expo/vector-icons';
import navigationString from "../../Constants/navigationString";
import axios from "axios";
import { setItemToLocalStorage } from "../../Utils/localstorage.js";
import Toast from 'react-native-toast-message';
import { FlatList } from "react-native-gesture-handler";
import customer_review from "../../Constants/customer_review";
import { FontAwesome } from '@expo/vector-icons';
import { UseContextState } from "../../global/GlobalContext.jsx";
// import { useRoute } from '@react-navigation/native';


export const SLIDER_WIDTH = Dimensions.get("window").width;
function Home({ navigation }) {
  const [brands, setbrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [render, setRender] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [apiResponse, setApiResponse] = useState([]);
  const { fetchAuthuser, authState } = UseContextState();

  const userData = authState.user;

  console.log(userData,"userdat from home page");
  useEffect(() => {
    // Call fetchAuthuser to update the user data in the global context
    fetchAuthuser();
  }, [fetchAuthuser]);

  // Get the route object
  // const route = useRoute();

  // Retrieve the apiResponse data from route parameters
  // const details = route.params?.details;
  // console.log("details from navigation", details);

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Login Successfully ✅',
      // text2: 'This is some something 👋'
    });
  }

  const reviewlist = async () => {
    try {
      const response = await fetch('https://whale-app-88bu8.ondigitalocean.app/api/reviews?page=1', {
        method: 'GET',
        // headers: {
        //   'x-user-type': 'b2c',
        //   'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTYwZGMxZWIxZjg4ODMzMzk5NjU1ZDIiLCJuYW1lIjoiU21hcnR5IiwidXNlclR5cGUiOiJCMkMiLCJpYXQiOjE3MDA5MjM0OTB9.8CqOVeMoVH6wmxq0LjCS1jRBPhQ5MQ8j9WLs-P6mfNA', // Include if required
        //   // Add any other necessary headers
        // },
      });

      console.log('Response:', response);

      if (response.status === 200) {
        const data = await response.json();
        if (data.success) {
          console.log('data:', data);

          return data;
        } else {
          console.log('API returned an error:', data.error);
        }
      } else {
        console.log('review list HTTP request failed with status:', response.status);
      }
    } catch (error) {
      console.log('Error fetching review List:', error.message);
    }
  };

  useEffect(() => {
    const fetchList1 = async () => {
      try {
        const response = await reviewlist();
        setApiResponse(response.reviews); // Assuming response is an array
        console.log('api response review', apiResponse);
      } catch (error) {
        console.log('Error fetching review list:', error);
      }
    };


    fetchList1();

  }, []);


  useEffect(() => {
    setLoading(true)
    axios.get(`${config.BACKEND_URI}/api/get/home/screen/brands`, { withCredentials: true })
      .then(res => {
        // console.log(res?.data);
        setbrands(res?.data)
        setLoading(false)
        setRefreshing(false)

      })
      .catch(err => {
        console.log(err);
        setRefreshing(false)

      })
  }, [render, refreshing])


  const onRefresh = async () => {
    setRefreshing(true)
  }

  const goToSearch = () => {
    navigation.navigate(navigationString.SEARCH_SCREEN)
  }

  const renderAllReviews = (({ item, index }) => {
    console.log(item)
    return (
      <View style={styles?.reviewBox} >
        <View>

          <View>
            <Text style={{ fontSize: 13, color: '#222', textTransform: 'capitalize' }} >{item?.content}</Text>
          </View>
          <Text style={{ fontWeight: '500', fontSize: 13, textTransform: 'capitalize', paddingTop: 3 }} >{item?.name}</Text>
        </View>
      </View>
    )
  })

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>

      <ScrollView

        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: 'white', marginTop: 0 }}
        refreshControl={
          <RefreshControl progressViewOffset={40} refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Header />
        <TouchableOpacity activeOpacity={0.8} onPress={goToSearch} style={styles.searchBox}>
          {/* <TextInput
            
             style={styles.searchBar}
             placeholder="What are you looking for?"
             onChangeText={onChangeSearch}
             value={searchQuery}
           />
           <Octicons  style={styles.serachIcon} name="search" size={20}  /> */}

          <View style={styles.searchBar} >
            <Octicons style={styles.serachIcon} name="search" size={20} />
            <Text style={styles.searchBarText} >What are you looking for?</Text>
          </View>
        </TouchableOpacity>


        <HomeBanner navigation={navigation} />
        {/* <TouchableOpacity onPress={showToast} >
        <Text>TOAST Show</Text>
      </TouchableOpacity> */}
        {/* <Text onPress={()=>navigation.navigate(navigationString.LOGIN)}
       style={{fontSize:20,fontWeight:'700',textAlign:'center'}} >Login</Text> */}
        {loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
          <ActivityIndicator size='large' animating={true} color={config.primaryColor} />
        </View>
          :
          brands?.map((value, index) => (
            <BrandCard key={index} navigation={navigation} title={value?._id} brandsData={value?.brands} />

          ))
        }
        { }
        {/* <BrandCard navigation={navigation} title="ev categories" brandsData={Data}/>
      <BrandCard navigation={navigation} title="agriculture categories" brandsData={Data2}/> */}

        {/*============ CUSTOMER REVIEW======== */}
        <View style={styles.brandContainer} >
          <View style={styles.brandHeadingBox} >
            <View style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 15 }} >
              <Text style={styles.brandText}>Customer Reviews</Text>

            </View>
          </View>
          <View style={{ alignItems: "center", paddingTop: 10 }} >
            <FlatList
              data={customer_review?.reviews}
              renderItem={renderAllReviews}
              contentContainerStyle={{ paddingHorizontal: 15 }}
              keyExtractor={(item) => item.name}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
        {/*============ CUSTOMER REVIEW======== */}

      </ScrollView>
      <View style={{ backgroundColor: "white", flexDirection: "row", justifyContent: "flex-end",marginRight:"2%" ,marginBottom:"15%"}}>
        <FontAwesome name="whatsapp" onPress={() => Linking.openURL(strings.WHATSAPP)} style={styles.headerIcon2} size={25} color={config.primaryColor} />
      </View>
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  searchBox: {
    justifyContent: "center",
    position: "relative",
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  brandContainer: {
    // paddingHorizontal: 15,
    paddingBottom: 90,

  },
  brandHeadingBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5
  },
  brandText: {
    fontSize: 16,
    fontWeight: "600",
    textTransform: 'capitalize',
    color: config.primaryColor

  },
  reviewBox: {
    borderWidth: 1,
    borderColor: '#f1f1f1',
    width: 220,
    // height: 160,
    borderRadius: 20,
    margin: 5,
    padding: 15,
    overflow: "hidden",
  },
  searchBar: {
    paddingVertical: 12,
    backgroundColor: "#f5f5f6",
    borderRadius: 12,
    fontSize: 16,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderColor: 'lightgray',
    borderWidth: 0.5,
    fontWeight: '600',
    flexDirection: 'row',
    alignItems: 'center',

  },
  searchBarText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500'
  },
  serachIcon: {
    color: config.primaryColor,
    paddingRight: 10

  },
  headerIcon2: {
    borderColor: 'lightgray',
    //width:"100%",
    borderWidth: 1,
    backgroundColor: 'white',
    paddingHorizontal: "3%",
    paddingVertical: 10,
    borderRadius: 40,
    marginLeft: 14,
    shadowProp: {
      shadowColor: '#171717',
      shadowOffset: { width: 12, height: 4 },
      shadowOpacity: 0.49,
      shadowRadius: 3,
    },

  },
});

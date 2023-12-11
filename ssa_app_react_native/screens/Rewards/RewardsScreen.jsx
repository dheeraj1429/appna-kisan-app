import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Portal, Provider } from "react-native-paper";
import navigationString from "../../Constants/navigationString";
import { config } from "../../config";
import { UseContextState } from "../../global/GlobalContext";
import { DataTable } from "react-native-paper";

function RewardsScreen({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  const { userData } = UseContextState();
  const [banners, setBanners] = useState([]);
  const [apiResponse, setApiResponse] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [accessToken, setAccessToken] = useState(null);
  const [rewardPoints, setRewardPoints] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const userType = userData?.user?.type;
  console.log(userType, "usertype");

  const userInfo = async () => {
    console.log(accessToken, "access");

    try {
      const response = await fetch(
        "https://whale-app-88bu8.ondigitalocean.app/api/user/get/user/info",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
            "x-user-type": userType,
          },
        }
      );

      console.log("Response in update profile:", response);

      if (response.ok) {
        const data = await response.json();
        if (data && data.success) {
          return data;
        } else {
          console.log(
            "API returned an error:",
            data ? data.error : "No data received"
          );
        }
      } else {
        console.log(
          "UserInfo HTTP request failed with status:",
          response.status
        );
      }
    } catch (error) {
      console.log("Error fetching Details:", error.message);
      // Toast.show({
      //   type: 'error',
      //   position: 'top',
      //   text1: 'Error',
      //   text2: error.message,
      //   visibilityTime: 4000, // 4 seconds
      //   autoHide: true,
      // });
    }
  };

  useEffect(() => {
    if (userData && userData.user) {
      setAccessToken(userData.accessToken);
      //setRewardPoints(userData.user.reward_points);
      console.log("rewardpoint", rewardPoints);
      console.log("userdata === ", userData);
    }
  }, [userData]);

  const rewardOrderHistory = async () => {
    try {
      //const response = await fetch('https://whale-app-88bu8.ondigitalocean.app/api/all/reward/products/history?page=1', {
      const response = await fetch(
        "https://whale-app-88bu8.ondigitalocean.app/api/all/reward/products/history",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
            "x-user-type": userType,
          },
        }
      );

      console.log("Response of product:", response);

      if (response.status === 200) {
        const data = await response.json();
        console.log("data", data);
        if (data.success) {
          console.log("data product", data.orders);
          setOrderHistory(data.orders);
          return data.products;
        } else {
          console.log("API returned an error:", data.error);
        }
      } else {
        console.log(
          "Reward order list HTTP request failed with status:",
          response.status
        );
      }
    } catch (error) {
      console.log("Error fetching Reward Order List:", error.message);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      if (accessToken) {
        const fetchList1 = async () => {
          try {
            const response = await rewardOrderHistory();
            setApiResponse(response);
            console.log("api response", response);
          } catch (error) {
            console.log("Error fetching Reward Order list:", error);
          }
        };

        fetchList1();

        const fetchList = async () => {
          try {
            const response = await userInfo();
            console.log("UserInfo", response);
            setRewardPoints(response.user.reward_points);
            console.log({ rdp: response.user.reward_points });
            return response;
          } catch (error) {
            Alert.alert("Error fetching UserInfo:", error);
          }
        };

        fetchList();
      }
    }, [accessToken])
  );

  const bannerlist = async () => {
    try {
      const response = await fetch(
        "https://whale-app-88bu8.ondigitalocean.app/api/get/rewards/banners",
        {
          method: "GET",
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        if (data.success) {
          return data.banners;
        } else {
          Alert.alert("API returned an error:", data.error);
        }
      } else {
        Alert.alert("Banner HTTP request failed with status:", response.status);
      }
    } catch (error) {
      Alert.alert("Error fetching banner:", error.message);
    }
  };

  useEffect(() => {
    const fetchList = async () => {
      try {
        const response = await bannerlist();
        setBanners(response);
        startAutoSlide();

        console.log("banners", banners);
      } catch (error) {
        Alert.alert("Error fetching banner list:", error);
      }
    };

    fetchList();
  }, []);

  const startAutoSlide = () => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 2000);
    return intervalId;
  };

  useEffect(() => {
    const intervalId = startAutoSlide();

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const goBack = () => {
    navigation.goBack();
  };

  const renderOrderHistory = () => {
    if (orderHistory.length > 0) {
      return (
        <>
          {orderHistory.map((item, index) => (
            <DataTable.Row>
              {/* <DataTable.Cell>
                <View>
                  <Image
                    source={{
                      uri: item.product.product_images?.[0]?.image_url,
                    }}
                    style={styles.productImage}
                  />
                </View>
              </DataTable.Cell> */}
              <DataTable.Cell>
                <Text style={styles.productName}>
                  {item.product.product_name}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text style={styles.productName}>
                  {item.product.quantityBought}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text style={styles.productName}>
                  {item.reward_point_price}
                </Text>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </>
      );
    } else {
      return (
        <View>
          <Text
            style={{ fontSize: 18, fontWeight: "bold", textAlign: "center" }}
          >
            You haven't redeemed any products
          </Text>
        </View>
      );
    }
  };

  return (
    <Provider>
      <Portal>
        {/* <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: "white" }}> */}
        <View style={styles.screenContainer}>
          <StatusBar backgroundColor="#fff" />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingTop: 50,
              paddingBottom: 10,
            }}
          >
            <MaterialIcons
              onPress={goBack}
              name="keyboard-arrow-left"
              size={27}
              color={config.primaryColor}
            />
            <Text style={styles.headingText}>Reward Points</Text>
            {/* <MaterialIcons name="keyboard-arrow-left" size={27} color='white' /> */}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                backgroundColor: "#f5f5f6",
                borderRadius: 16,
                borderWidth: 0.5,
                borderColor: "lightgray",

                paddingHorizontal: "2%",
                paddingVertical: 5,
              }}
            >
              <FontAwesome5
                name="coins"
                size={20}
                color={config.primaryColor}
                style={{ marginRight: 8 }}
              />
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginRight: 8 }}
              >
                {rewardPoints}
              </Text>
            </View>
          </View>

          {loading && (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator color={config.primaryColor} size="large" />
            </View>
          )}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(navigationString.REDEEM_PROD);
            }}
          >
            <View
              style={{
                backgroundColor: "#f5f5f6",
                borderRadius: 16,
                borderWidth: 0.5,
                borderColor: "lightgray",
                paddingVertical: "2%",
                marginHorizontal: "5%",
                marginVertical: "5%",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Collect Redeem Products
              </Text>
            </View>
          </TouchableOpacity>
          <View>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const newIndex = Math.round(
                  event.nativeEvent.contentOffset.x /
                    Dimensions.get("window").width
                );
                setCurrentIndex(newIndex);
              }}
              style={{ flexDirection: "row" }}
            >
              {banners.map((banner, index) => (
                <View key={banner._id} style={styles.bannerContainer}>
                  <Image
                    style={{ width: "100%", height: 200 }}
                    source={{ uri: banner.image_url }}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </ScrollView>
          </View>
          <ScrollView>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Name</DataTable.Title>
                <DataTable.Title numeric>Qty</DataTable.Title>
                <DataTable.Title numeric>Points</DataTable.Title>
              </DataTable.Header>
              {renderOrderHistory()}
            </DataTable>
          </ScrollView>
        </View>
      </Portal>
    </Provider>
  );
}

export default RewardsScreen;

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: "white",
    flex: 1,
  },
  bannerContainer: {
    width: Dimensions.get("window").width,
    height: 200,
    marginBottom: 20,
  },
  headingText: {
    color: config.primaryColor,
    fontSize: 17,
    letterSpacing: 1,
    fontWeight: "600",
  },
  commonFieldMainBox: {
    marginTop: 12,
    width: "100%",
    height: "100%",
    paddingHorizontal: 20,
  },
  commonField: {
    width: "20%",
    marginTop: 5,
    marginLeft: "75%",
    paddingHorizontal: "5%",
    paddingVertical: 9,
    //fontSize: 14,
    //textTransform: 'capitalize',
    backgroundColor: "#f5f5f6",
    // letterSpacing: 1.5,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: "lightgray",
  },
  brandContainer: {
    // paddingHorizontal: 15,
    paddingBottom: 90,
  },
  brandHeadingBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  brandText: {
    fontSize: 16,
    fontWeight: "600",
    textTransform: "capitalize",
    color: config.primaryColor,
  },
  reviewBox: {
    borderWidth: 1,
    borderColor: "#f1f1f1",
    width: 220,
    // height: 160,
    borderRadius: 20,
    margin: 5,
    padding: 15,
    overflow: "hidden",
  },
  productItem: {
    backgroundColor: "#f5f5f6",
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: "lightgray",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: "5%",
  },

  productImage: {
    width: 40,
    height: 40,
  },

  productDetails: {
    flex: 1,
  },
  userProductsContainer: {
    marginHorizontal: "2%",
    marginTop: "5%",
  },
  productName: {
    fontSize: 12,
    marginBottom: 5,
  },
});

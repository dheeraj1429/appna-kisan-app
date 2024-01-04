import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React, { Fragment, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Portal, Provider, Searchbar } from "react-native-paper";
import Toast from "react-native-toast-message";
import { config } from "../../config";
import { UseContextState } from "../../global/GlobalContext";

function RedeemProd({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState([]);
  const { userData } = UseContextState();
  const userType = userData?.user?.type;
  const [accessToken, setAccessToken] = useState(null);
  const [filterProducts, setFilterProducts] = useState([]);
  const [filterProductsBtn, setFilterProductsBtn] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [giftCategories, setGiftCategories] = useState([]);

  const filterByCategory = (category) => {
    if (category === "All") {
      setFilterProductsBtn([]);
    } else {
      const filteredProductsBtn = apiResponse.filter(
        (item) =>
          item?.giftCategory?._id.toLowerCase() === category.toLowerCase()
      );
      setFilterProductsBtn(filteredProductsBtn);
    }
  };

  const getGiftCategories = async () => {
    try {
      const response = await fetch(
        `${config.GIFT_URL}gift/get-gift-categories-ids`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (!!data && data?.categories.length) {
        setGiftCategories(data.categories);
      }

      console.log("response", response);
    } catch (err) {
      Toast.show({
        type: "error",
        position: "top",
        text2: err.response.data.message,
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };

  useEffect(() => {
    if (userData && userData.accessToken) {
      setAccessToken(userData.accessToken);
      getGiftCategories();
    }
  }, [userData]);

  const prodList = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.GIFT_URL}gift/get-all-gifts`, {
        method: "GET",
      });

      if (response.status === 200) {
        setLoading(false);
        const data = await response.json();
        return data;
      } else {
        Alert.alert(
          "Prod list HTTP request failed with status:",
          response.status
        );
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error fetching Prod List:", error.message);
    }
  };

  useEffect(() => {
    const fetchList = async () => {
      try {
        const response = await prodList();
        setApiResponse(response?.gifts || []);
        console.log("api response", response);
      } catch (error) {
        Alert.alert("Error fetching prod list:", error);
      }
    };

    fetchList();
  }, []);

  const onChangeHandler = function (query) {
    console.log(query);
    setSelectedCategory(null);
    const filterProducts = apiResponse.filter((item) =>
      item.product_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilterProducts(filterProducts);
  };

  const addToCartApi = async (product_id) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${config.BASE_URL}app/cart/checkout/for/rewards/products`,
        {
          productId: product_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
            "x-user-type": userType,
          },
        }
      );
      console.log("response of add to cart", response);
      if (response.status === 201) {
        Toast.show({
          type: "success",
          position: "top",
          text1: "Success",
          text2: response.data.message,
          visibilityTime: 4000,
          autoHide: true,
        });
        setLoading(false);
      } else {
        console.log("Failed to add product to cart:", response.status);
      }
    } catch (error) {
      console.log("Error adding product to cart:", error.message);
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error",
        text2: error.response.data.message,
        visibilityTime: 4000,
        autoHide: true,
      });
      setLoading(false);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const ProductCard = ({ product }) => (
    <View style={styles.cardContainer}>
      <View>
        <Image source={require("../../assets/tag.png")} style={styles.tag} />
      </View>
      <View style={styles.cardInnerView}>
        <Image
          source={{ uri: product?.giftImages?.[0]?.image_url }}
          style={styles.productImage}
        />
        <Text style={styles.productName}>{product.name.slice(0, 60)}...</Text>
        <Text
          style={styles.productPoints}
        >{`Points: ${product.giftCollectedPoints}`}</Text>
        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => {
            addToCartApi(product._id);
          }}
        >
          <Text style={styles.orderButtonText}>Redeem Product</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Provider>
      <Portal>
        {loading && (
          <View
            style={{
              position: "absolute",
              top: "0%",
              bottom: "0%",
              left: "0%",
              right: "0%",
              zIndex: 2,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(52, 52, 52, 0.3)",
              padding: 14,
              borderRadius: 8,
            }}
          >
            <View style={{ paddingTop: 190 }}>
              <ActivityIndicator color={config.primaryColor} size="large" />
            </View>
          </View>
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: "white" }}
        >
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
              <Text style={styles.headingText}>Products</Text>
              <MaterialIcons
                name="keyboard-arrow-left"
                size={27}
                color="white"
              />
            </View>
          </View>
          <View style={{ paddingLeft: 10, paddingRight: 10 }}>
            <Searchbar
              style={styles.searchBar}
              placeholder="Search"
              onChangeText={onChangeHandler}
            />
          </View>
          {/**horigontal scroll view of categories in format of button */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            <Fragment>
              <TouchableOpacity
                key={"12300"}
                style={[
                  styles.categoryButton,
                  selectedCategory === "12300" && styles.selectedCategoryButton,
                ]}
                onPress={() => {
                  setSelectedCategory("12300");
                  filterByCategory("12300");
                }}
                // onPress={onChangeHandlerForBtn}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === "12300" &&
                      styles.selectedcategoryButtonText,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              {!!giftCategories &&
                giftCategories.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category?._id &&
                        styles.selectedCategoryButton,
                    ]}
                    onPress={() => {
                      setSelectedCategory(category?._id);
                      filterByCategory(category?._id);
                    }}
                    // onPress={onChangeHandlerForBtn}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        selectedCategory === category &&
                          styles.selectedcategoryButtonText,
                      ]}
                    >
                      {category?.name}
                    </Text>
                  </TouchableOpacity>
                ))}
            </Fragment>
          </ScrollView>
          {/* <FlatList
            data={filterProducts.length ? filterProducts : apiResponse}
            renderItem={({ item }) => <ProductCard product={item} />}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            numColumns={2}
          /> */}
          {selectedCategory && selectedCategory !== "12300" ? (
            <FlatList
              data={filterProductsBtn.length ? filterProductsBtn : []}
              renderItem={({ item }) => <ProductCard product={item} />}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              ListEmptyComponent={
                <View style={{ alignSelf: "center" }}>
                  <Text style={{ fontSize: 18, color: "black" }}>
                    No products available for the category
                  </Text>
                </View>
              }
            />
          ) : (
            <FlatList
              data={filterProducts.length ? filterProducts : apiResponse}
              renderItem={({ item }) => <ProductCard product={item} />}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              ListEmptyComponent={
                <View style={{ alignSelf: "center" }}>
                  <Text style={{ fontSize: 18, color: "black" }}>
                    No products available
                  </Text>
                </View>
              }
            />
          )}
        </ScrollView>
      </Portal>
    </Provider>
  );
}

export default RedeemProd;

const styles = StyleSheet.create({
  categoriesContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#f5f5f6",
  },
  selectedCategoryButton: {
    backgroundColor: config.primaryColor,
  },
  selectedcategoryButtonText: {
    color: "white",
  },
  categoryButtonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  screenContainer: {
    backgroundColor: "white",
    flex: 1,
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
  cardContainer: {
    width: "50%",
    backgroundColor: "#f5f5f",
    marginVertical: "1%",
    alignItems: "center",
    paddingRight: 5,
    paddingLeft: 5,
    position: "relative",
  },
  tag: {
    position: "absolute",
    zIndex: 100,
    marginTop: -12,
    right: 39,
    top: 0,
  },
  cardInnerView: {
    width: "100%",
    margin: "auto",
    borderColor: "#e1e1e1",
    borderWidth: 1,
    alignItems: "center",
    borderRadius: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginBottom: 10,
  },
  productName: {
    fontSize: 13,
    marginBottom: 3,
  },
  productPoints: {
    fontSize: 13,
    color: "#777",
    marginBottom: 5,
  },
  orderButton: {
    width: "90%",
    marginTop: 6,
    marginBottom: 6,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: config.primaryColor,
    borderRadius: 8,
    shadowColor: config.primaryColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 90,
    elevation: 9,
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  searchBar: {
    backgroundColor: "#f5f5f6",
    borderRadius: 12,
    fontSize: 12,
    marginBottom: 10,
    borderColor: "lightgray",
    fontWeight: "400",
    flexDirection: "row",
    alignItems: "center",
  },
  searchBarText: {
    fontSize: 16,
    color: "#999",
    fontWeight: "500",
  },
});

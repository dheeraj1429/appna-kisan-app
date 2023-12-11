import { FontAwesome, MaterialIcons, Octicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import imageImport from "../../Constants/imageImport";
import navigationString from "../../Constants/navigationString";
import strings from "../../Constants/strings";
import ProductCard from "../../components/ProductCard";
import { config } from "../../config";

function NewArrivals({ route, navigation }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResult, setSearchResult] = useState([]);
  const [totalPagesCount, setTotalPagesCount] = useState(1);
  const [brandSuggestion, setBrandSuggestion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [render, setRender] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [loadMore, setLoadmore] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const { category, brand_category } = route.params;

  useFocusEffect(
    useCallback(() => {
      axios
        .get(
          `${config.BACKEND_URI}/api/app/get/category/for/new/arrivals/${category}`,
          { withCredentials: true }
        )
        .then((res) => {
          setBrandSuggestion(res?.data?.result);
          setRefreshing(false);
        })
        .catch((err) => {
          console.log(err);
          setRefreshing(false);
        });
    }, [refreshing, brand_category, category])
  );

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      axios
        .get(
          `${
            config.BACKEND_URI
          }/api/app/get/products/new/arrivals?category=${category}&brand_category=${
            brand_category == undefined ? "" : brand_category
          }`,
          { withCredentials: true }
        )
        .then((res) => {
          setSearchResult([...res?.data?.result]);
          setCurrentPage(1);
          setTotalPagesCount(res?.data?.pages);
          setProductCount(res?.data?.result?.length);
          setLoading(false);
          if (currentPage === totalPagesCount) {
            setLoadmore(false);
          }
          setRefreshing(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }, [category, brand_category, render, refreshing])
  );

  const onRefresh = async () => {
    setRefreshing(true);
  };

  const loadMoreItems = async () => {
    if (currentPage < totalPagesCount) {
      await setCurrentPage(currentPage + 1);
      // console.log("CURRENT PAGE AFTER CHANGE VALUE -> ",currentPage);
      axios
        .get(
          `${config.BACKEND_URI}/api/app/get/products/new/arrivals?&page=${
            currentPage + 1
          }&category=${category}&brand_category=${
            brand_category == undefined ? "" : brand_category
          }`,
          { withCredentials: true }
        )
        .then((res) => {
          setSearchResult([...searchResult, ...res?.data?.result]);
          if (currentPage === totalPagesCount) {
            setLoadmore(false);
          }
          setProductCount(res?.data?.result?.length);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const searchWithBrandSuggestion = (item) => {
    navigation.navigate(navigationString.NEW_ARRIVALS, {
      category: category,
      brand_category: item.category_name,
    });
    // setCurrentPage(1);
  };

  const renderbrandSuggestion = useCallback(
    ({ item, index }) => {
      return (
        <TouchableOpacity
          onPress={() => searchWithBrandSuggestion(item)}
          activeOpacity={0.6}
        >
          <Text
            style={
              brand_category != item?.category_name
                ? { ...styles.brandSuggestion }
                : { ...styles.brandSuggestion, color: config.primaryColor }
            }
          >
            {item.category_name}
          </Text>
        </TouchableOpacity>
      );
    },
    [category, brand_category]
  );
  // SET EMPTY PRODUCT FOR GRID ALIGNMENT
  let emptyArr = [{ empty: true, product_images: [] }];
  searchResult?.length % 2 != 0 &&
    setSearchResult([...searchResult, ...emptyArr]);
  // console.log("RESULT",searchResult)
  // console.log("LENGTH=>",searchResult?.length);

  const renderProducts = useCallback(({ item, index }) => {
    return (
      <View>
        {item.empty ? (
          <View
            style={{
              backgroundColor: "#fff", //#f2f2f2
              width: 165,
              height: 250,
              borderRadius: 30,
              margin: 5,
              padding: 20,
              overflow: "hidden",
            }}
          ></View>
        ) : (
          <ProductCard
            product_id={item._id}
            product_code={item.product_code}
            product_name={item?.product_name}
            product_main_category={item?.product_main_category}
            product_category={item?.product_category}
            product_subcategory={item?.product_subcategory}
            product_variant={item?.product_variant}
            product_images={item?.product_images}
            new_arrival={item?.new_arrival}
            navigation={navigation}
          />
        )}
      </View>
    );
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar backgroundColor="white" />
      <View style={styles.productHeader}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons
            onPress={goBack}
            name="keyboard-arrow-left"
            size={27}
            color={config.primaryColor}
          />
          <Text style={styles.searchResultText}>New Arrivals</Text>
        </View>

        {/* <Text style={styles.searchResultText}>{productCount},{currentPage},{totalPagesCount}</Text>  */}

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* <TouchableOpacity activeOpacity={0.6} onPress={()=>navigation.navigate(navigationString.SEARCH_SCREEN)}  >
      <Octicons
        style={{paddingRight: 10}}
        name="search"
        size={20}
        color={config.primaryColor}
      />
      </TouchableOpacity> */}
          <View style={styles.headerIconsContainer}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() =>
                navigation.navigate(navigationString.SEARCH_SCREEN)
              }
            >
              <Octicons
                style={styles.serachIcon}
                name="search"
                size={20}
                color={config.primaryColor}
              />
            </TouchableOpacity>
            <MaterialIcons
              onPress={() => Linking.openURL(strings.CALLUS)}
              style={styles.headerIcon1}
              name="support-agent"
              size={24}
              color={config.primaryColor}
            />
            <FontAwesome
              name="whatsapp"
              onPress={() => Linking.openURL(strings.WHATSAPP)}
              style={styles.headerIcon2}
              size={24}
              color={config.primaryColor}
            />
          </View>
        </View>
      </View>
      <View>
        <View style={{ alignItems: "center", paddingBottom: 10 }}>
          <FlatList
            data={brandSuggestion}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={renderbrandSuggestion}
            keyExtractor={(item) => item._id}
            ItemSeparatorComponent={() => {
              return (
                <View
                  style={{
                    height: "100%",
                  }}
                />
              );
            }}
          />
        </View>
        <View style={{ alignItems: "center" }}>
          {loading ? (
            // <ActivityIndicator size='large' color={config.primaryColor} />
            <View
              style={{
                alignItems: "center",
                width: "100%",
                height: "80%",
                justifyContent: "center",
              }}
            >
              <Image
                source={imageImport.LoaderGif}
                style={{ width: 100, height: 100 }}
              />
            </View>
          ) : (
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              numColumns={2}
              data={searchResult}
              contentContainerStyle={{ alignItems: "center", width: "100%" }}
              ListFooterComponent={() =>
                !loadMore && currentPage < totalPagesCount ? (
                  <View style={{ alignItems: "center", marginVertical: 10 }}>
                    <ActivityIndicator
                      size="large"
                      color={config.primaryColor}
                    />
                    <Text style={{ color: "gray" }}>Loading...</Text>
                    <View style={{ paddingBottom: 255 }}></View>
                  </View>
                ) : (
                  <View style={{ paddingBottom: 265 }}></View>
                )
              }
              showsVerticalScrollIndicator={false}
              renderItem={renderProducts}
              keyExtractor={(item, index) => index}
              onEndReached={loadMoreItems}
              // onEndReachedThreshold={0.2}
            />
          )}
          {!loading && searchResult.length <= 0 && (
            <View
              style={{ alignItems: "center", width: "100%", height: "100%" }}
            >
              <Image
                source={imageImport.NotFoundResult}
                style={{ width: 300, height: 300 }}
              />
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  navigation.navigate(navigationString.SEARCH_SCREEN);
                  setRender((prev) => !prev);
                }}
                style={styles.notFoundProduct}
              >
                <Text style={styles.notFoundText}>Product Not Found</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {/* <View style={{ paddingBottom: 255 }}></View> */}
      </View>
    </View>
  );
}

export default NewArrivals;

const styles = StyleSheet.create({
  productHeader: {
    width: "100%",
    backgroundColor: "white",
    paddingTop: 45,
    paddingBottom: 14,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchResultText: {
    fontSize: 16,
    textTransform: "capitalize",
    paddingLeft: 2,
    fontWeight: "500",
    color: config.primaryColor,
  },
  serachIcon: {
    paddingRight: 10,
    borderColor: "lightgray",
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 40,
  },
  headerIconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
  headerIcon2: {
    borderColor: "lightgray",
    borderWidth: 1,
    backgroundColor: "white",
    paddingLeft: 12.5,
    paddingRight: 11,
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
  brandSuggestion: {
    backgroundColor: "#f5f5f6",
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginVertical: 1,
    marginHorizontal: 5,
    color: "gray",

    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: "lightgray",
    textTransform: "capitalize",
  },
  notFoundProduct: {
    backgroundColor: config.primaryColor,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 60,
    shadowColor: config.primaryColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 9,
  },
  notFoundText: {
    color: "white",
    fontSize: 14,
    letterSpacing: 2,
    fontWeight: "500",
  },
});

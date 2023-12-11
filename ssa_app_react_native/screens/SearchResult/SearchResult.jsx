import {
  FontAwesome,
  Ionicons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useRef, useState } from "react";
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
import { Modal, Portal, Provider } from "react-native-paper";
import imageImport from "../../Constants/imageImport";
import navigationString from "../../Constants/navigationString";
import strings from "../../Constants/strings";
import ProductCard from "../../components/ProductCard";
import { config } from "../../config";
import { UseContextState } from "../../global/GlobalContext";

function SearchResult({ route, navigation }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResult, setSearchResult] = useState([]);
  const [totalPagesCount, setTotalPagesCount] = useState(1);
  const [productFilters, setProductFilters] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [render, setRender] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [loadMore, setLoadmore] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const flatListRef = useRef(null);
  const { scrollIndex } = UseContextState();

  const {
    searchValue,
    searchThroughSubCategory,
    searchThroughBrandCategory,
    searchThroughCategory,
  } = route.params;
  console.log(
    "search --->",
    searchValue,
    "searchThroughSubCategory---->>>>>",
    searchThroughSubCategory,
    searchThroughCategory
  );

  useFocusEffect(
    useCallback(() => {
      // console.log("MAIN USE EFFECT RUNS")
      setLoading(true);
      axios
        .get(
          `${config.BACKEND_URI}/api/app/search/for/products?&search_by=${
            searchValue == undefined ? "" : searchValue
          }&subcategory=${
            searchThroughSubCategory == undefined
              ? ""
              : JSON.stringify(searchThroughSubCategory)
          }&category=${
            searchThroughCategory == undefined ? "" : searchThroughCategory
          }&brand_category=${
            searchThroughBrandCategory == undefined
              ? ""
              : searchThroughBrandCategory
          }&product_tag=${selectedFilter == null ? "" : selectedFilter}`,
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
    }, [
      searchValue,
      searchThroughSubCategory,
      searchThroughBrandCategory,
      searchThroughCategory,
      render,
      selectedFilter,
      refreshing,
    ])
  );

  useFocusEffect(
    useCallback(() => {
      axios
        .get(
          `${
            config.BACKEND_URI
          }/api/app/get/products/tags/for/filter?subcategory=${
            searchThroughSubCategory == undefined
              ? ""
              : JSON.stringify(searchThroughSubCategory)
          }`
        )
        .then((res) => {
          console.log(res?.data);
          setProductFilters(res?.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }, [])
  );

  // useEffect(() => {
  //   if (flatListRef.current && scrollIndex) {
  //     console.log("scroll index", scrollIndex);
  //     flatListRef.current.scrollToIndex({ index: 4, animated: true });
  //   }
  // }, [scrollIndex]);

  const onRefresh = async () => {
    setRefreshing(true);
  };
  //==============LOAD MORE ITEMS FUNCTIONS==========
  const loadMoreItems = async () => {
    // console.log("loadmore called..");
    // console.log("Total page -->",totalPagesCount,'Current page before-->',currentPage);

    if (currentPage < totalPagesCount) {
      await setCurrentPage(currentPage + 1);
      // console.log("CURRENT PAGE AFTER CHANGE VALUE -> ",currentPage);
      await axios
        .get(
          `${config.BACKEND_URI}/api/app/search/for/products?&page=${
            currentPage + 1
          }&search_by=${
            searchValue == undefined ? "" : searchValue
          }&subcategory=${
            searchThroughSubCategory == undefined
              ? ""
              : JSON.stringify(searchThroughSubCategory)
          }&category=${
            searchThroughCategory == undefined ? "" : searchThroughCategory
          }&brand_category=${
            searchThroughBrandCategory == undefined
              ? ""
              : searchThroughBrandCategory
          }&product_tag=${selectedFilter == null ? "" : selectedFilter}`,
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
  //=============LOAD MORE ITEMS FUNCTIONS=============

  const goBack = () => {
    navigation.goBack();
  };

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
            index={index}
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

  const onClickProductFilter = (filterName) => {
    setModalVisible(false);
    console.log(filterName);
    setSelectedFilter(filterName);
  };
  console.log("selectedFilter", selectedFilter);

  const renderProductsTagFilter = useCallback(
    ({ item, index }) => {
      return (
        <TouchableOpacity
          onPress={() => onClickProductFilter(item?._id)}
          activeOpacity={0.4}
          style={{
            borderWidth: 0.6,
            borderColor: "#f2f2f2",
            paddingVertical: 7,
            paddingHorizontal: 13,
            borderRadius: 6,
            marginVertical: 3,
            marginHorizontal: 5,
            textTransform: "capitalize",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: "#999",
              letterSpacing: 1.2,
              textTransform: "capitalize",
            }}
          >
            {item._id == null ? "none" : item._id}
          </Text>
          <MaterialIcons
            name="radio-button-on"
            size={16}
            color={selectedFilter == item._id ? config.primaryColor : "#999"}
          />
        </TouchableOpacity>
      );
    },
    [selectedFilter]
  );

  return (
    <Provider>
      <Portal>
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <View
            style={{ position: "absolute", bottom: 75, right: 22, zIndex: 2 }}
          >
            {selectedFilter === null || selectedFilter === "" ? (
              <View></View>
            ) : (
              <Text
                style={{
                  backgroundColor: "red",
                  color: "white",
                  textAlign: "center",
                  fontSize: 10,
                  fontWeight: "600",
                  left: 70,
                  top: 13,
                  zIndex: 3,
                  height: 15,
                  width: 15,
                  borderRadius: 40,
                }}
              >
                1
              </Text>
            )}

            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
              style={styles.filterProductsBtn}
            >
              <Ionicons
                name="filter"
                style={{ paddingBottom: 1, width: 23 }}
                size={16}
                color="white"
              />
              <Text style={styles.filterProductsText}>Filter</Text>
            </TouchableOpacity>
          </View>

          <StatusBar backgroundColor="white" />
          <View style={styles.productHeader}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons
                onPress={goBack}
                name="keyboard-arrow-left"
                size={27}
                color={config.primaryColor}
              />
              {searchValue !== undefined && (
                <Text style={styles.searchResultText}>{searchValue}</Text>
              )}
              {searchThroughSubCategory && (
                <Text style={styles.searchResultText}>
                  {searchThroughSubCategory?.sub_category}
                </Text>
              )}
              {searchThroughCategory && (
                <Text style={styles.searchResultText}>
                  {searchThroughCategory}
                </Text>
              )}
              {searchThroughBrandCategory && (
                <Text style={styles.searchResultText}>
                  {searchThroughBrandCategory}
                </Text>
              )}
            </View>

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
                    navigation.navigate(navigationString.SEARCH_SCREEN, {
                      searchHistory:
                        searchValue == undefined ? "" : searchValue,
                    })
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
              {/* <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}} >
    <View>
      <Text style={{fontSize:14,fontWeight:'500'}} >Filter Products </Text>
    </View>
  
  </View> */}
              {/* <FlatList
      data={brandSuggestion}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      renderItem={renderbrandSuggestion}
      keyExtractor={(item)=>item._id}
      ItemSeparatorComponent={() => {
        return (
            <View
                style={{
                    height: "100%",
                  
                }} />
        );
    }}
    /> */}
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
                  ref={flatListRef}
                  enableemptysections={true}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  numColumns={2}
                  data={searchResult}
                  contentContainerStyle={{
                    alignItems: "center",
                    width: "100%",
                  }}
                  ListFooterComponent={() =>
                    !loadMore && currentPage < totalPagesCount ? (
                      <View
                        style={{ alignItems: "center", marginVertical: 10 }}
                      >
                        <ActivityIndicator
                          size="large"
                          color={config.primaryColor}
                        />
                        <Text style={{ color: "gray" }}>Loading...</Text>
                        <View style={{ paddingBottom: 265 }}></View>
                      </View>
                    ) : (
                      <View style={{ paddingBottom: 265 }}></View>
                    )
                  }
                  showsVerticalScrollIndicator={false}
                  renderItem={renderProducts}
                  keyExtractor={(index) => index._id}
                  onEndReached={loadMoreItems}
                />
              )}

              {!loading && searchResult.length <= 0 && (
                <View
                  style={{
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
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
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.containerStyle}
        >
          <View>
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: "#f2f2f2",
                paddingTop: 6,
                paddingBottom: 12,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  letterSpacing: 1.4,
                  fontWeight: "500",
                  color: config.primaryColor,
                  paddingLeft: 13,
                }}
              >
                Filter By Tags
              </Text>
              <MaterialIcons
                style={{ paddingRight: 9 }}
                onPress={() => setModalVisible(false)}
                name="close"
                size={22}
                color={config.primaryColor}
              />
            </View>
            <View
              style={{
                borderWidth: 1,
                borderColor: "#f2f2f2",
                marginTop: 12,
                marginHorizontal: 10,
                borderRadius: 10,
              }}
            >
              <FlatList
                style={{ height: 200 }}
                data={productFilters}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                renderItem={renderProductsTagFilter}
                keyExtractor={(item) => item._id}
                //   ItemSeparatorComponent={() => {
                //     return (
                //         <View
                //             style={{
                //                 height: "100%",

                //             }} />
                //     );
                // }}
              />
            </View>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
}

export default SearchResult;

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
  filterProductsBtn: {
    zIndex: 2,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 9,
    paddingHorizontal: 12,
    backgroundColor: config.primaryColor,
    borderRadius: 86,
    shadowColor: config.primaryColor,
    shadowOffset: { width: 10, height: 0 },
    shadowOpacity: 0.49,
    shadowRadius: 10,
    elevation: 5,
  },
  filterProductsText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.6,
    color: "white",
  },
  containerStyle: {
    backgroundColor: "white",
    paddingTop: 9,
    paddingBottom: 12,
    marginHorizontal: 65,
    borderRadius: 10,
    zIndex: 2,
  },
});

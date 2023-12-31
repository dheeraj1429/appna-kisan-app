import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  Linking,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { logger } from "react-native-logs";
import { Modal, Portal, Provider, Surface } from "react-native-paper";
import Toast from "react-native-toast-message";
import imageImport from "../../Constants/imageImport";
import navigationString from "../../Constants/navigationString";
import strings from "../../Constants/strings";
import { convertDate } from "../../Utils/helperFunctions";
import { addToCart } from "../../Utils/localstorage";
import { config } from "../../config";
import { UseContextState } from "../../global/GlobalContext";

function Orders({ navigation }) {
  const [allOrders, setAllOrders] = React.useState([]);
  const [allProducts, setAllProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [render, setRender] = useState(false);
  const [modalVisible, setModalVisible] = useState({
    state: false,
    order_id: "",
  });
  const { authState, cartState, userData } = UseContextState();
  const [viewCart, setViewCart] = useState(false);
  const log = logger.createLogger();
  console.log(userData, "userData");
  console.log(allOrders, "allordersa");
  const accessToken = userData?.accessToken;
  const userType = userData?.user?.type;

  const goToViewOrder = (orderId, clickedOrder) => {
    navigation.navigate(navigationString.VIEW_ORDER, {
      order_id: orderId,
      order: [clickedOrder],
    });
  };
  // console.log("ORDER CANCELLED=>",modalVisible)
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      let url = `${config.BACKEND_URI}/api/app/get/all/user/orders`;
      if (userData?.user?._id) {
        url += `?user_id=${userData?.user?._id}`;
      } else if (authState?.user?.user_id) {
        url += `?customer_id=${authState?.user?.user_id}`;
      }
      console.log(url, "urlllll");
      axios
        .get(url, { withCredentials: true })
        .then((res) => {
          console.log(res?.data, "responsedata");
          setAllOrders(res?.data);
          setLoading(false);
          setRefreshing(false);
        })
        .catch((err) => {
          console.log(err);
          setRefreshing(false);
        });
    }, [refreshing, render])
  );

  const cancelOrderFunc = async (order_id) => {
    await axios
      .patch(
        `${config.BACKEND_URI}/api/app/cancel/order/by/id/${order_id}`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        log.info(res?.data);
        setModalVisible((prev) => ({ ...prev, state: false, order_id: "" }));
        setRender((prev) => !prev);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onRefresh = async () => {
    setRefreshing(true);
  };

  // const addToCartButton = async (product) => {
  //   await addToCart({ ...product, product_quantity: productQuantity });
  //   // log.info('PRODUCT ADDED TO Cart')
  //   setUpdateCart(prev => !prev)
  //   await cartState()
  //   // await clearLocalStorage()
  // }
  const addToCartButton = async (product) => {
    //const products = product.map(item => item.product_quantity_by = "Piece");
    const products = product.map((product) => ({
      ...product,
      _id: product?.product_unique_id,
    }));

    for (const product of products) {
      await addToCart(product);
    }
    // setUpdateCart(prev=>!prev)
    await cartState();
    setViewCart(true);
    // await clearLocalStorage()
  };

  const renderItems = ({ item, index }) => {
    return (
      <View
        key={index}
        style={{
          borderWidth: 0.5,
          padding: 5,
          borderRadius: 8,
          borderColor: "lightgray",
        }}
      >
        {/* <Text style={{color:'black'}} >{item.products[index]?.product_name}</Text> */}
        <Image
          source={{ uri: item?.product_images[0]?.image_url }}
          style={{ width: 50, height: 50 }}
        />
      </View>
    );
  };

  const DownloadInvoice = async (order_id) => {
    console.log("downloading invoice order id ", order_id);

    try {
      const response = await axios.get(
        `https://whale-app-88bu8.ondigitalocean.app/api/get-order-invoice?orderId=${order_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
            "x-user-type": userType,
          },
        }
      );

      console.log("response of invoice download", response);
      console.log("response of invoice download status", response.status);
      if (response.status === 200) {
        console.log("Invoice is downloaded", response.data.data);

        Linking.openURL(
          `https://whale-app-88bu8.ondigitalocean.app/api/csv/${order_id}.csv`
        )
          .then((supported) => {
            if (!supported) {
              console.error("Cannot open URL in browser");
            }
          })
          .catch((error) => console.error("Error opening URL:", error));

        // const path = RNFS.DocumentDirectoryPath + `/invoice.csv`;
        // await RNFS.writeFile(path, response.data, "utf8");

        // const downloadsDirectory = `${FileSystem.documentDirectory}Download/`;
        // const downloadsDirectoryInfo = await FileSystem.getInfoAsync(
        //   downloadsDirectory
        // );

        // if (!downloadsDirectoryInfo.exists) {
        //   await FileSystem.makeDirectoryAsync(downloadsDirectory, {
        //     intermediates: true,
        //   });
        // }

        // const filePath = `${downloadsDirectory}invoice.csv`;
        // await FileSystem.writeAsStringAsync(filePath, response.data.data, {
        //   encoding: FileSystem.EncodingType.UTF8,
        // });
        // console.log("File created in downloads directory:", filePath);
        // const fileContent = await FileSystem.readAsStringAsync(filePath);
        // console.log("file-content", fileContent);

        Toast.show({
          type: "success",
          position: "top",
          text1: "Success",
          text2: response.data.message,
          visibilityTime: 4000, // 4 seconds
          autoHide: true,
        });
        // const lines = response?.data?.data.split("\n");
        // const header = lines[0].split(",");
        // const rows = lines.slice(1);
        // const html = `
        // <html>
        //   <head>
        //     <style>
        //       table {
        //         font-family: Arial, sans-serif;
        //         border-collapse: collapse;
        //         width: 100%;
        //       }

        //       th, td {
        //         border: 1px solid #dddddd;
        //         text-align: left;
        //         padding: 8px;
        //       }

        //       th {
        //         background-color: #f2f2f2;
        //       }
        //     </style>
        //   </head>
        //   <body>
        //     <h1>Invoice Download</h1>
        //     <table>
        //       <tr>
        //         ${header.map((item) => `<th>${item}</th>`).join("")}
        //       </tr>
        //       ${rows
        //         .map(
        //           (row) =>
        //             `<tr>${row
        //               .split(",")
        //               .map((item) => `<td>${item}</td>`)
        //               .join("")}</tr>`
        //         )
        //         .join("")}
        //     </table>
        //   </body>
        // </html>`;
        // const html = `
        // <html>
        //   <body>
        //     <h1>Invoice Download</h1>
        //   </body>

        // </html>`
        // ;

        // const htmlFilePath = `${cacheDirectory}invoice.html`;
        // await writeAsStringAsync(htmlFilePath, htmlContent);

        // Print the HTML file to PDF
        // const file = await printToFileAsync({
        //   html: html,
        //   base64: false,
        // });

        // Share the PDF file

        // Delete the temporary HTML file
        // await deleteAsync(htmlFilePath);
      } else {
        console.log("Failed to Download Invoice:", response.status);
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2: response.data.message,
          visibilityTime: 4000, // 4 seconds
          autoHide: true,
        });
      }
    } catch (error) {
      console.log("someError", error);
      // console.log("Error Failed to Download Invoice:", error.message);
      // Toast.show({
      //   type: "error",
      //   position: "top",
      //   text1: "Error",
      //   text2: error.response.data.message,
      //   visibilityTime: 4000, // 4 seconds
      //   autoHide: true,
      // });
    }
  };

  return (
    <Provider>
      <Portal>
        <View style={styles.orderMainContainer}>
          <Surface style={styles.orderHeader}>
            <Text style={styles.orderHeadingText}>My Orders</Text>
            <View style={styles.headerIconsContainer}>
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
          </Surface>
          {allOrders?.length <= 0 && (
            <View
              style={{
                marginTop: 80,
                paddingHorizontal: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={imageImport.OrderNotFound}
                style={{ width: 200, height: 200 }}
              />
              <Text
                style={{
                  color: "gray",
                  fontWeight: "500",
                  marginTop: -10,
                  paddingBottom: 20,
                  letterSpacing: 1,
                }}
              >
                No Order Founds
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.reset({
                    index: 0,
                    routes: [{ name: navigationString.HOME }],
                  })
                }
                activeOpacity={0.8}
                style={styles.checkoutBtn}
              >
                <Text style={styles.checkoutText}>Shop Now</Text>
              </TouchableOpacity>
            </View>
          )}

          {loading ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: "70%",
              }}
            >
              <Image
                source={imageImport.LoaderGif}
                style={{ width: 100, height: 100 }}
              />
            </View>
          ) : (
            <View>
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 10 }}
                data={allOrders}
                keyExtractor={(item, index) => item._id}
                ListFooterComponent={() => (
                  <View style={{ paddingBottom: 195 }}></View>
                )}
                renderItem={({ item, index }) => {
                  // setAllProducts(item.products)
                  return (
                    <View style={styles.orderCardMainBox}>
                      {/* {item?.order_status == 'cancelled' &&
          <View style={{position:'absolute',backgroundColor: 'lightgray',opacity:0.1,borderRadius:12,width:'100%',height:'100%',zIndex:1}} >
          <Text style={{fontSize:32,color:'black',opacity:100,zIndex:3,opacity:1,paddingVertical:10,backgroundColor:'gray',fontWeight:'700',top:'30%',textAlign:'center'}} >Order Cancelled</Text>
        </View>
       } */}
                      <View style={styles.orderAndPriceBox}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => goToViewOrder(item?.order_id, item)}
                          >
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "600",
                                color: "#555",
                              }}
                            >
                              # Your Order
                            </Text>
                            <Text
                              style={{
                                fontSize: 11,
                                fontWeight: "500",
                                color: "#222",
                              }}
                            >
                              Order-ID : {item?.order_id}
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                fontWeight: "500",
                                color: "#222",
                              }}
                            >
                              {item?.products?.length} Products
                            </Text>
                          </TouchableOpacity>
                          {/* <MaterialIcons name="keyboard-arrow-right" size={26} color="#555" /> */}
                          <View>
                            {item?.order_status != "cancelled" && (
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate(
                                    navigationString.SEND_ENQUIRY,
                                    { order_id: item?.order_id }
                                  )
                                }
                                activeOpacity={0.6}
                                style={styles.sendEnquiry}
                              >
                                <Text
                                  style={{
                                    fontSize: 12,
                                    fontWeight: "600",
                                    color: "#222",
                                    textAlign: "center",
                                  }}
                                >
                                  Send Enquiry
                                </Text>
                              </TouchableOpacity>
                            )}

                            {item?.order_status ==
                            "delivered" ? null : item?.order_status ==
                              "cancelled" ? null : (
                              <>
                                <TouchableOpacity
                                  onPress={() =>
                                    setModalVisible((prev) => ({
                                      ...prev,
                                      state: true,
                                      order_id: item?._id,
                                    }))
                                  }
                                  activeOpacity={0.6}
                                  style={styles.cancelOrder}
                                >
                                  <Text
                                    style={{
                                      fontSize: 12,
                                      fontWeight: "600",
                                      color: "#e24243",
                                      textAlign: "center",
                                    }}
                                  >
                                    Cancel Order
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={[
                                    styles.sendEnquiry,
                                    { marginTop: "5%" },
                                  ]}
                                  //onPress={() => navigation.navigate(navigationString.SEND_ENQUIRY, { order_id: item?.order_id })}
                                  onPress={() => addToCartButton(item.products)}
                                  activeOpacity={0.6}
                                >
                                  <Text
                                    style={{
                                      fontSize: 12,
                                      fontWeight: "600",
                                      color: config.primaryColor,
                                      textAlign: "center",
                                    }}
                                  >
                                    Re Order
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => {
                                    DownloadInvoice(item._id);
                                  }}
                                  activeOpacity={0.6}
                                  style={styles.sendEnquiry}
                                >
                                  <Text
                                    style={{
                                      fontSize: 12,
                                      fontWeight: "600",
                                      color: "#222",
                                      textAlign: "center",
                                    }}
                                  >
                                    Invoice Download
                                  </Text>
                                </TouchableOpacity>
                              </>
                            )}
                          </View>
                        </View>
                        <TouchableOpacity
                          activeOpacity={0.6}
                          onPress={() => goToViewOrder(item?.order_id, item)}
                          style={{ paddingTop: 10 }}
                        >
                          <FlatList
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            data={item?.products}
                            renderItem={renderItems}
                            keyExtractor={(item, index) => index}
                            ItemSeparatorComponent={() => {
                              return (
                                <View style={{ width: 15, height: "100%" }} />
                              );
                            }}
                          />
                        </TouchableOpacity>

                        <View
                          style={{ ...styles.listOrderDetail, paddingTop: 10 }}
                        >
                          <Text
                            style={{
                              fontWeight: "600",
                              color: "#555",
                              fontSize: 14,
                            }}
                          >
                            Order Status :
                          </Text>
                          <Text
                            style={{
                              color:
                                item?.order_status == "cancelled"
                                  ? "#e24243"
                                  : config.primaryColor,
                              fontWeight: "600",
                              textTransform: "capitalize",
                              fontSize: 13,
                            }}
                          >
                            {item?.order_status}
                          </Text>
                        </View>
                        <View style={styles.listOrderDetail}>
                          <Text
                            style={{
                              fontWeight: "600",
                              color: "#555",
                              fontSize: 14,
                            }}
                          >
                            Order Date :
                          </Text>
                          <Text style={styles.orderDate}>
                            {convertDate(item?.createdAt)}
                          </Text>
                        </View>
                        {/* <View style={styles.listOrderDetail}>
              <Text style={{ fontWeight: "600", color: "#555", fontSize: 14 }}>
               Delivery Date{" "}:
              </Text>
              <Text style={styles.orderDate}>30-Aug-2022</Text>
            </View> */}
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          )}
        </View>
        <Modal
          visible={modalVisible?.state}
          onDismiss={() =>
            setModalVisible((prev) => ({ ...prev, state: false }))
          }
          contentContainerStyle={styles.containerStyle}
        >
          <View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#222",
                textAlign: "center",
              }}
            >
              <MaterialIcons name="info-outline" size={24} color="#222" />
            </Text>
            <View>
              <View style={{ paddingTop: 8, paddingBottom: 13 }}>
                <Text style={{ textAlign: "center", color: "gray" }}>
                  {" "}
                  Do you want to cancel order?
                </Text>
                {/* <Text style={{textAlign:'center',color:'gray'}}  >is not registered !!</Text> */}
              </View>
              <View
                style={{
                  paddingTop: 8,
                  borderTopColor: "#f2f2f2",
                  borderTopWidth: 1,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 50,
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() =>
                      setModalVisible((prev) => ({ ...prev, state: false }))
                    }
                  >
                    <View>
                      <Text
                        style={{
                          color: "#e24243",
                          fontSize: 14,
                          fontWeight: "700",
                        }}
                      >
                        No
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => cancelOrderFunc(modalVisible?.order_id)}
                    activeOpacity={0.5}
                  >
                    <View>
                      <Text
                        style={{
                          color: "gray",
                          fontSize: 14,
                          fontWeight: "700",
                        }}
                      >
                        Yes
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
}

const styles = StyleSheet.create({
  orderMainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  orderHeader: {
    width: "100%",
    paddingTop: 50,
    paddingBottom: 13,
    paddingHorizontal: 20,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderHeadingText: {
    fontSize: 20,
    fontWeight: "600",
    color: config.primaryColor,
  },
  headerIconsContainer: {
    flexDirection: "row",
  },
  headerIcon1: {
    borderColor: "lightgray",
    borderWidth: 1,
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 40,
    marginLeft: 14,
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
    marginLeft: 14,
    shadowProp: {
      shadowColor: "#171717",
      shadowOffset: { width: 12, height: 4 },
      shadowOpacity: 0.49,
      shadowRadius: 3,
    },
  },
  orderCardMainBox: {
    borderColor: "#f2f2f2",
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 5,
  },
  orderDate: {
    color: "#555",
    fontSize: 13,
    fontWeight: "600",
  },

  orderAndPriceBox: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  reveived: {
    color: config.primaryColor,
    fontWeight: "600",
    textTransform: "capitalize",
    fontSize: 13,
  },
  listOrderDetail: {
    paddingVertical: 2,
    paddingHorizontal: 0,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  checkoutBtn: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: config.primaryColor,
    borderRadius: 40,
    shadowColor: config.primaryColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 9,
  },
  checkoutText: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 2,
    color: "white",
  },
  sendEnquiry: {
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 40,
    marginBottom: 6,
  },
  cancelOrder: {
    backgroundColor: "#fce8e7",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 40,
  },
  containerStyle: {
    backgroundColor: "white",
    paddingTop: 15,
    paddingBottom: 12,
    marginHorizontal: 80,
    borderRadius: 10,
    zIndex: 2,
  },
});

export default Orders;

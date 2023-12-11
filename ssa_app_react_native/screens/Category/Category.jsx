import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Linking,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Surface } from "react-native-paper";
import imageImport from "../../Constants/imageImport";
import strings from "../../Constants/strings";
import { config } from "../../config";
import CategoryCard from "./CategoryCard";

function Category({ navigation }) {
  const [data, setData] = useState([]);
  const [render, setRender] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${config.BACKEND_URI}/api/get/all/brands`, {
        withCredentials: true,
      })
      .then((res) => {
        // console.log(res?.data);
        setData(res?.data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((err) => {
        console.log(err);
        setRefreshing(false);
      });
  }, [render, refreshing]);

  const onRefresh = async () => {
    setRefreshing(true);
  };

  const DATA = data;

  const renderCategoryItem = ({ item }) => {
    return (
      <CategoryCard
        itemImage={item.brandImage?.image_url}
        category_id={item.category_id}
        navigation={navigation}
        itemName={item.brandName}
      />
    );
  };

  return (
    <View style={styles.cartMainContainer}>
      <Surface style={styles.cartHeader}>
        <Text style={styles.cartHeadingText}>All Brands</Text>
        {/* <TouchableOpacity onPress={()=>setRender(true)} >
          <Text>Render</Text>
        </TouchableOpacity> */}
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
      {loading ? (
        //  <View style={{flex:1,justifyContent:'center',alignItems:'center'}} >
        //   <ActivityIndicator size='large' animating={true} color={config.primaryColor} />
        //  </View>
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
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          data={DATA}
          renderItem={({ item }) => (
            <View style={styles.brandContainer}>
              <FlatList
                ListHeaderComponent={
                  <Text style={styles.brandText}>{item._id}</Text>
                }
                showsVerticalScrollIndicator={false}
                numColumns={4}
                data={item.categories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.brandName}
              />
            </View>
          )}
          keyExtractor={(item) => item._id}
          ListFooterComponent={<View style={{ height: 70 }}></View>}
        />
      )}
    </View>
  );
}

export default Category;

const styles = StyleSheet.create({
  cartMainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  cartHeader: {
    width: "100%",
    paddingTop: 50,
    paddingBottom: 13,
    paddingHorizontal: 20,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartHeadingText: {
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
  brandContainer: {
    paddingBottom: 0,
    alignItems: "flex-start",
  },

  brandText: {
    fontSize: 16,
    paddingTop: 10,
    paddingHorizontal: 18,
    fontWeight: "600",
    textTransform: "capitalize",
    color: config.primaryColor,
  },
  brandBox: {
    alignItems: "center",
  },
  brandName: {
    paddingVertical: 5,
    fontSize: 13,
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
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "rgba(247,247,247,1.0)",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

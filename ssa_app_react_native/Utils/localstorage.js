import AsyncStorage from "@react-native-async-storage/async-storage";

//  set item to local storage
const setItemToLocalStorage = async (item_key, item) => {
  try {
    const jsonValue = JSON.stringify(item);
    await AsyncStorage.setItem(item_key, jsonValue);
  } catch (e) {
    console.log(e);
  }
};

// get Item from local storage
const getItemFromLocalStorage = async (item_key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(item_key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e);
  }
};

// add to cart function
const addToCart = async (item) => {
  try {
    let products = [];
    const productArray = await getItemFromLocalStorage("@cartproducts");
    if (productArray != null) {
      products = productArray;
    }
    products.push(item);
    await setItemToLocalStorage("@cartproducts", products);
  } catch (e) {
    console.log(e);
  }
};

// add to cart function
const removeFromCart = async (product_id) => {
  console.log("product_id", product_id);
  const products = await getItemFromLocalStorage("@cartproducts");
  let result = false;
  let productsAfterRemove = [];
  if (products != null) {
    const find = products.filter((value) => value?._id != product_id);
    console.log("FIND PRODUCTS", find);
    if (find) {
      // productsAfterRemove.push(find)
      await setItemToLocalStorage("@cartproducts", find);
      result = true;
    }
  }
  return result;
};

// get all cart products
const getAllCartProducts = async () => {
  try {
    const result = await getItemFromLocalStorage("@cartproducts");
    return result;
  } catch (err) {
    console.log(err);
  }
};

// get cart products count
const getCartProductCount = async () => {
  try {
    const result = await getItemFromLocalStorage("@cartproducts");
    return result?.length;
  } catch (err) {
    console.log(err);
  }
};

// find product in cart
const findProductInCart = async (product_id) => {
  // console.log("product_id",product_id)
  const products = await getItemFromLocalStorage("@cartproducts");
  let result = false;
  if (products != null) {
    const find = products.find((value) => value?._id === product_id);
    // console.log(find)
    if (find) {
      result = true;
    }
  }
  return result;
};

// clear local storage
const clearLocalStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.log(e);
  }
};

export {
  getItemFromLocalStorage,
  setItemToLocalStorage,
  addToCart,
  getCartProductCount,
  findProductInCart,
  getAllCartProducts,
  removeFromCart,
  clearLocalStorage,
};

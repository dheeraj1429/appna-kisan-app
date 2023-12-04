import React,{useReducer,useEffect,useContext, useState} from "react";
import axios from "axios";
import { config } from "../config";
import { AuthReducer } from "./reducer/AuthReducer";
import { clearLocalStorage,getCartProductCount,getItemFromLocalStorage,setItemToLocalStorage } from "../Utils/localstorage";
import { AsyncStorage } from 'react-native';
import auth from '@react-native-firebase/auth';

const initialState = {
    user:null,
    error:null,
    cartCount:null,
    isAuthenticated:false,
    loading:false,
    homeBanner:null,

}

// creating global context 
const Global = React.createContext(initialState);
export const UseContextState = ()=>useContext(Global);

function GlobalContext({children}) {

  const [userL, setUserL] = useState(null);
  const [userData, setUserData] = useState([]);

  const saveCredentials = (userCredentials) => {
    setUserL(userCredentials);
    //AsyncStorage.setItem('isAuthenticated', 'true'); // Store the authentication state
  };

  const saveUserData = (data) => {
    setUserData(data);
    AsyncStorage.setItem('userData', JSON.stringify(data)); // Store userData in AsyncStorage
  };

  const clearCredentials = () => {
    setUserL(null);
    setUserData(null);
    AsyncStorage.removeItem('userData'); // Remove userData from AsyncStorage
  };

  const setUser = (userData) => {
    dispatch({ type: 'LOG_IN', payload: userData });
  };
  const [authState, dispatch] = useReducer(AuthReducer, initialState);

    console.log("AuthState ",authState)
    // getting authenticated user
    // const fetchAuthuser =async()=>{
    //     try{
    //          const user =  await getItemFromLocalStorage('user');
    //          if(user != null){
    //             dispatch({type:'LOG_IN',payload:user})
    //             console.log("LOG IN SUCCESS")
    //          }
    //          else{
    //             dispatch({type:"ERROR",payload:'error'})
    //         }
    //     }
    //     catch(err){
    //         console.log(err)
    //      }
    // }
    const fetchAuthuser = async () => {
      try {
        const user = await getItemFromLocalStorage('user');
        if (user != null) {
          dispatch({ type: 'LOG_IN', payload: user });
          console.log("LOG IN SUCCESS");
        } else {
          const storedUserData = await AsyncStorage.getItem('userData');
          if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
            dispatch({ type: 'LOG_IN', payload: storedUserData });
            console.log("LOG IN SUCCESS (from AsyncStorage)");
          } else {
            dispatch({ type: "ERROR", payload: 'error' });
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    // logout user
    const logoutAuthUser = async()=>{
        try{
            await AsyncStorage.removeItem('user')
            //auth().signOut();
            dispatch({type:'LOG_OUT'})
            console.log("LOG OUT SUCCESS")

        }
        catch(err){
            console.log(err)
        }
    }
    // const logoutAuthUser = async () => {
    //   console.log("console.log1");

    //   try {
    //     console.log("console.log2");

    //     await AsyncStorage.removeItem('user');
    //     console.log("console.log3");

    //     await AsyncStorage.removeItem('userData'); // Remove userData from AsyncStorage
    //     console.log("console.log4");

    //     dispatch({ type: 'LOG_OUT' });
    //     console.log("LOG OUT SUCCESS");
    //     navigation.navigate(navigationString.LOGIN);
    //     console.log("console.log5");


    //   } catch (err) {
    //     console.log(err);
    //   }
    // };
    // const logoutAuthUser = async () => {
    //   try {
    //     console.log("console.log2");
  
    //     await AsyncStorage.removeItem('user');
    //     console.log("console.log3");
  
    //     await AsyncStorage.removeItem('userData'); // Remove userData from AsyncStorage
    //     console.log("console.log4");
  
    //     dispatch({ type: 'LOG_OUT' });
    //     console.log("LOG OUT SUCCESS");
    //     console.log("console.log5");
  
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };
    // get cart state
    const cartState=async()=>{
      try{  
        const count = await getCartProductCount();
        dispatch({type:'CART_STATE',payload:count});
      }
      catch(err){
        console.log(err);
      }
    }
    // get home screen banners
    const getHomeScreenBanner = async()=>{
      try{
        await axios.get(`${config.BACKEND_URI}/api/app/get/all/home/screen/banner`,{withCredentials:true})
        .then(res=>{
          // console.log(res?.data);
          dispatch({type:'HOME_SCREEN_BANNER',payload:res?.data});
        })
        .catch(err=>{
          console.log(err)
        })

      }
      catch(err){
        console.log(err);
      }
    }

    useEffect(()=>{
      // const fetchStoredUserData = async () => {
      //   try {
      //     const storedUserData = await AsyncStorage.getItem("userData");
      //     if (storedUserData) {
      //       setUserData(JSON.parse(storedUserData));
      //       console.log("Using stored userData");
      //     }
      //   } catch (err) {
      //     console.log(err);
      //   }
      // };
  
      // fetchStoredUserData();
        fetchAuthuser();
        cartState();
        getHomeScreenBanner();
    },[])

    const value = {
      authState,
      fetchAuthuser,
      logoutAuthUser,
      cartState,
      userL,
      userData,
      saveCredentials,
      saveUserData,
      clearCredentials,
      setUser,
    };

      return <Global.Provider value={value}>{children}</Global.Provider>;
  
  
}

export default GlobalContext


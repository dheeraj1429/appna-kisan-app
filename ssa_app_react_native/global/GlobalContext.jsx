import React,{useReducer,useEffect,useContext, useState} from "react";
import axios from "axios";
import { config } from "../config";
import { AuthReducer } from "./reducer/AuthReducer";
import { clearLocalStorage,getCartProductCount,getItemFromLocalStorage,setItemToLocalStorage } from "../Utils/localstorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from '@react-native-firebase/auth';

const initialState = {
    user:null,
    error:null,
    cartCount:null,
    isAuthenticated:false,
    loading:false,
    homeBanner:null
}

// creating global context 
const Global = React.createContext(initialState);
export const UseContextState = ()=>useContext(Global);

function GlobalContext({children}) {

  const [userL, setUserL] = useState(null);
  const [userData, setUserData] = useState(null);
  console.log("Fdbrgdbgdb",userData);

  const saveCredentials = (userCredentials) => {
    setUserL(userCredentials);
  };

  const saveUserData = (data) => {
    setUserData(data);
  };

  const clearCredentials = () => {
    setUserL(null);
    setUserData(null);
  };

  const setUser = (userData) => {
    dispatch({ type: 'LOG_IN', payload: userData });
  };
  const [authState, dispatch] = useReducer(AuthReducer, initialState);

    console.log("AuthState ",authState)
    // getting authenticated user
    const fetchAuthuser =async()=>{
        try{
             const user =  await getItemFromLocalStorage('user');
             if(user != null){
                dispatch({type:'LOG_IN',payload:user})
                console.log("LOG IN SUCCESS")
             }
             else{
                dispatch({type:"ERROR",payload:'error'})
            }
        }
        catch(err){
            console.log(err)
         }
    }

    // logout user
    const logoutAuthUser = async()=>{
        try{
            await AsyncStorage.removeItem('user')
            auth().signOut();
            dispatch({type:'LOG_OUT'})
            console.log("LOG OUT SUCCESS")

        }
        catch(err){
            console.log(err)
        }
    }

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
      setUser
    };

      return <Global.Provider value={value}>{children}</Global.Provider>;
  
  
}

export default GlobalContext


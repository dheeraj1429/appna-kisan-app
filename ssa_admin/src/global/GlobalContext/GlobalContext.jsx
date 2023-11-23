import React,{useReducer,useEffect,useContext} from "react";
import axios from "axios";
import {config} from "../globalConfig"
import { AuthReducer } from "./reducer/AuthReducer";

const initialState = {
    user:null,
    error:null,
    isAuthenticated:false,
    loading:false
}

// creating global context 
const Global = React.createContext(initialState);
export const UseContextState = ()=>useContext(Global);

function GlobalContext({children}) {
    const [authState , dispatch ] = useReducer(AuthReducer,initialState)






// --===========================
    console.log("singh")

// --===========================









    console.log("AuthState ",authState)
    // getting authenticated user
    const fetchAuthuser = async()=>{
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/get/user`,{withCredentials:true})
        .then(res=>{
            console.log(res)
            if(res?.data?.status === true){
                dispatch({type:"LOG_IN",payload:res.data})
            }
            else{
                dispatch({type:"ERROR",payload:res?.data?.message})
            }
            
        })
        .catch(err=>{
            console.log(err)
            dispatch({type:"ERROR",payload:"Not Authenticated"})
        })
    }
    const logoutAuthUser = async()=>{
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/admin/logout`,{withCredentials:true})
        .then(res=>{
            console.log(res)
            dispatch({type:"LOG_OUT"})
        })
        .catch(err=>{
            console.log(err)
            dispatch({type:"ERROR",error:err})
        })

    }

    useEffect(()=>{
        fetchAuthuser();
    },[])

    const value = {authState,fetchAuthuser,logoutAuthUser}

  return <Global.Provider value={value} >{children}</Global.Provider>
  
  
}

export default GlobalContext


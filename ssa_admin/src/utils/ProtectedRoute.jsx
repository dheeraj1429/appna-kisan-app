import React,{useEffect} from 'react'
import {useNavigate,Navigate,useLocation,Outlet} from "react-router-dom"
import DashboardLayout from '../layouts/dashboard'
import { UseContextState } from "../global/GlobalContext/GlobalContext"

function ProtectedRoute({Component,user}) {
    const {authState} = UseContextState()
    const navigate = useNavigate()
    const location = useLocation()
    const authUser = authState.isAuthenticated;
    
    return authUser? <Outlet/>:<Navigate to="/login" state={{from:location}} replace  />
 

}

export default ProtectedRoute
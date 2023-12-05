import React from 'react'
import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { UseContextState } from "../../global/GlobalContext/GlobalContext";
import LogoutIcon from '@mui/icons-material/Logout';

function LogoutButton() {
  const {authState,logoutAuthUser} = UseContextState()
  const [open, setOpen] = useState(null);


  const handleLogout=()=>{
    const confirm = window.confirm("Do you want to logout?")
    if(confirm){
      logoutAuthUser()
    }
    setOpen(null);
  }
  return (
    <>
        <h3 className='logout_btn ' onClick={handleLogout}><LogoutIcon className='logout_icon'/> Logout</h3>
    </>
  )
}

export default LogoutButton
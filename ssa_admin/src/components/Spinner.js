import React from 'react'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function LoadingSpinner(props) {
  return (
    <>
     {/* #################### LOADING SPINNER ######################## */}
    <Backdrop
       sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
       open={props.loading}
       // onClick={handleClose}
     >
       <CircularProgress color="inherit" />
     </Backdrop>
   {/* #################### LOADING SPINNER ######################## */}
   </>
  )
}

export default LoadingSpinner
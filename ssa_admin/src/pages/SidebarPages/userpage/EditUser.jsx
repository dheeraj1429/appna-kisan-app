import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';

import { InputAdornment,Container,TextField,Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Iconify from '../../../components/Iconify';
import {uploadFileToFirebase,returnFileName,deleteImageFromFirebase,splitString} from "../../../global/globalFunctions"
import noImage from '../../../assests/No_image.svg'
import palette from '../../../theme/palette';
import ConfimModal from "../../../global/Modals/ConfimModal"
import CustomizedSnackbars from '../../../global/Snackbar/CustomSnackbar';

function EditUser({handleClose,userId}) {
    const [ render, setRender ] = useState(false);
    const [ loading, setLoading] = useState(false)
  const [snackbarOpen,setSnackbarOpen ] = useState(false)
  const [openConfimModal ,setOpenConfimModal] = useState(false);
  const [ userData, setUserData ] = useState([])
  const [message ,setMessage] = useState({type:"",message:""})

  console.log("userId",userId)
  console.log("USER DATA",userData)

  //##################### GET USER BY ID #####################
  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/get/${userId}`,{withCredentials:true})
    .then(res=>{
      console.log(res);
      setUserData(res?.data);

    })
  },[render])
  //##################### GET USER BY ID #####################

  // #####################  handle Change #####################
  const handleChange=(e)=>{
    setUserData((prev)=>({...prev,[e.target.name]:e.target.value}))
  }
  // #####################  handle Change #####################

   // ##################### handle form submit  #####################
   const handleSubmit = async(e)=>{
    e.preventDefault()
    setLoading(true);
   await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/user/edit/${userId}`,{...userData},{withCredential:true})
    .then(res=>{
        console.log(res)
        setLoading(false);
        setMessage((prev)=>({...prev,type:'success',message:'User Updated Successfully !!'}))
        setSnackbarOpen(true);
        setRender(prev=>!prev);
  
    })
    .catch(err=>{
        console.log(err);
        setLoading(false);
    })
    setLoading(false);
}
   // ##################### handle form submit  #####################
 

  // ##################### SNACK BAR FUNCTIONs ##################
const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  
    setSnackbarOpen(false);
  };
  // ##################### SNACK BAR FUNCTIONs ##################
  return (
    <>
      {/* #################### SANCKBAR MESSAGE ######################## */}
    
       <CustomizedSnackbars onOpen={snackbarOpen} type={message?.type} handleClose={handleCloseSnackbar}  message={message?.message} />
     
 
 {/* #################### SANCKBAR MESSAGE ######################## */}


   <div className='close_edit_Category ' >
    <HighlightOffIcon style={{color:palette.primary.main}} onKeyDown={handleClose}  onClick={handleClose} fontSize='large' />
    {/* <HighlightOffIcon style={{color:palette.primary.main}}  fontSize='large' /> */}
</div>
        <Container maxWidth="md">
    <div className='add-category-pad-top-bot'>
        <h2  >
       View or Edit User
        </h2>
        <p>  View and Edit Users necessary information from here</p>
    </div>      <form onSubmit={handleSubmit}>
                    <div className='add-user-form-style' >
                    <div style={{width:'100%'}} className='add_product_label_input'>
                    <label htmlFor="">User Name  </label>
                    <TextField  fullWidth className='product_form_input' id="outlined-basic" name="username"  onChange={handleChange} value={userData?.username} placeholder="User Name " variant="outlined" />
                    </div>
                    <div style={{width:'100%'}} className='add_product_label_input'>
                    <label htmlFor=""> Phone Number  </label>
                    <TextField  fullWidth type='number' className='product_form_input' id="outlined-basic" name="phone_number" onChange={handleChange} value={userData?.phone_number}  placeholder="Phone Number" variant="outlined" />
                    </div>
                    </div>
                   
                    <div className='add-user-form-style' >
                    <div style={{width:'100%'}} className='add_product_label_input'>
                    <label htmlFor=""> User Email </label>
                    <TextField  type='email' fullWidth className='product_form_input' id="outlined-basic" name="email" onChange={handleChange} value={userData?.email} placeholder="User Email" variant="outlined" />
                    </div>
                    <div style={{width:'100%'}} className='add_product_label_input'>
                    <label htmlFor="">Gst No. </label>
                    <TextField  fullWidth  className='product_form_input' id="outlined-basic" style={{textTransform:'uppercase'}} name="gst_number" onChange={handleChange} value={userData?.gst_number}  placeholder="Gst No." variant="outlined" />
                    </div>
                    </div>
                    <div className='add-user-form-style' >
                    <div style={{width:'100%'}} className='add_product_label_input'>
                    <label htmlFor="">State </label>
                    <TextField  fullWidth className='product_form_input' id="outlined-basic" name="state" onChange={handleChange} value={userData?.state} placeholder="State" variant="outlined" />
                    </div>
                    <div style={{width:'100%'}} className='add_product_label_input'>
                    <label htmlFor="">Pincode </label>
                    <TextField  type='number' fullWidth className='product_form_input' id="outlined-basic" name="pincode" onChange={handleChange} value={userData?.pincode}  placeholder="Pincode" variant="outlined" />
                    </div>
                    <div style={{width:'100%'}} className='add_product_label_input'>
                    <label htmlFor="">Transport Details </label>
                    <TextField  fullWidth className='product_form_input' id="outlined-basic" name="transport_detail"  onChange={handleChange} value={userData?.transport_detail} placeholder="Transport Details" variant="outlined" />
                    </div>
                    </div>
                    <div className='add_product_label_input'>
                    <label htmlFor=""> User Address  </label>
                    <TextField multiline rows={3}  fullWidth className='product_form_input' name='address' onChange={handleChange} value={userData?.address} id="outlined-basic" placeholder="Enter User Address " variant="outlined" />
                    </div>
                    <div style={{paddingTop:20}} >

<Button  variant='outlined' style={{marginRight:"10px"}} onClick={handleClose}  startIcon={<Iconify icon="akar-icons:arrow-back" />} > GO BACK  </Button>

 <Button   variant='contained' type='submit' style={{padding:"6px 30px"}} startIcon={<Iconify icon="ant-design:plus-outlined" />} > SAVE </Button>

</div>
                    </form>
      
  
   </Container>




   </>
  )
}

export default EditUser
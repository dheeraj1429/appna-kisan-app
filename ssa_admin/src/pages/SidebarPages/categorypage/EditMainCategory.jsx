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

function EditMainCategory({handleClose}) {
  const [fileUpload, setFileUpload] = useState(null);
    const [mainCategory, setMainCategory] = useState([]);
    const [searchMainCategory, setSearchMainCategory] = useState('');
  const [ userselectedCategory , setuserSelectedCategory ] = useState({main_Catgeory:''})
  const [newMainCategory , setNewMainCategory] = useState({name:"",image:null})
  const [showEditBox , setShowEditBox ] = useState(false)
  const [ render, setRender ] = useState(false);
  const [snackbarOpen,setSnackbarOpen ] = useState(false)
  const [openConfimModal ,setOpenConfimModal] = useState(false)
  const [message ,setMessage] = useState({type:"",message:""})
  const [ addMainCategory,setAddMainCategory ] = useState('')

  console.log(userselectedCategory)
  console.log(mainCategory)
  console.log("NEWMAIN=>",newMainCategory)

     //================= GET ALL MAIN CATEGORY =================
  useEffect(() => {
    axios
    .get(`${process.env.REACT_APP_BACKEND_URL}/api/get/addproduct/maincategory`, { withCredentials: true })
    .then((res) => {
      console.log(res);
      setMainCategory(res?.data);
    })
    .catch((err) => {
      console.log(err);
    });
  }, [render]);
  //================= GET ALL MAIN CATEGORY =================

   //================= HANDLE ON SELECT CATEGORIES AND GET SELECTED CATEGORIES  =================
   const handleSelectedMainCategory=(selectedMainCategory,mainCategoryImage)=>{
    setuserSelectedCategory((prev)=>({...prev,main_Catgeory:selectedMainCategory}))
    setNewMainCategory((prev)=>({...prev,name:selectedMainCategory,image:mainCategoryImage}))
    setFileUpload(null)
    setShowEditBox(true)
  }
  //================= HANDLE ON SELECT CATEGORIES AND GET SELECTED CATEGORIES =================

  console.log("fileUpload",fileUpload)
  // ################### MAIN CATEGORY IMAGE UPLOAD  ########################
  const handleMainCategoryFileChange =async (e) => {
    const image = e.target.files[0]
    setFileUpload(image);
    setNewMainCategory((prev)=>({...prev,image:null}))
  };
// ################### MAIN CATEGORY IMAGE UPLOAD  ########################

// ================ REMOVE MAIN CATEGORY IMAGE =======================
const handleRemoveMainCategoryImage =async(mainCategoryObj,userselectedCategory)=>{
    console.log("DELETE IMAGE FUNCTION",mainCategoryObj)
 
     
      deleteImageFromFirebase(mainCategoryObj?.image?.path,mainCategoryObj?.image?.image_name)
        await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/delete/main/category/image/?old_main_category_name=${userselectedCategory?.main_Catgeory}`,{withCredentials:true})
        .then(res=>{
          console.log(res)
         if(res?.data?.status === true){
          setMessage((prev)=>({...prev,type:"success",message:"Image Deleted Successfully !"}))
          setSnackbarOpen(true)
          setOpenConfimModal(false)
          setRender(prev=>!prev)
        setShowEditBox(false)
         }
        
        })
        .catch(err=>{
          setMessage((prev)=>({...prev,type:"error",message:"Image Deleted Failed !"}))
          console.log(err)
        })
      setFileUpload((prev)=>({...prev,mainCategoryImage:null}));
        
  }
//========================= REMOVE MAIN CATEGORY IMAGE =================

 // ======================== HANDLE SAVE ======================== 
 const handleSubmit=async(e)=>{
  e.preventDefault()
  let mainCategoryImageToFirebase;
  if(fileUpload){
   mainCategoryImageToFirebase=await uploadFileToFirebase(`/ssastore/allcategories/maincategories/${newMainCategory?.name}/`,fileUpload)
  }
    let data={
        main_category_name:newMainCategory?.name,
        main_category_slug:splitString(newMainCategory?.name),
        main_category_image:mainCategoryImageToFirebase
    }
    await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/update/all/main/category/?old_main_category_name=${userselectedCategory?.main_Catgeory}`,{...data},{withCredentials:true})
    .then(res=>{
        console.log(res)
        setMessage((prev)=>({...prev,type:"success",message:"Updated Successfully !"}))
        setSnackbarOpen(true)
        setRender(prev=>!prev)
    })
    .catch(err=>{
        console.log(err)
    })
}

 // ======================== HANDLE SAVE ======================== 

// ############## CONFIRM MAIN CATEGORY MODAL ###########
const handleCloseMainCategoryConfirmModal=()=>{
  setOpenConfimModal(false)
  
}
// ############## CONFIRM MAIN CATEGORY MODAL ###########

// ##################### SNACK BAR FUNCTIONs ##################
const handleCloseSnackbar = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }

  setSnackbarOpen(false);
};
// ##################### SNACK BAR FUNCTIONs ##################

// ##################### ADD NEW MAIN CATEGORY #################
const handleAddMainCategory=async(data)=>{
  const addData ={
    mainCategory:data,
    main_category_slug:splitString(data)
  }
  console.log("NEW MAIN CATEGORY DATA",addData)
  await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/create/maincategory`,{...addData},{withCredentials:true})
  .then(res=>{
    console.log(res)
    setRender(prev=>!prev)
  })
  .catch(err=>{
    console.log(err)
  })
}
// ##################### ADD NEW MAIN CATEGORY #################


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
       Create or Edit Brands
        </h2>
        <p>  Create and Edit your Product Brands and necessary information from here</p>
    </div>
 
  {/*============ CONFIRM MODAL ============ */}
  <ConfimModal open={openConfimModal} title="Delete" onYes={()=>handleRemoveMainCategoryImage(newMainCategory,userselectedCategory)} message="Do you want to delete?" handleClose={handleCloseMainCategoryConfirmModal}  />
       {/*============ CONFIRM MODAL ============ */}
    

    <div className='main-category-edit-box' >
   
             {/* ======================= MAIN CATEGORY SELECTION BOX ===================== */}
             <div className="main-edit-category-list">
             <div style={{paddingBottom:5}}>
        <h4  >
       Add a New Brand Name
        </h4>
       
    </div>
      {/* <label htmlFor="">Main Category  </label> */}
      <div className='flex' style={{paddingBottom:10}} >
       <TextField required fullWidth id="outlined-basic" value={addMainCategory} onChange={(e)=>setAddMainCategory(e.target.value)}  placeholder="Brand Name " variant="outlined" />
       <Button   variant='contained' onClick={()=>handleAddMainCategory(addMainCategory)}  style={{padding:"15px 30px",fontSize:16,marginLeft:10}} startIcon={<Iconify icon="ant-design:plus-outlined" />} > Add </Button>

      </div>
      <div style={{paddingBottom:5,paddingTop:10}}>
        <h4  >
       Edit or Modify Your Brands 
        </h4>
       
    </div>
          
                <div className="category-single-search">
                  
                  <SearchIcon style={{ color: '#637281' }} />
                  <input
                    className="remove-radius-input"
                    value={searchMainCategory}
                    onChange={(e) => setSearchMainCategory(e.target.value)}
                    type="search"
                    placeholder="Search In Brands..."
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <ul>
                  {mainCategory
                    ?.filter((value) => {
                      if (searchMainCategory === '') {
                        return value;
                      } else if (value?._id?.toLowerCase().includes(searchMainCategory?.toLowerCase())) {
                        return value;
                      }
                    })
                    .map((value, index) => (
                      <div key={value?._id} onClick={()=>handleSelectedMainCategory(value?._id,value?.main_category_image)} className={value?._id === userselectedCategory?.main_Catgeory ? "add-product-category-list-active ":"add-product-category-list" }>
                      <div className='flex' >
                      {/* <img
                          className="product-table-image"
                          alt="product"
                          src={
                            value?.main_category_image?.image_url  ?  value?.main_category_image?.image_url :noImage
                          }
                        /> */}

                        <li className="category-text">{value?._id}</li>
                      </div>
                        {value?._id === userselectedCategory?.main_Catgeory && <DoubleArrowIcon style={{color:palette.primary.main}} />}
                      </div>
                    ))}
                
               {/* <li>asda</li>
               <li>asda</li>
               <li>asda</li>
               <li>asda</li>
               <li>asda</li> */}
                </ul>
                {/* ======================= MAIN CATEGORY SELECTION BOX ===================== */}
             

              </div>
              {/* ============================= EDIT BOX ======================= */}
               {showEditBox && (
                 <form onSubmit={handleSubmit} className="edit-name-maincategory" >
                      {/* <h4 style={{paddingBottom:8,paddingTop:0}}>Change Image or Upload a New One </h4> */}
             {/* <div className='main-category-image-change' >
                 <img
                               className="edit-main-category-image"
                               alt="product"
                          
                               src={ newMainCategory?.image?.image_url ? newMainCategory?.image?.image_url : fileUpload ? URL.createObjectURL(fileUpload) :
                                noImage
                               }

                             />
             
              <Button className='upload-edit-main-category' variant="contained" component="label">
             Upload
             <input hidden accept="image/*" type="file" name="mainCategoryImage"  onChange={handleMainCategoryFileChange } />
           </Button>
              </div> */}
                 <h4 style={{paddingBottom:4,paddingTop:6}}>Change Brand Name </h4>
             {/* <label style={{padding:"4px 0px"}} >Main Category  </label> */}
             <TextField 
              fullWidth required id="outlined-basic" value={newMainCategory?.name} onChange={(e)=>{setNewMainCategory((prev)=>({...prev,name:e.target.value}))}} placeholder="Main Category " variant="outlined" />
                  {/* <div className='main-category-remove-image-icon' >
             <CloseIcon style={{color:palette.primary.main,cursor:'pointer'}} onClick={()=>setOpenConfimModal(true)} />
             </div> */}
           
              <div style={{paddingTop:20}} >
                      <Button  variant='outlined' style={{marginRight:"10px"}} onClick={handleClose} startIcon={<Iconify icon="akar-icons:arrow-back" />} > GO BACK  </Button>
                     
                    <Button   variant='contained' type='submit' style={{padding:"6px 30px"}} startIcon={<Iconify icon="ant-design:plus-outlined" />} > SAVE </Button>
                   
                       </div>
                
     
             </form>
               )}
              {/* ============================= EDIT BOX ======================= */}

        </div>
    
  
   </Container>




   </>
  )
}

export default EditMainCategory
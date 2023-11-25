import React,{useState,useEffect} from 'react'
import axios from 'axios';
import FileUploadDesign from '../../../components/common/FileUploadDesign';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {MenuItem } from '@mui/material';
import {Button} from '@mui/material';
import Iconify from '../../../components/Iconify';
import palette from '../../../theme/palette';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { uploadFileToFirebase } from 'src/global/globalFunctions';
import CircularProgress from '@mui/material/CircularProgress';
import CustomizedSnackbars from '../../../global/Snackbar/CustomSnackbar';
import noImage from '../../../assests/No_image.svg'
import CloseIcon from '@mui/icons-material/Close';
import Backdrop from '@mui/material/Backdrop';
import CancelIcon from '@mui/icons-material/Cancel';



function AddProducts({handleClose}) {
   const [productData , setProductData ] = useState({product_main_category:'choose_brand',product_category:'choose_category',product_subcategory:'choose_sub_category'})
   const [ mainCategory,setMainCategory ] = useState([]);
   const [ category,setCategory ] = useState([]);
   const [ subCategory,setSubCategory ] = useState([]);
   const [message ,setMessage] = useState({type:"",message:""})
   const [ loading, setLoading  ] =useState(false)
   const [fileUpload , setFileUpload ] = useState()
   const [snackbarOpen,setSnackbarOpen ] = useState(false)
   const [ render, setRender ] = useState(false)
   console.log("PRODUCT DATA",productData)

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
  }, []);
  //================= GET ALL MAIN CATEGORY =================

  // GET CATEGORY BY BRAND
  useEffect(()=>{
    if(productData?.product_main_category === 'choose_brand')return;
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/get/category/for/addproduct?main_category=${productData?.product_main_category}`)
    .then(res=>{
      console.log(res)
        setCategory(res?.data)
    })
  },[productData?.product_main_category])
  // GET CATEGORY BY BRAND

  // GET SUB CATEGORY BY BRAND
  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/get/category/for/addproduct?category=${productData?.product_category}`)
    .then(res=>{
      console.log(res)
      setSubCategory(res?.data[0]?.subcategory)
    })
  },[productData?.product_category])
  // GET SUB CATEGORY BY BRAND


    const handleChange=(e)=>{
        setProductData((prev)=>({...prev,[e.target.name]:e.target.value}))
    }
    
    // File upload function 
    const handleFileUpload = (e)=>{
      if(e.target.files?.length > 4) return alert("You can only select 4 images")
      console.log(e.target.files)
      let allImages = [...e.target.files]
      setFileUpload(allImages)

    }
    console.log(fileUpload)

    // remove image after select
    const handleRemoveImage=(removeByIndex)=>{
      console.log(removeByIndex)
      const afterRemove= fileUpload?.filter((value,index)=>{
        return index !=removeByIndex
      })
      console.log("AFTER REMOVE IMAGE=>",afterRemove )
      setFileUpload(afterRemove)
    }

    // handle form submit 
    const handleSubmit = async(e)=>{
      e.preventDefault()
     
      if(!fileUpload){
        alert('Add Atleast 1 Product Image !!');
        return
      }
      setLoading(true);
      let productsImageToFirebase=[];
      console.log("productsImageToFirebase",productsImageToFirebase)
      if(fileUpload.length > 0){
        for(let i = 0; i<fileUpload?.length;i++){
          productsImageToFirebase[i]= await uploadFileToFirebase(`/ssastore/products/${productData?.product_code}/`,fileUpload[i]);


        }
       }
     await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/add/new/product`,{...productData,product_images:productsImageToFirebase},{withCredential:true})
      .then(res=>{
          console.log(res)
          setLoading(false);
          setMessage((prev)=>({...prev,type:'success',message:'Product Added Successfully !!'}))
          setSnackbarOpen(true);
          setProductData({
          product_main_category:'choose_brand',
          product_category:'choose_category',
          product_subcategory:'choose_sub_category',
          product_code:'',
          product_name:'',
          product_variant:'',
          product_quantity:'',
          product_description:'',
          color:'',
          size:'',
          cartoon_total_products:'',
          product_price: '',
          b2b_user_product_price: '',
          b2c_user_product_price: '',
          product_reward_points: '',
          product_collected_points: ''
        });
          setFileUpload([])
      })
      .catch(err=>{
          console.log(err);
          setLoading(false);
      })
      setLoading(false);
  }
   

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
      {/* #################### LOADING SPINNER ######################## */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    {/* #################### LOADING SPINNER ######################## */}
    {/* #################### SANCKBAR MESSAGE ######################## */}
    <CustomizedSnackbars onOpen={snackbarOpen} type={message?.type} handleClose={handleCloseSnackbar}  message={message?.message} />
 
    {/* #################### SANCKBAR MESSAGE ######################## */}
        <div className='product-conatiner'>
        <div className='addproducts_slider'>
            <div className='slider_heading'>
                <h4>Add Products</h4>
                <p>Add your product and necessary information from here</p>
            </div>
            <div className='close_edit_Category ' >
    <HighlightOffIcon style={{color:'red'}} onKeyDown={handleClose}  onClick={handleClose} fontSize='large' />
    {/* <HighlightOffIcon style={{color:palette.primary.main}}  fontSize='large' /> */}
</div>
            <div className='addproduct_img_and_details flex'>
                <div className='file_upload_col'>
                    <FileUploadDesign fileUpload={fileUpload} handleFileUpload={handleFileUpload} />
                    <div className='' style={{paddingTop:20}} >
                  {fileUpload?.length > 0 && 
                   fileUpload?.map((value,index)=>(
                    <div key={index} className='uploaded-images-preview' >
                    <img className='category-table-image' alt="product" src={URL.createObjectURL(value)} />
                    <p  >{value.name}</p>
                     <div className='remove-product-image-button' >
             <CancelIcon style={{color:'red',cursor:'pointer'}}  onClick={()=>handleRemoveImage(index)} />
                      </div> 
                    </div>
                   ))
                   }
                </div>
                </div>
               
                <div className='add_product_form'>
                    <form onSubmit={handleSubmit} >
                    <div className='add_product_label_input'>
                    <label htmlFor=""> Product Code  </label>
                    <TextField required fullWidth className='product_form_input' id="outlined-basic" name="product_code" value={productData?.product_code} onChange={handleChange} placeholder=" Product Code " variant="outlined" />
                    </div>

                    <div className='add_product_label_input'>
                    <label htmlFor=""> Product Name  </label>
                    <TextField required fullWidth className='product_form_input' id="outlined-basic" name="product_name" value={productData?.product_name} onChange={handleChange} placeholder=" Product Name " variant="outlined" />
                    </div>
                   
                    
                    <div className='add_product_label_input'>
                    <label htmlFor=""> Product Price  </label>
                    <TextField inputProps={{min: 0, step: .0001}} type={'number'} required fullWidth className='product_form_input' id="outlined-basic" name="product_price" value={productData?.product_price} onChange={handleChange} placeholder=" Product Price " variant="outlined" />
                    </div>

                    <div className='add_product_label_input'>
                    <label htmlFor=""> B2B User Product Price  </label>
                    <TextField inputProps={{min: 0, step: .0001}} type={'number'} required fullWidth className='product_form_input' id="outlined-basic" name="b2b_user_product_price" value={productData?.b2b_user_product_price} onChange={handleChange} placeholder=" B2B user product Price " variant="outlined" />
                    </div>


                    <div className='add_product_label_input'>
                    <label htmlFor=""> B2C User Product Price  </label>
                    <TextField inputProps={{min: 0, step: .0001}} type={'number'} required fullWidth className='product_form_input' id="outlined-basic" name="b2c_user_product_price" value={productData?.b2c_user_product_price} onChange={handleChange} placeholder=" B2C user product Price " variant="outlined" />
                    </div>

                    <div className='add_product_label_input'>
                    <label htmlFor=""> Product Rewards Points  </label>
                    <TextField inputProps={{min: 0, step: 1}} fullWidth className='product_form_input' type='number' id="outlined-basic" name="product_reward_points" value={productData?.product_reward_points} onChange={handleChange} placeholder=" Product Reward Points " variant="outlined" />
                    </div>

                    <div className='add_product_label_input'>
                    <label htmlFor=""> Product Collected Points </label>
                    <TextField inputProps={{min: 0, step: 1}} fullWidth className='product_form_input' type='number' id="outlined-basic" name="product_collected_points" value={productData?.product_collected_points} onChange={handleChange} placeholder=" Product Collected Points " variant="outlined" />
                    </div>

                 

                    <div className='add_product_label_input'>
                    <label htmlFor=""> Select Brand  </label>
                    <TextField  labelId="demo-select-small" id="demo-select-small"
                     className='select_field' name="product_main_category" style={{textTransform:'capitalize'}} value={productData?.product_main_category} onChange={handleChange} 
                       select 
                       SelectProps={{
                        isNative:true,
                        MenuProps:{PaperProps: {
                          style: {
                            maxHeight: 250,
                            width: 250,
                          },
                        },}
                      }
                      }
                        >
                    <MenuItem value='choose_brand'>Choose Brand</MenuItem>
                    {mainCategory?.map((value,index)=>(
                        <MenuItem key={value._id} style={{textTransform:'capitalize'}} value={value?._id}>{value?._id}</MenuItem>

                    ))}
                    </TextField>
                    </div>
                    <div className='add_product_label_input'>
                    <label htmlFor=""> Select Category  </label>
                    <TextField style={{textTransform:'capitalize'}} labelId="demo-select-small" id="demo-select-small" className='select_field'
                     name='product_category' value={productData?.product_category} onChange={handleChange} 
                       select
                       SelectProps={{
                        isNative:true,
                        MenuProps:{PaperProps: {
                          style: {
                            maxHeight: 250,
                            width: 250,
                          },
                        },}
                      }
                      }
                       >
                    <MenuItem value='choose_category'>Choose Category</MenuItem>
                    {category?.map((value,index)=>(
                      <MenuItem key={value?._id} style={{textTransform:'capitalize'}} value={value?.category_name}>{value?.category_name}</MenuItem>

                    ))}
                    </TextField>
                    </div>

                    

                    <div className='add_product_label_input'>
                    <label htmlFor=""> Select Sub-Category  </label>
                    <TextField style={{textTransform:'capitalize'}} labelId="demo-select-small" id="demo-select-small" className='select_field'
                     name='product_subcategory' value={productData?.product_subcategory} onChange={handleChange}  
                      select
                      SelectProps={{
                        isNative:true,
                        MenuProps:{PaperProps: {
                          style: {
                            maxHeight: 250,
                            width: 250,
                          },
                        },}
                      }
                      }
                      >
                    <MenuItem value='choose_sub_category'>Choose Sub-Category </MenuItem>
                    {subCategory?.map((value,index)=>(
                      <MenuItem key={value?._id} style={{textTransform:'capitalize'}} value={value?.name}>{value?.name}</MenuItem>

                    ))}
                    </TextField>
                    </div>

                    <div className='flex' style={{width:'100%',gap:'10px'}} >
                  <div className='add_product_label_input' style={{width:'100%'}} >
                    <label htmlFor=""> Color  </label>
                    <TextField  fullWidth className='product_form_input' id="outlined-basic" name="color" value={productData?.color} onChange={handleChange} placeholder=" Color " variant="outlined" />
                    </div>
                    <div className='add_product_label_input' style={{width:'100%'}} >
                    <label htmlFor=""> Size  </label>
                    <TextField  fullWidth className='product_form_input' id="outlined-basic" name="size" value={productData?.size} onChange={handleChange} placeholder=" Size " variant="outlined" />
                    </div>
                    <div className='add_product_label_input' style={{width:'100%'}} >
                    <label htmlFor=""> Product Tag  </label>
                    <TextField  fullWidth className='product_form_input' id="outlined-basic" name="product_tag" value={productData?.product_tag} onChange={handleChange} placeholder="Product Tag " variant="outlined" />
                    </div>
                   
                  </div>
                  <div className='flex' style={{width:'100%',gap:'10px'}} >
                  <div className='add_product_label_input' style={{width:'100%'}} >
                    <label htmlFor=""> Variant  </label>
                    <TextField  fullWidth className='product_form_input' id="outlined-basic" name="product_variant" value={productData?.product_variant} onChange={handleChange} placeholder=" Variant " variant="outlined" />
                    </div>
                  <div className='add_product_label_input' style={{width:'100%'}} >
                    <label htmlFor=""> Quantity  </label>
                    <TextField type='number'  fullWidth className='product_form_input' id="outlined-basic" name='product_quantity' value={productData?.product_quantity} onChange={handleChange} placeholder=" Quantity " variant="outlined" />
                    </div>

                    <div className='add_product_label_input' style={{width:'100%'}} >
                    <label htmlFor="">Total Products In One Cartoon </label>
                    <TextField type='number'  fullWidth className='product_form_input' id="outlined-basic" name='cartoon_total_products' value={productData?.cartoon_total_products} onChange={handleChange} placeholder=" Total Products In One Cartoon " variant="outlined" />
                    </div>
                    </div>

                    <div className='add_product_label_input'>
                    <label htmlFor=""> Description  </label>
                    <TextField multiline rows={5}  fullWidth className='product_form_input' name='product_description' value={productData?.product_description} onChange={handleChange} id="outlined-basic" placeholder=" Add Description " variant="outlined" />
                    </div>

                  <div style={{paddingTop:20}} >

                    <Button  variant='outlined' style={{marginRight:"10px"}} onClick={handleClose}  startIcon={<Iconify icon="akar-icons:arrow-back" />} > GO BACK  </Button>
                
                     <Button   variant='contained' type='submit' style={{padding:"6px 30px"}} startIcon={<Iconify icon="ant-design:plus-outlined" />} > SAVE </Button>

                    </div>
                    </form>
                    
                </div>
            </div>
        </div>
        </div>
    </>
  )
}

export default AddProducts
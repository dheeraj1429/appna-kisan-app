import React, { useState, useEffect } from "react";
import axios from "axios";
import FileUploadDesign from "../../../components/common/FileUploadDesign";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { MenuItem } from "@mui/material";
import { Button } from "@mui/material";
import Iconify from "../../../components/Iconify";
import palette from "../../../theme/palette";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  deleteImageFromFirebase,
  splitString,
  uploadFileToFirebase,
} from "src/global/globalFunctions";
import CircularProgress from "@mui/material/CircularProgress";
import CustomizedSnackbars from "../../../global/Snackbar/CustomSnackbar";
import ConfimModal from "../../../global/Modals/ConfimModal";
import CloseIcon from "@mui/icons-material/Close";
import Backdrop from "@mui/material/Backdrop";
import CancelIcon from "@mui/icons-material/Cancel";

function EditProduct({ productId, handleClose }) {
  const [productData, setProductData] = useState({
    product_main_category: "choose_brand",
    product_category: "choose_category",
    product_subcategory: "choose_sub_category",
  });
  const [mainCategory, setMainCategory] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [message, setMessage] = useState({ type: "", message: "" });
  const [openRemoveImageModal, setOpenRemoveImageModal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileUpload, setFileUpload] = useState();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [render, setRender] = useState(false);
  console.log("PRODUCT DATA", productData);
  console.log("PRODUCT ID=>", productId);

  //================= GET PRODUCT  =================
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/get/single/product/${productId}`,
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        setProductData(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [render]);
  //================= GET PRODUCT =================

  //================= GET ALL MAIN CATEGORY =================
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/get/addproduct/maincategory`,
        { withCredentials: true }
      )
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
  useEffect(() => {
    if (productData?.product_main_category === "choose_brand") return;
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/get/category/for/addproduct?main_category=${productData?.product_main_category}`
      )
      .then((res) => {
        console.log(res);
        setCategory(res?.data);
      });
  }, [productData?.product_main_category]);
  // GET CATEGORY BY BRAND

  // GET SUB CATEGORY BY BRAND
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/get/category/for/addproduct?category=${productData?.product_category}`
      )
      .then((res) => {
        console.log(res);
        setSubCategory(res?.data[0]?.subcategory);
      });
  }, [productData?.product_category]);
  // GET SUB CATEGORY BY BRAND

  const handleChange = (e) => {
    setProductData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // File upload function
  const handleFileUpload = (e) => {
    if (e.target.files?.length > 4)
      return alert("You can only select 4 images");
    if (productData?.product_images?.length > 4)
      return alert("4 Product images already exists !! ");
    if (
      productData?.product_images?.length === 1 &&
      e.target.files?.length >= 4
    )
      return alert("Product image range is 1 - 4");
    if (
      productData?.product_images?.length === 2 &&
      e.target.files?.length >= 3
    )
      return alert("Product image range is 1 - 4");
    if (
      productData?.product_images?.length === 3 &&
      e.target.files?.length >= 2
    )
      return alert("Product image range is 1 - 4");
    if (
      productData?.product_images?.length === 4 &&
      e.target.files?.length >= 1
    )
      return alert("Product image range is 1 - 4");
    console.log(e.target.files);
    let allImages = [...e.target.files];
    setFileUpload(allImages);
  };
  console.log(fileUpload);

  // remove image after select
  const handleRemoveImage = (removeByIndex) => {
    console.log(removeByIndex);
    const afterRemove = fileUpload?.filter((value, index) => {
      return index != removeByIndex;
    });
    console.log("AFTER REMOVE IMAGE=>", afterRemove);
    setFileUpload(afterRemove);
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    if (!fileUpload && productData?.product_images < 1) {
      alert("Add Atleast 1 Product Image !!");
      setLoading(false);
      return;
    }

    let productsImageToFirebase = [];
    console.log("productsImageToFirebase before=>", productsImageToFirebase);
    if (fileUpload?.length > 0) {
      for (let i = 0; i < fileUpload?.length; i++) {
        productsImageToFirebase[i] = await uploadFileToFirebase(
          `/ssastore/products/${productData?.product_code}/`,
          fileUpload[i]
        );
      }
    }
    console.log("productsImageToFirebase after=>", productsImageToFirebase);

    let data = {
      product_code: productData?.product_code,
      product_name: productData?.product_name,
      product_price: productData?.product_price,
      b2b_user_product_price: productData?.b2b_user_product_price,
      b2c_user_product_price: productData?.b2c_user_product_price,
      product_slug: splitString(productData?.product_name?.toLowerCase()),
      product_reward_points: productData?.product_reward_points,
      product_collected_points: productData?.product_collected_points,
      product_variant: productData?.product_variant,
      quantity: productData?.quantity,
      original_quantity: productData?.quantity,
      color: productData?.color,
      // weight:productData?.weight,
      product_tag: productData?.product_tag?.trim(),
      size: productData?.size,
      product_main_category: productData?.product_main_category,
      product_main_category_slug: splitString(
        productData?.product_main_category?.toLowerCase()
      ),
      product_category: productData?.product_category,
      product_category_slug: splitString(
        productData?.product_category?.toLowerCase()
      ),
      product_subcategory: productData?.product_subcategory,
      product_subcategory_slug: splitString(
        productData?.product_subcategory?.toLowerCase()
      ),
      product_description: productData?.product_description,
      cartoon_total_products: productData?.cartoon_total_products,
      product_images: [
        ...productData?.product_images,
        ...productsImageToFirebase,
      ],
    };
    await axios
      .patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/edit/product/${productId}`,
        { ...data },
        { withCredential: true }
      )
      .then((res) => {
        console.log(res);
        setLoading(false);
        setMessage((prev) => ({
          ...prev,
          type: "success",
          message: "Product Updated Successfully !!",
        }));
        setSnackbarOpen(true);
        setRender((prev) => !prev);
        setFileUpload("");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    setLoading(false);
  };

  // ##################### SNACK BAR FUNCTIONs ##################
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };
  // ##################### SNACK BAR FUNCTIONs ##################
  console.log("openRemoveImageModal", openRemoveImageModal);

  // ##################### REMOVE IMAGE FUCNTION ###################
  // REMOVE PRODUCT IMAGE
  const handleRemoveProductImage = async (i, image_name, image_path) => {
    console.log("SUB CATEGORY DELETE IMAGE ==", i, image_name, image_path);
    let closeModalState = [...openRemoveImageModal];
    closeModalState[i] = false;
    setOpenRemoveImageModal(closeModalState);
    deleteImageFromFirebase(image_path, image_name);
    await axios
      .patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/remove/product/image/${productId}/${image_name}`,
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        if (res?.data?.status === true) {
          setMessage((prev) => ({
            ...prev,
            type: "success",
            message: "Image Deleted Successfully !",
          }));
          setSnackbarOpen(true);
          setRender((prev) => !prev);
        } else {
          setMessage((prev) => ({
            ...prev,
            type: "error",
            message: "Image Deleted Failed !",
          }));
          setSnackbarOpen(true);
          setRender((prev) => !prev);
        }
      })
      .catch((err) => {
        setMessage((prev) => ({
          ...prev,
          type: "error",
          message: "Image Deleted Failed !",
        }));
        console.log(err);
      });
  };

  // ##################### REMOVE PRODUCT IMAGE ###################

  // remove image after select
  const handleRemoveUploadedImage = (removeByIndex) => {
    console.log(removeByIndex);
    const afterRemove = fileUpload?.filter((value, index) => {
      return index != removeByIndex;
    });
    console.log("AFTER REMOVE IMAGE=>", afterRemove);
    setFileUpload(afterRemove);
    setOpenRemoveImageModal(false);
  };

  // ############## CONFIRM MODAL ###########
  // sub category modal functions
  const handleOpenRemoveImageModal = (i, value) => {
    console.log("openModal ==", i, "-==", value);
    let newModalState = [...openRemoveImageModal];
    newModalState[i] = value;
    setOpenRemoveImageModal(newModalState);
  };

  const handleCloseSubCateConfirmModal = (i) => {
    console.log("CLOSE MODAL", i);
    let closeModalState = [...openRemoveImageModal];
    closeModalState[i] = false;
    setOpenRemoveImageModal(closeModalState);
  };
  // ############## CONFIRM MODAL ###########
  return (
    <>
      {/* #################### LOADING SPINNER ######################## */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* #################### LOADING SPINNER ######################## */}

      {/* #################### SANCKBAR MESSAGE ######################## */}
      <CustomizedSnackbars
        onOpen={snackbarOpen}
        type={message?.type}
        handleClose={handleCloseSnackbar}
        message={message?.message}
      />
      {/* #################### SANCKBAR MESSAGE ######################## */}

      <div className="product-conatiner">
        <div className="addproducts_slider">
          <div className="slider_heading">
            <h4>Edit Products</h4>
            <p>Edit your product and Change necessary information from here</p>
          </div>
          <div className="close_edit_Category ">
            <HighlightOffIcon
              style={{ color: "red" }}
              onKeyDown={handleClose}
              onClick={handleClose}
              fontSize="large"
            />
            {/* <HighlightOffIcon style={{color:palette.primary.main}}  fontSize='large' /> */}
          </div>
          <div className="addproduct_img_and_details flex">
            <div className="file_upload_col">
              <FileUploadDesign
                fileUpload={fileUpload}
                handleFileUpload={handleFileUpload}
              />
              <div className="" style={{ paddingTop: 20 }}>
                {productData?.product_images?.length > 0 &&
                  productData?.product_images?.map((value, index) => (
                    <div key={index} className="uploaded-images-preview">
                      <a target="_blank" href={value.image_url}>
                        <img
                          className="category-table-image"
                          alt="product"
                          src={`${value.image_url}`}
                        />
                      </a>
                      <p>{value.image_name?.split("--")[1]}</p>
                      <div className="remove-product-image-button">
                        <CancelIcon
                          style={{ color: "red", cursor: "pointer" }}
                          onClick={() =>
                            handleOpenRemoveImageModal(index, true)
                          }
                        />
                        {/* CONFIRM MODAL */}
                        <ConfimModal
                          open={openRemoveImageModal[index]}
                          title="Delete"
                          onYes={() =>
                            handleRemoveProductImage(
                              index,
                              value?.image_name,
                              value?.path
                            )
                          }
                          message="Do you want to delete?"
                          handleClose={() =>
                            handleCloseSubCateConfirmModal(index)
                          }
                        />
                        {/* CONFIRM MODAL */}
                      </div>
                    </div>
                  ))}
                {/* when file upload */}
                {fileUpload?.length > 0 &&
                  fileUpload?.map((value, index) => (
                    <div key={index} className="uploaded-images-preview">
                      <a target="_blank" href={URL.createObjectURL(value)}>
                        <img
                          className="category-table-image"
                          alt="product"
                          src={URL.createObjectURL(value)}
                        />
                      </a>
                      <p>{value.name}</p>
                      <div className="remove-product-image-button">
                        <CancelIcon
                          style={{ color: "red", cursor: "pointer" }}
                          onClick={() =>
                            handleOpenRemoveImageModal(index, true)
                          }
                        />
                        {/* CONFIRM MODAL */}
                        <ConfimModal
                          open={openRemoveImageModal[index]}
                          title="Delete"
                          onYes={() => handleRemoveUploadedImage(index)}
                          message="Do you want to delete?"
                          handleClose={() =>
                            handleCloseSubCateConfirmModal(index)
                          }
                        />
                        {/* CONFIRM MODAL */}
                      </div>
                    </div>
                  ))}
                {/* when file upload */}
              </div>
            </div>

            <div className="add_product_form">
              <form onSubmit={handleSubmit}>
                <div className="add_product_label_input">
                  <label htmlFor=""> Product Code </label>
                  <TextField
                    required
                    fullWidth
                    className="product_form_input"
                    id="outlined-basic"
                    name="product_code"
                    value={productData?.product_code}
                    onChange={handleChange}
                    placeholder=" Product Code "
                    variant="outlined"
                  />
                </div>

                <div className="add_product_label_input">
                  <label htmlFor=""> Product Price </label>
                  <TextField
                    inputProps={{ min: 0, step: 0.0001 }}
                    type={"number"}
                    required
                    fullWidth
                    className="product_form_input"
                    id="outlined-basic"
                    name="product_price"
                    value={productData?.product_price}
                    onChange={handleChange}
                    placeholder=" Product Price "
                    variant="outlined"
                  />
                </div>

                <div className="add_product_label_input">
                  <label htmlFor=""> B2B User Product Price </label>
                  <TextField
                    inputProps={{ min: 0, step: 0.0001 }}
                    type={"number"}
                    required
                    fullWidth
                    className="product_form_input"
                    id="outlined-basic"
                    name="b2b_user_product_price"
                    value={productData?.b2b_user_product_price}
                    onChange={handleChange}
                    placeholder=" B2B user product Price "
                    variant="outlined"
                  />
                </div>

                <div className="add_product_label_input">
                  <label htmlFor=""> B2C User Product Price </label>
                  <TextField
                    inputProps={{ min: 0, step: 0.0001 }}
                    type={"number"}
                    required
                    fullWidth
                    className="product_form_input"
                    id="outlined-basic"
                    name="b2c_user_product_price"
                    value={productData?.b2c_user_product_price}
                    onChange={handleChange}
                    placeholder=" B2C user product Price "
                    variant="outlined"
                  />
                </div>

                <div className="add_product_label_input">
                  <label htmlFor=""> Product Name </label>
                  <TextField
                    required
                    fullWidth
                    className="product_form_input"
                    id="outlined-basic"
                    name="product_name"
                    value={productData?.product_name}
                    onChange={handleChange}
                    placeholder=" Product Name "
                    variant="outlined"
                  />
                </div>

                <div className="add_product_label_input">
                  <label htmlFor=""> Product Rewards Points </label>
                  <TextField
                    inputProps={{ min: 0, step: 1 }}
                    fullWidth
                    className="product_form_input"
                    type="number"
                    id="outlined-basic"
                    name="product_reward_points"
                    value={productData?.product_reward_points}
                    onChange={handleChange}
                    placeholder=" Product Reward Points "
                    variant="outlined"
                  />
                </div>

                <div className="add_product_label_input">
                  <label htmlFor=""> Product Collected Points </label>
                  <TextField
                    inputProps={{ min: 0, step: 1 }}
                    fullWidth
                    className="product_form_input"
                    type="number"
                    id="outlined-basic"
                    name="product_collected_points"
                    value={productData?.product_collected_points}
                    onChange={handleChange}
                    placeholder=" Product Collected Points "
                    variant="outlined"
                  />
                </div>

                {/* <div className='add_product_label_input'>
                    <label htmlFor=""> Variant  </label>
                    <TextField required fullWidth className='product_form_input' id="outlined-basic" name="product_variant" value={productData?.product_variant} onChange={handleChange} placeholder=" Variant " variant="outlined" />
                    </div>

                    <div className='add_product_label_input'>
                    <label htmlFor=""> Quantity  </label>
                    <TextField type='number' required fullWidth className='product_form_input' id="outlined-basic" name='quantity' value={parseInt(productData?.quantity)} onChange={handleChange} placeholder=" Quantity " variant="outlined" />
                    </div> */}

                <div className="add_product_label_input">
                  <label htmlFor=""> Select Brand </label>
                  <TextField
                    labelId="demo-select-small"
                    id="demo-select-small"
                    className="select_field"
                    name="product_main_category"
                    style={{ textTransform: "capitalize" }}
                    value={productData?.product_main_category}
                    onChange={handleChange}
                    select
                    SelectProps={{
                      isNative: true,
                      MenuProps: {
                        PaperProps: {
                          style: {
                            maxHeight: 250,
                            width: 250,
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="choose_brand">Choose Brand</MenuItem>
                    {mainCategory?.map((value, index) => (
                      <MenuItem
                        key={value._id}
                        style={{ textTransform: "capitalize" }}
                        value={value?._id}
                      >
                        {value?._id}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className="add_product_label_input">
                  <label htmlFor=""> Select Category </label>
                  <TextField
                    style={{ textTransform: "capitalize" }}
                    labelId="demo-select-small"
                    id="demo-select-small"
                    className="select_field"
                    name="product_category"
                    value={productData?.product_category}
                    onChange={handleChange}
                    select
                    SelectProps={{
                      isNative: true,
                      MenuProps: {
                        PaperProps: {
                          style: {
                            maxHeight: 250,
                            width: 250,
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="choose_category">Choose Category</MenuItem>
                    {category?.map((value, index) => (
                      <MenuItem
                        key={value._id}
                        style={{ textTransform: "capitalize" }}
                        value={value?.category_name}
                      >
                        {value?.category_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>

                <div className="add_product_label_input">
                  <label htmlFor=""> Select Sub-Category </label>
                  <TextField
                    style={{ textTransform: "capitalize" }}
                    labelId="demo-select-small"
                    id="demo-select-small"
                    className="select_field"
                    name="product_subcategory"
                    value={productData?.product_subcategory}
                    onChange={handleChange}
                    select
                    SelectProps={{
                      isNative: true,
                      MenuProps: {
                        PaperProps: {
                          style: {
                            maxHeight: 250,
                            width: 250,
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="choose_sub_category">
                      Choose Sub-Category{" "}
                    </MenuItem>
                    {subCategory?.map((value, index) => (
                      <MenuItem
                        key={value?._id}
                        style={{ textTransform: "capitalize" }}
                        value={value?.name}
                      >
                        {value?.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>

                <div className="flex" style={{ width: "100%", gap: "10px" }}>
                  <div
                    className="add_product_label_input"
                    style={{ width: "100%" }}
                  >
                    <label htmlFor=""> Color </label>
                    <TextField
                      fullWidth
                      className="product_form_input"
                      id="outlined-basic"
                      name="color"
                      value={productData?.color}
                      onChange={handleChange}
                      placeholder=" Color "
                      variant="outlined"
                    />
                  </div>
                  <div
                    className="add_product_label_input"
                    style={{ width: "100%" }}
                  >
                    <label htmlFor=""> Size </label>
                    <TextField
                      fullWidth
                      className="product_form_input"
                      id="outlined-basic"
                      name="size"
                      value={productData?.size}
                      onChange={handleChange}
                      placeholder=" Size "
                      variant="outlined"
                    />
                  </div>
                  <div
                    className="add_product_label_input"
                    style={{ width: "100%" }}
                  >
                    <label htmlFor=""> Product Tag </label>
                    <TextField
                      fullWidth
                      className="product_form_input"
                      id="outlined-basic"
                      name="product_tag"
                      value={productData?.product_tag}
                      onChange={handleChange}
                      placeholder="Product Tag "
                      variant="outlined"
                    />
                  </div>
                </div>
                <div className="flex" style={{ width: "100%", gap: "10px" }}>
                  <div
                    className="add_product_label_input"
                    style={{ width: "100%" }}
                  >
                    <label htmlFor=""> Variant </label>
                    <TextField
                      fullWidth
                      className="product_form_input"
                      id="outlined-basic"
                      name="product_variant"
                      value={productData?.product_variant}
                      onChange={handleChange}
                      placeholder=" Variant "
                      variant="outlined"
                    />
                  </div>
                  <div
                    className="add_product_label_input"
                    style={{ width: "100%" }}
                  >
                    <label htmlFor=""> Quantity </label>
                    <TextField
                      type="number"
                      fullWidth
                      className="product_form_input"
                      id="outlined-basic"
                      name="quantity"
                      value={productData?.quantity}
                      onChange={handleChange}
                      placeholder=" Quantity "
                      variant="outlined"
                    />
                  </div>
                  <div
                    className="add_product_label_input"
                    style={{ width: "100%" }}
                  >
                    <label htmlFor="">Total Products In One Cartoon </label>
                    <TextField
                      type="number"
                      fullWidth
                      className="product_form_input"
                      id="outlined-basic"
                      name="cartoon_total_products"
                      value={productData?.cartoon_total_products}
                      onChange={handleChange}
                      placeholder=" Total Products In One Cartoon "
                      variant="outlined"
                    />
                  </div>
                </div>

                <div className="add_product_label_input">
                  <label htmlFor=""> Description </label>
                  <TextField
                    multiline
                    rows={5}
                    fullWidth
                    className="product_form_input"
                    name="product_description"
                    value={productData?.product_description}
                    onChange={handleChange}
                    id="outlined-basic"
                    placeholder=" Add Description "
                    variant="outlined"
                  />
                </div>

                <div style={{ paddingTop: 20 }}>
                  <Button
                    variant="outlined"
                    style={{ marginRight: "10px" }}
                    onClick={handleClose}
                    startIcon={<Iconify icon="akar-icons:arrow-back" />}
                  >
                    {" "}
                    GO BACK{" "}
                  </Button>

                  <Button
                    variant="contained"
                    type="submit"
                    style={{ padding: "6px 30px" }}
                    startIcon={<Iconify icon="ant-design:plus-outlined" />}
                  >
                    {" "}
                    SAVE{" "}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProduct;

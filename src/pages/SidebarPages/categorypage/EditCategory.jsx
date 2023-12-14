import CloseIcon from "@mui/icons-material/Close";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { Button } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useEffect, useState } from "react";
import noImage from "../../../assests/No_image.svg";
import Iconify from "../../../components/Iconify";
import ConfimModal from "../../../global/Modals/ConfimModal";
import CustomizedSnackbars from "../../../global/Snackbar/CustomSnackbar";
import {
  deleteImageFromFirebase,
  splitString,
  uploadFileToFirebase,
} from "../../../global/globalFunctions";
import palette from "../../../theme/palette";

function EditCategory({ handleClose, mainCategoryId }) {
  const [fileUpload, setFileUpload] = useState({
    mainCategoryImage: null,
    categoryImage: null,
  });
  const [subCategoryField, setSubCategoryField] = useState([
    { image: null, name: "", parent_category: "", parent_main_category: "" },
  ]);
  const [mainCategory, setMainCategory] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [allMainAndCategoriesImages, setMainAndCategoriesImages] = useState();
  const [data, setData] = useState([]);
  const [openConfimModal, setOpenConfimModal] = useState({
    main_category_confim: false,
    category_confim: false,
  });
  const [openSubCategoryConfimModal, setOpenSubCategoryConfimModal] = useState(
    []
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [render, setRender] = useState(false);

  console.log("ID______________", mainCategoryId);
  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/get/category/${mainCategoryId}`,
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        setData(res?.data);
        setMainCategory(res?.data?.main_category_name);
        setCategory(res?.data?.category_name);
        setMainAndCategoriesImages({
          category_image: res?.data?.category_image?.image_url,
          main_category_image: res?.data?.main_category_image?.image_url,
        });
        // res?.data.subCategory &&  setSubCategoryField(res?.data?.subcategory)
        setSubCategoryField(res?.data?.subcategory);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [render]);

  console.log(fileUpload);
  // console.log("mainCategory",mainCategory)
  // console.log("category",category)
  console.log("subCategoryField 59", subCategoryField);

  // ################### MAIN CATEGORY IMAGE UPLOAD TO FIRE BASE ########################
  // const handleMainCategoryFileChange =async (e) => {
  //   const image = e.target.files[0]
  //   setFileUpload((prev)=>({...prev,mainCategoryImage:image}));
  //   console.log(image)
  //   console.log("######### MAIN CATEGORY IMAGE",fileUpload.mainCategoryImage)

  // };
  // ################### MAIN CATEGORY IMAGE UPLOAD TO FIRE BASE ########################

  // ###################  CATEGORY IMAGE UPLOAD TO FIRE BASE ########################
  const handleCategoryFileChange = async (e) => {
    const image = e.target.files[0];
    setFileUpload((prev) => ({ ...prev, categoryImage: image }));
    console.log("######### CATEGORY IMAGE", fileUpload.categoryImage);
  };
  // ###################  CATEGORY IMAGE UPLOAD TO FIRE BASE ########################

  // ################### SUB CATEGORY IMAGE UPLOAD TO FIRE BASE ########################
  const handleSubCategoryFileChange = async (i, e) => {
    console.log("UploadImage index", i);
    const image = e.target.files[0];
    let addFileToSubCategory = [...subCategoryField];
    addFileToSubCategory[i][e.target.name] = image;
    setSubCategoryField(addFileToSubCategory);
  };
  // ################### SUB CATEGORY IMAGE UPLOAD TO FIRE BASE ########################

  // ##################### REMOVE IMAGE FUCNTION ###################
  // REMOVE MAIN CATEGORY IMAGE
  // const handleRemoveMainCategoryImage = (main_category_name,image)=>{
  //   console.log("asdasdasdasdasdasdasd",main_category_name,image.image_name)
  //     setOpenConfimModal((prev)=>({...prev,main_category_confim:false}))
  //     deleteImageFromFirebase(`/ssastore/allcategories/maincategories/${main_category_name}/`,image?.image_name)
  //     setFileUpload((prev)=>({...prev,mainCategoryImage:null}));
  //     setMainAndCategoriesImages((prev)=>({...prev,main_category_image:""}))

  // }
  // REMOVE CATEGORY IMAGE
  const handleRemoveCategoryImage = async (category_name, image) => {
    setOpenConfimModal((prev) => ({ ...prev, category_confim: false }));
    console.log("asdasdasdasdasdasdasd", category_name, image?.image_name);
    setFileUpload((prev) => ({ ...prev, categoryImage: null }));
    deleteImageFromFirebase(image?.path, image?.image_name);
    await axios
      .patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/delete/main/category/image/?old_category_name=${category_name}`,
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
          setOpenConfimModal((prev) => ({ ...prev, category_confim: false }));
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
    setFileUpload((prev) => ({ ...prev, categoryImage: null }));
    setMainAndCategoriesImages((prev) => ({ ...prev, category_image: "" }));
  };
  // REMOVE SUB CATEGORY IMAGE
  const handleRemoveSubCategoryImage = async (i, subcategory_name, image) => {
    console.log("SUB CATEGORY DELETE IMAGE ==", i, subcategory_name, image);
    let closeModalState = [...openSubCategoryConfimModal];
    closeModalState[i] = false;
    setOpenSubCategoryConfimModal(closeModalState);
    deleteImageFromFirebase(image?.path, image?.image_name);
    await axios
      .patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/delete/main/category/image/?sub_category_id=${mainCategoryId}&old_sub_category_name=${subcategory_name}`,
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

    let addFileToSubCategory = [...subCategoryField];
    addFileToSubCategory[i]["subCategoryImage"] = null;
    setSubCategoryField(addFileToSubCategory);
    let removeImage = [...subCategoryField];
    removeImage[i]["image"] = "";
    setSubCategoryField(removeImage);
  };

  // ##################### REMOVE IMAGE FUCNTION ###################

  // ##################### HANDLE SUBMIT AND POST DATA #####################
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let mainCategoryImageToFirebase;
    let categoryImageToFirebase;
    // if(fileUpload.mainCategoryImage ){
    //    mainCategoryImageToFirebase=await uploadFileToFirebase(`/ssastore/allcategories/maincategories/${mainCategory}/`,fileUpload.mainCategoryImage)

    // }
    if (fileUpload.categoryImage) {
      categoryImageToFirebase = await uploadFileToFirebase(
        `/ssastore/allcategories/categories/${category}/`,
        fileUpload.categoryImage
      );
    }
    let subCategoryImageToFirebase = [];
    for (let i = 0; i < subCategoryField.length; i++) {
      if (subCategoryField[i].subCategoryImage) {
        console.log(" IMAGE UPLOADED TO SUB CATEGORY");
        const getImageData = await uploadFileToFirebase(
          `/ssastore/allcategories/subcategories/${subCategoryField[i].name}/`,
          subCategoryField[i].subCategoryImage
        );
        // console.log("getImageData",getImageData)
        subCategoryImageToFirebase[i] = getImageData;
      }
    }

    // console.log("FORM DATA CATEGORY==",categoryImageToFirebase)
    // console.log("FORM DATA MAIN CATEGORY==",mainCategoryImageToFirebase)
    // console.log("FORM DATA SUB CATEGORY==",subCategoryImageToFirebase)

    console.log("subCategoryField", subCategoryField);

    let subCategoryData = [];
    if (subCategoryImageToFirebase.length > 0) {
      for (let i = 0; i < subCategoryField.length; i++) {
        const createSubCategoryData = {
          name: subCategoryField[i].name?.toLowerCase(),
          // image:{image_name:subCategoryImageToFirebase[i].image_name,image_url:subCategoryImageToFirebase[i].image_url,},
          image: subCategoryImageToFirebase[i] || subCategoryField[i]?.image,
          slug: splitString(subCategoryField[i].name?.toLowerCase()),
          parent_main_category: mainCategory?.toLowerCase(),
          parent_category: category?.toLowerCase(),
        };
        subCategoryData[i] = createSubCategoryData;
      }
      console.log("checkimage data IF ", subCategoryData);
    } else {
      for (let i = 0; i < subCategoryField.length; i++) {
        const createSubCategoryDataWithoutImage = {
          name: subCategoryField[i].name?.toLowerCase(),
          image: subCategoryField[i].image || subCategoryImageToFirebase[i],
          slug: splitString(subCategoryField[i].name?.toLowerCase()),
          parent_main_category: mainCategory?.toLowerCase(),
          parent_category: category?.toLowerCase(),
          rewardPercentage: +subCategoryField?.[i]?.rewardPercentage,
        };
        subCategoryData[i] = createSubCategoryDataWithoutImage;
      }
      console.log("checkimage data  ELSE", subCategoryData);
    }

    console.log("subCategoryData----------->>>>>>>>>>", subCategoryData);

    let data = {
      // main_category_name:mainCategory,
      // main_category_slug:splitString(mainCategory?.toLowerCase()),
      category_name: category?.toLowerCase(),
      category_slug: splitString(category?.toLowerCase()),
      main_category_image: mainCategoryImageToFirebase,
      category_image: categoryImageToFirebase,
      subcategory: [...subCategoryData],
    };

    console.log("DATA ", data);

    await axios
      .patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/edit/category/${mainCategoryId}`,
        data,
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response);

        // alert("Updated Success")
        setSnackbarOpen(true);
        setMessage((prev) => ({
          ...prev,
          type: "success",
          message: "Category Updated Successfully !",
        }));
      })
      .catch((err) => {
        console.log(err);
      });

    console.log("FORM SUBMITTED");
    setLoading(false);
  };
  // ##################### HANDLE SUBMIT AND POST DATA #####################

  let handleChange = (i, e) => {
    let newFormValues = [...subCategoryField];
    newFormValues[i][e.target.name] = e.target.value;
    setSubCategoryField(newFormValues);
  };

  let addFormFields = () => {
    setSubCategoryField([...subCategoryField, { name: "" }]);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...subCategoryField];
    newFormValues.splice(i, 1);
    setSubCategoryField(newFormValues);
  };

  // ############## CONFIRM  CATEGORY MODAL ###########
  const handleCloseCategoryConfirmModal = () => {
    setOpenConfimModal((prev) => ({ ...prev, category_confim: false }));
  };
  // ############## CONFIRM  CATEGORY MODAL ###########

  // ############## CONFIRM MAIN CATEGORY MODAL ###########
  const handleCloseMainCategoryConfirmModal = () => {
    setOpenConfimModal((prev) => ({ ...prev, main_category_confim: false }));
  };
  // ############## CONFIRM MAIN CATEGORY MODAL ###########

  // sub category modal functions
  const handleOpenSubCategoryConfimModal = (i, value) => {
    console.log("openModal ==", i, "-==", value);
    let newModalState = [...openSubCategoryConfimModal];
    newModalState[i] = value;
    setOpenSubCategoryConfimModal(newModalState);
  };

  const handleCloseSubCateConfirmModal = (i) => {
    console.log("CLOSE MODAL", i);
    let closeModalState = [...openSubCategoryConfimModal];
    closeModalState[i] = false;
    setOpenSubCategoryConfimModal(closeModalState);
  };
  // ############## CONFIRM MODAL ###########

  // ##################### SNACK BAR FUNCTIONs ##################
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };
  // ##################### SNACK BAR FUNCTIONs ##################

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

      <div className="close_edit_Category ">
        <HighlightOffIcon
          style={{ color: palette.primary.main }}
          onKeyDown={handleClose}
          onClick={handleClose}
          fontSize="large"
        />
        {/* <HighlightOffIcon style={{color:palette.primary.main}}  fontSize='large' /> */}
      </div>

      <Container maxWidth="md">
        <div className="add-category-pad-top-bot">
          <h2>View Category</h2>
          <p>Edit your Product category and necessary information from here</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p
            style={{ color: palette.primary.main, textTransform: "capitalize" }}
          >
            {error}
          </p>
        </div>
        {/* CONFIRM MODAL */}
        {/* <ConfimModal open={openConfimModal?.main_category_confim} title="Delete" onYes={()=>handleRemoveMainCategoryImage(data.main_category_name,data.main_category_image)} message="Do you want to delete?" handleClose={handleCloseMainCategoryConfirmModal}  /> */}
        {/* CONFIRM MODAL */}
        <form onSubmit={handleSubmit}>
          <div className="flex-justify-center">
            <div className="add-category-form-box">
              <div className="add-category-innerbox">
                {/* <div className='add-category-field' >
            <label htmlFor="">Main Category  </label>
            <div className='flex' >
            <TextField required fullWidth id="outlined-basic" value={mainCategory} onChange={(e)=>{setMainCategory(e.target.value)}} placeholder="Main Category " variant="outlined" />
            <IconButton color="primary" aria-label="upload picture" component="label">
        <input hidden  accept="image/*" name="mainCategoryImage"  onChange={handleMainCategoryFileChange } type="file" />
        <PhotoCamera />
      </IconButton>
      <div className='uploaded-images' >
        <div className='close-image-icon' >
        <CloseIcon style={{color:palette.primary.main}} onClick={()=>setOpenConfimModal((prev)=>({...prev,main_category_confim:true}))} />
      
        </div>
        <Avatar
        alt="Remy Sharp"
        src={fileUpload?.mainCategoryImage? URL?.createObjectURL(fileUpload?.mainCategoryImage) :`${allMainAndCategoriesImages?.main_category_image}`}
        sx={{ width: 56, height: 56 }}
      />
    
     </div>
            </div>
            </div> */}
                <div className="add-category-field">
                  <label style={{ paddingTop: 16 }} htmlFor="">
                    {" "}
                    Category{" "}
                  </label>
                  <div className="flex">
                    <TextField
                      required
                      fullWidth
                      id="outlined-basic"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder=" Category "
                      variant="outlined"
                    />
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="label"
                    >
                      <input
                        hidden
                        accept="image/*"
                        name="categoryImage"
                        onChange={handleCategoryFileChange}
                        type="file"
                      />
                      <PhotoCamera />
                    </IconButton>

                    <div className="uploaded-images">
                      <div className="close-image-icon">
                        <CloseIcon
                          style={{ color: palette.primary.main }}
                          onClick={() =>
                            setOpenConfimModal((prev) => ({
                              ...prev,
                              category_confim: true,
                            }))
                          }
                        />
                        {/* CONFIRM MODAL */}
                        <ConfimModal
                          open={openConfimModal?.category_confim}
                          title="Delete"
                          onYes={() =>
                            handleRemoveCategoryImage(
                              data.category_name,
                              data.category_image
                            )
                          }
                          message="Do you want to delete?"
                          handleClose={handleCloseCategoryConfirmModal}
                        />
                        {/* CONFIRM MODAL */}
                      </div>
                      {/* <Avatar
        alt="Remy Sharp"
        src={fileUpload.categoryImage ? URL?.createObjectURL(fileUpload?.categoryImage) :allMainAndCategoriesImages?.category_image}
        sx={{ width: 56, height: 56 }}
      /> */}
                      <a
                        target="_blank"
                        href={allMainAndCategoriesImages?.category_image}
                      >
                        <img
                          className="category-table-image"
                          alt="category-image"
                          src={
                            fileUpload.categoryImage
                              ? URL?.createObjectURL(fileUpload?.categoryImage)
                              : allMainAndCategoriesImages?.category_image
                              ? allMainAndCategoriesImages?.category_image
                              : noImage
                          }
                        />
                      </a>
                    </div>
                  </div>
                </div>
                {subCategoryField?.map((element, index) => (
                  <div className="add-category-field" key={index}>
                    <div className="flex">
                      <label htmlFor="">Sub Category {index + 1} </label>
                      {index || subCategoryField.length > 0 ? (
                        <Button
                          variant="text"
                          style={{ paddingRight: "46px" }}
                          onClick={() => removeFormFields(index)}
                        >
                          {" "}
                          Remove{" "}
                        </Button>
                      ) : null}
                    </div>
                    <div style={{ display: "flex", gap: 5 }}>
                      <TextField
                        required
                        fullWidth
                        id="outlined-basic"
                        name="name"
                        value={element.name || ""}
                        onChange={(e) => handleChange(index, e)}
                        placeholder="Sub Category Name"
                        variant="outlined"
                        sx={{ width: "50%" }}
                      />
                      <TextField
                        label="Reward Percentage"
                        variant="outlined"
                        sx={{ width: "40%" }}
                        type={"number"}
                        inputProps={{ min: 0, step: 0.1 }}
                        value={element.rewardPercentage || ""}
                        autoComplete="off"
                        name="rewardPercentage"
                        onChange={(e) => handleChange(index, e)}
                        required
                      />
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="label"
                      >
                        <input
                          hidden
                          accept="image/*"
                          name="subCategoryImage"
                          onChange={(e) =>
                            handleSubCategoryFileChange(index, e)
                          }
                          type="file"
                        />
                        <PhotoCamera />
                      </IconButton>
                      <div className="uploaded-images">
                        <div className="close-image-icon">
                          <CloseIcon
                            style={{ color: palette.primary.main }}
                            onClick={() =>
                              handleOpenSubCategoryConfimModal(index, true)
                            }
                          />
                          {/* CONFIRM MODAL */}
                          <ConfimModal
                            open={openSubCategoryConfimModal[index]}
                            title="Delete"
                            onYes={() =>
                              handleRemoveSubCategoryImage(
                                index,
                                data.subcategory[index].name,
                                data.subcategory[index].image
                              )
                            }
                            message="Do you want to delete?"
                            handleClose={() =>
                              handleCloseSubCateConfirmModal(index)
                            }
                          />
                          {/* CONFIRM MODAL */}
                        </div>
                        {/* <Avatar
        alt="Remy Sharp"
        src={subCategoryField[index]?.subCategoryImage ? URL?.createObjectURL(subCategoryField[index]?.subCategoryImage) :subCategoryField[index]?.image?.image_url}
        sx={{ width: 56, height: 56 }}
      /> */}
                        <a
                          target="_blank"
                          href={subCategoryField[index]?.image?.image_url}
                        >
                          <img
                            className="category-table-image"
                            alt="category-image"
                            src={
                              subCategoryField[index]?.subCategoryImage
                                ? URL?.createObjectURL(
                                    subCategoryField[index]?.subCategoryImage
                                  )
                                : subCategoryField[index]?.image?.image_url
                                ? subCategoryField[index]?.image?.image_url
                                : noImage
                            }
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="text"
                onClick={addFormFields}
                startIcon={<Iconify icon="ant-design:plus-outlined" />}
              >
                {" "}
                {subCategoryField.length > 0
                  ? "Add More"
                  : "Add Sub Category"}{" "}
              </Button>
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
            </div>
          </div>
        </form>
      </Container>
    </>
  );
}

export default EditCategory;

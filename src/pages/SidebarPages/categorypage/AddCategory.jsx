import CategoryIcon from "@mui/icons-material/Category";
import CloseIcon from "@mui/icons-material/Close";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { Button, InputAdornment, MenuItem } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useEffect, useState } from "react";
import noImage from "../../../assests/No_image.svg";
import Iconify from "../../../components/Iconify";
import CustomizedSnackbars from "../../../global/Snackbar/CustomSnackbar";
import {
  splitString,
  uploadFileToFirebase,
} from "../../../global/globalFunctions";
import palette from "../../../theme/palette";

function AddCategory({ handleClose }) {
  const [fileUpload, setFileUpload] = useState({
    mainCategoryImage: null,
    categoryImage: null,
  });
  const [subCategoryField, setSubCategoryField] = useState([
    { subcategory: "", subCategoryImage: null, rewardPercentage: 0 },
  ]);
  const [mainCategory, setMainCategory] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [filterMainCategory, setFilterMainCategory] = useState("Select Brand");
  const [selectMainCategory, setSelectMainCategory] = useState([]);

  console.log("selectMainCategory", selectMainCategory, filterMainCategory);

  //================= GET ALL MAIN CATEGORY =================
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/get/addproduct/maincategory`,
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        setSelectMainCategory(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //   console.log(fileUpload)
  console.log("mainCategory", mainCategory);
  console.log("category", category);
  console.log("subCategoryField", subCategoryField);

  // ################### MAIN CATEGORY IMAGE UPLOAD TO FIRE BASE ########################
  const handleMainCategoryFileChange = async (e) => {
    const image = e.target.files[0];
    setFileUpload((prev) => ({ ...prev, mainCategoryImage: image }));
    console.log(image);
    console.log("######### MAIN CATEGORY IMAGE", fileUpload.mainCategoryImage);
    //  const result=await uploadFileToFirebase("/ssastore/",fileUpload.mainCategoryImage)
    // console.log("RESUL AFTER UPLOADED :",result)
  };
  // ################### MAIN CATEGORY IMAGE UPLOAD TO FIRE BASE ########################

  // ###################  CATEGORY IMAGE UPLOAD TO FIRE BASE ########################
  const handleCategoryFileChange = async (e) => {
    const image = e.target.files[0];
    setFileUpload((prev) => ({ ...prev, categoryImage: image }));
    console.log("######### CATEGORY IMAGE", fileUpload.categoryImage);
    //  const result=await uploadFileToFirebase("/ssastore/",fileUpload.categoryImage)
    // console.log("RESUL AFTER UPLOADED :",result)
  };
  // ###################  CATEGORY IMAGE UPLOAD TO FIRE BASE ########################

  // ################### SUB CATEGORY IMAGE UPLOAD TO FIRE BASE ########################
  const handleSubCategoryFileChange = async (i, e) => {
    const image = e.target.files[0];
    let addFileToSubCategory = [...subCategoryField];
    addFileToSubCategory[i][e.target.name] = image;
    setSubCategoryField(addFileToSubCategory);
    //  const result=await uploadFileToFirebase("/ssastore/",fileUpload)
    // console.log("RESUL AFTER UPLOADED :",result)
  };
  // ################### SUB CATEGORY IMAGE UPLOAD TO FIRE BASE ########################

  // ##################### REMOVE IMAGE FUCNTION ###################
  const handleRemoveMainCategoryImage = () => {
    setFileUpload((prev) => ({ ...prev, mainCategoryImage: null }));
  };

  const handleRemoveCategoryImage = () => {
    setFileUpload((prev) => ({ ...prev, categoryImage: null }));
  };

  const handleRemoveSubCategoryImage = (i) => {
    let addFileToSubCategory = [...subCategoryField];
    addFileToSubCategory[i]["subCategoryImage"] = null;
    setSubCategoryField(addFileToSubCategory);
  };

  // ##################### REMOVE IMAGE FUCNTION ###################

  // ##################### HANDLE SUBMIT AND POST DATA #####################
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    let mainCategoryImageToFirebase;
    let categoryImageToFirebase;
    // if(fileUpload.mainCategoryImage ){
    //    mainCategoryImageToFirebase=await uploadFileToFirebase(`/ssastore/allcategories/maincategories/${mainCategory}/`,fileUpload.mainCategoryImage)

    // }
    mainCategoryImageToFirebase = selectMainCategory?.find(
      (value) => value?._id === mainCategory
    );
    if (fileUpload.categoryImage) {
      categoryImageToFirebase = await uploadFileToFirebase(
        `/ssastore/allcategories/categories/${category}/`,
        fileUpload.categoryImage
      );
    }
    let subCategoryImageToFirebase = [];
    for (let i = 0; i < subCategoryField.length; i++) {
      if (subCategoryField[i].subCategoryImage) {
        const getImageData = await uploadFileToFirebase(
          `/ssastore/allcategories/subcategories/${subCategoryField[i].subcategory}/`,
          subCategoryField[i].subCategoryImage
        );
        // console.log("getImageData",getImageData)
        subCategoryImageToFirebase[i] = getImageData;
      }
    }

    // console.log("FORM DATA CATEGORY==",categoryImageToFirebase)
    console.log("FORM DATA MAIN CATEGORY==", mainCategoryImageToFirebase);
    // console.log("FORM DATA SUB CATEGORY==",subCategoryImageToFirebase)

    let subCategoryData = [];
    if (subCategoryImageToFirebase.length > 0) {
      for (let i = 0; i < subCategoryImageToFirebase.length; i++) {
        const createSubCategoryData = {
          name: subCategoryField[i].subcategory?.toLowerCase(),
          image: {
            image_name: subCategoryImageToFirebase[i].image_name,
            image_url: subCategoryImageToFirebase[i].image_url,
            path: subCategoryImageToFirebase[i]?.path,
          },
          slug: splitString(subCategoryField[i].subcategory?.toLowerCase()),
          parent_main_category: mainCategory?.toLowerCase(),
          parent_category: category?.toLowerCase(),
        };
        subCategoryData[i] = createSubCategoryData;
      }
    } else {
      for (let i = 0; i < subCategoryField.length; i++) {
        const createSubCategoryDataWithoutImage = {
          name: subCategoryField[i].subcategory?.toLowerCase(),
          image: { image_name: "", image_url: "" },
          slug: splitString(subCategoryField[i].subcategory?.toLowerCase()),
          parent_main_category: mainCategory?.toLowerCase(),
          parent_category: category?.toLowerCase(),
          rewardPercentage: +subCategoryField?.[i]?.rewardPercentage,
        };
        subCategoryData[i] = createSubCategoryDataWithoutImage;
      }
    }

    console.log("subCategoryData----------->>>>>>>>>>", subCategoryData);

    let data = {
      mainCategory: mainCategory,
      main_category_slug: splitString(mainCategory?.toLowerCase()),
      category: category,
      category_slug: splitString(category?.toLowerCase()),
      mainCategoryImage: mainCategoryImageToFirebase?.main_category_image?.path
        ? mainCategoryImageToFirebase?.main_category_image
        : { image_name: "", image_url: "" },
      categoryImage: categoryImageToFirebase,
      subcategory: [...subCategoryData],
    };

    await axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/create/category`, data, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        if (response?.data?.status === true) {
          setMainCategory("");
          setCategory("");
          setSubCategoryField([{ subcategory: "", subCategoryImage: null }]);
          setFileUpload({ mainCategoryImage: null, categoryImage: null });
          // setMessage("success","Category Added Successfully !")
          setMessage((prev) => ({
            ...prev,
            type: "success",
            message: "Category Added Successfully !",
          }));
          setSnackbarOpen(true);
        } else {
          setError(response?.data?.message);
          // setMessage("error","An Unexpected Error occur !")
          setMessage((prev) => ({
            ...prev,
            type: "error",
            message: "An Unexpected Error occur !",
          }));
          setSnackbarOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
    console.log("FORM SUBMITTED");
  };
  // ##################### HANDLE SUBMIT AND POST DATA #####################

  //################################## REMOVE IMAGE FUNCTIONS ##################################
  let handleChange = (i, e) => {
    let newFormValues = [...subCategoryField];
    newFormValues[i][e.target.name] = e.target.value;
    setSubCategoryField(newFormValues);
  };

  let addFormFields = () => {
    setSubCategoryField([...subCategoryField, { subcategory: "" }]);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...subCategoryField];
    newFormValues.splice(i, 1);
    setSubCategoryField(newFormValues);
  };
  //################################## REMOVE IMAGE FUNCTIONS ##################################

  // ##################### SNACK BAR FUNCTIONs ##################
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };
  // ##################### SNACK BAR FUNCTIONs ##################

  const handleFilterByMainCategory = async (e) => {
    setFilterMainCategory(e.target.value);
    if (e.target.value == "Select Brand") {
      return;
    }
    setMainCategory(e.target.value);
  };

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
          <h2>Add Category</h2>
          <p>Add your Product category and necessary information from here</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p
            style={{ color: palette.primary.main, textTransform: "capitalize" }}
          >
            {error}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex-justify-center">
            <div className="add-category-form-box">
              <div className="add-category-select-box">
                <h4 style={{ paddingBottom: 8 }}>Select Brand</h4>
                <FormControl fullWidth>
                  {/* <InputLabel id="demo-select-main-category">Filter By Main Category</InputLabel> */}
                  <TextField
                    labelId="demo-select-main-category"
                    id="demo-select-main-category"
                    select
                    value={filterMainCategory}
                    required
                    onChange={(e) => handleFilterByMainCategory(e)}
                    style={{ textTransform: "capitalize" }}
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CategoryIcon />
                        </InputAdornment>
                      ),
                    }}
                  >
                    <MenuItem value="Select Brand">Select Brand </MenuItem>
                    {selectMainCategory.map((item) => (
                      <MenuItem
                        style={{ textTransform: "capitalize" }}
                        key={item._id}
                        value={item._id}
                      >
                        {item._id}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </div>
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
        <CloseIcon style={{color:palette.primary.main}} onClick={handleRemoveMainCategoryImage} />
        </div>
        <Avatar
        alt="Remy Sharp"
        src={fileUpload.mainCategoryImage? URL.createObjectURL(fileUpload.mainCategoryImage) :noImage}
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
                  <div style={{ display: "flex", gap: 5 }}>
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
                      type={"number"}
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
                          onClick={handleRemoveCategoryImage}
                        />
                      </div>
                      {/* <Avatar
        alt="Remy Sharp"
        src={fileUpload.categoryImage? URL.createObjectURL(fileUpload.categoryImage) :noImage}
        sx={{ width: 56, height: 56 }}
      /> */}
                      <img
                        className="category-table-image"
                        alt="category-image"
                        src={
                          fileUpload.categoryImage
                            ? URL.createObjectURL(fileUpload.categoryImage)
                            : noImage
                        }
                      />

                      {/* <img src={fileUpload ? URL.createObjectURL(fileUpload):"" } alt="" />  */}
                    </div>
                  </div>
                </div>
                {subCategoryField.map((element, index) => (
                  <div className="add-category-field" key={index}>
                    <div className="flex">
                      <label htmlFor="">Sub Category {index + 1} </label>
                      {index ? (
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
                        name="subcategory"
                        value={element.subcategory || ""}
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
                        inputProps={{ min: 0, step: 1 }}
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
                      {/* <input type="file" /> */}
                      <div className="uploaded-images">
                        <div className="close-image-icon">
                          <CloseIcon
                            style={{ color: palette.primary.main }}
                            onClick={() => handleRemoveSubCategoryImage(index)}
                          />
                        </div>
                        {/* <Avatar
        alt="Remy Sharp"
        src={subCategoryField[index].subCategoryImage ? URL.createObjectURL(subCategoryField[index].subCategoryImage) :noImage}
        sx={{ width: 56, height: 56 }}
      /> */}
                        <div>
                          <img
                            className="category-table-image"
                            alt="category-image"
                            src={
                              subCategoryField[index].subCategoryImage
                                ? URL.createObjectURL(
                                    subCategoryField[index].subCategoryImage
                                  )
                                : noImage
                            }
                          />
                        </div>
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
                Add More{" "}
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

export default AddCategory;

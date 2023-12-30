import React, { useEffect, useState } from "react";
import LoadingSpinner from "src/components/Spinner";
import classes from "./CreateGiftCategories.module.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FormHelperText } from "@mui/material";
import FileUploadDesign from "src/components/common/FileUploadDesign";
import CancelIcon from "@mui/icons-material/Cancel";
import { uploadFileToFirebase } from "src/global/globalFunctions";
import { axiosInstance } from "src/services/axios.service";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const schema = yup.object().shape({
  name: yup.string().required().typeError("Category name is required"),
});

function CreateGiftCategories() {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [fileUpload, setFileUpload] = useState();
  const [images, setImages] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const params = useParams();
  const categoryId = !!params && params?.id !== "create" ? params.id : null;

  const handleFileUpload = (e) => {
    if (e.target.files?.length > 4)
      return alert("You can only select 4 images");
    let allImages = [...e.target.files];
    setFileUpload(allImages);
  };

  const handleRemoveImage = (removeByIndex) => {
    console.log(removeByIndex);
    const afterRemove = fileUpload?.filter((_, index) => {
      return index != removeByIndex;
    });
    setFileUpload(afterRemove);
  };

  const submitHandler = async (data) => {
    try {
      setLoading(true);
      let categoryImages = [];
      if (!!fileUpload && fileUpload.length > 0) {
        for (let i = 0; i < fileUpload?.length; i++) {
          categoryImages[i] = await uploadFileToFirebase(
            `/ssastore/products/gift-category/`,
            fileUpload[i]
          );
        }
      }

      if (categoryId) {
        const response = await axiosInstance.patch(
          "/gift/update-gift-category",
          {
            categoryImages,
            name: data.name,
            categoryId,
          }
        );
        if (response && response?.data?.message) {
          toast.success(response.data.message);
        }
      } else {
        const response = await axiosInstance.post(
          "/gift/create-gift-category",
          {
            categoryImages,
            name: data.name,
          }
        );

        if (response && response?.data?.message) {
          toast.success(response.data.message);
        }
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

  const getSingleCategory = async (categoryId) => {
    try {
      const response = await axiosInstance.get(
        `/gift/get-single-gift-category?categoryId=${categoryId}`
      );
      if (!!response && response?.data?.category) {
        setValue("name", response.data.category?.name);
        setImages(response.data.category?.categoryImages);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!!params && params?.id !== "create") {
      getSingleCategory(params.id);
    }
  }, [params]);

  return (
    <div>
      <LoadingSpinner loading={isLoading} />
      <h1 className={classes["heading"]}>
        {categoryId ? "Edit" : `Create`} Gift Category
      </h1>
      <p className={classes["para"]}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut in ipsam
        asperiores, est iusto deserunt amet voluptatibus ipsum incidunt
        explicabo?
      </p>
      <FileUploadDesign
        fileUpload={fileUpload}
        handleFileUpload={handleFileUpload}
      />
      <div className="" style={{ paddingTop: 20 }}>
        {fileUpload?.length > 0 &&
          fileUpload?.map((value, index) => (
            <div key={index} className="uploaded-images-preview">
              <img
                className="category-table-image"
                alt="product"
                src={URL.createObjectURL(value)}
              />
              <p>{value.name}</p>
              <div className="remove-product-image-button">
                <CancelIcon
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() => handleRemoveImage(index)}
                />
              </div>
            </div>
          ))}
        {images?.length > 0 &&
          images?.map((item) => (
            <div key={item.image_url} className="uploaded-images-preview">
              <img
                className="category-table-image"
                alt="product"
                src={item.image_url}
              />
            </div>
          ))}
      </div>
      <Box
        onSubmit={handleSubmit(submitHandler)}
        component="form"
        marginTop={2}
        sx={{ "& > :not(style)": { my: 1, width: "100%" } }}
      >
        <Box sx={{ width: "100%" }}>
          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                onChange={onChange}
                value={value || ""}
                style={{ width: "100%" }}
                label="Category name"
                variant="outlined"
              />
            )}
          />
          {!!errors?.name?.message ? (
            <FormHelperText error>{errors.name.message}</FormHelperText>
          ) : null}
        </Box>
        <Box>
          <Button type="submit" variant="contained">
            {categoryId ? "Update" : `Add`} Category
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default CreateGiftCategories;

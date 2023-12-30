import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FormHelperText, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import { axiosInstance } from "src/services/axios.service";
import CancelIcon from "@mui/icons-material/Cancel";
import FileUploadDesign from "src/components/common/FileUploadDesign";
import { uploadFileToFirebase } from "src/global/globalFunctions";
import LoadingSpinner from "src/components/Spinner";

const schema = yup.object().shape({
  name: yup.string().required().typeError("Gift name is required"),
  quantity: yup.number().optional(),
  giftCollectedPoints: yup.number().optional(),
  giftCategory: yup.string().required().typeError("Gift category is required"),
});

function CreateGiftProduct() {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [giftCategoriesList, setGiftCategoriesList] = useState([]);
  const [fileUpload, setFileUpload] = useState();
  const [images, setImages] = useState([]);
  const [isLoading, setLoading] = useState(false);

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

  const getGiftCategories = async function () {
    try {
      const response = await axiosInstance.get(`/gift/get-gift-categories-ids`);
      if (!!response && response?.data?.categories) {
        setGiftCategoriesList(response?.data?.categories);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const submitHandler = async (data) => {
    try {
      setLoading(true);
      let giftImages = [];
      if (!!fileUpload && fileUpload.length > 0) {
        for (let i = 0; i < fileUpload?.length; i++) {
          giftImages[i] = await uploadFileToFirebase(
            `/ssastore/products/gift-category/`,
            fileUpload[i]
          );
        }
      }

      const response = await axiosInstance.post("/gift/create-new-gift", {
        ...data,
        giftImages,
      });

      if (response && response?.data?.message) {
        toast.success(response.data.message);
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

  useEffect(() => {
    getGiftCategories();
  }, []);

  return (
    <div>
      <LoadingSpinner loading={isLoading} />
      <Box
        onSubmit={handleSubmit(submitHandler)}
        component="form"
        sx={{ "& > :not(style)": { mb: 3, width: "100%" } }}
      >
        <Box>
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
        </Box>
        <Box sx={{ width: "100%" }}>
          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                onChange={onChange}
                value={value || ""}
                style={{ width: "100%" }}
                label="Gift name"
                variant="outlined"
                type="text"
              />
            )}
          />
          {!!errors?.name?.message ? (
            <FormHelperText error>{errors.name.message}</FormHelperText>
          ) : null}
        </Box>
        <Box sx={{ width: "100%" }}>
          <Controller
            name="quantity"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                onChange={onChange}
                value={value || ""}
                style={{ width: "100%" }}
                label="Quantity"
                variant="outlined"
                type="number"
              />
            )}
          />
        </Box>
        <Box sx={{ width: "100%" }}>
          <Controller
            name="giftCollectedPoints"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                onChange={onChange}
                value={value || ""}
                style={{ width: "100%" }}
                label="Gift Collected Points"
                variant="outlined"
                type="number"
              />
            )}
          />
        </Box>
        <Box sx={{ width: "100%" }}>
          <Controller
            name="giftCategory"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                onChange={onChange}
                value={value || ""}
                style={{ width: "100%" }}
                select
                label="Select"
              >
                {!!giftCategoriesList && giftCategoriesList.length
                  ? giftCategoriesList.map((option) => (
                      <MenuItem key={option._id} value={option._id}>
                        {option.name}
                      </MenuItem>
                    ))
                  : null}
              </TextField>
            )}
          />
        </Box>
        <Box>
          <Button type="submit" variant="contained">
            Add Gift
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default CreateGiftProduct;

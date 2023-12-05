import {
  Button,
  IconButton,
  MenuItem,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useRef, useState } from "react";

import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { alpha } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";
import axios from "axios";
import PropTypes from "prop-types";
import { useEffect } from "react";
import {
  deleteImageFromFirebase,
  returnFileName,
  uploadFileToFirebase,
} from "src/global/globalFunctions";
import noImage from "../assests/No_image.svg";
import searchNotFound from "../assests/searchnotfound.gif";
import Iconify from "../components/Iconify";
import ConfimModal from "../global/Modals/ConfimModal";
import CustomizedSnackbars from "../global/Snackbar/CustomSnackbar";
import { convertDate } from "../global/globalFunctions";

function createData(name, calories, fat, carbs, protein) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

const rows = [
  createData("Cupcake", 305, 3.7, "pending", 4.3),
  createData("Donut", 452, 25.0, "verified", 4.9),
  createData("Eclair", 262, 16.0, "pending", 6.0),
  createData("Frozen yoghurt", 159, 6.0, "verified", 4.0),
  createData("Gingerbread", 356, 16.0, "not verified", 3.9),
  createData("Honeycomb", 408, 3.2, "not verified", 6.5),
  createData("Ice cream sandwich", 237, 9.0, "not verified", 4.3),
  createData("Jelly Bean", 375, 0.0, "pending", 0.0),
  createData("KitKat", 518, 26.0, "verified", 7.0),
  createData("Lollipop", 392, 0.2, "not verified", 0.0),
  createData("Marshmallow", 318, 0, "verified", 2.0),
  createData("Nougat", 360, 19.0, "not verified", 37.0),
  createData("Oreo", 437, 18.0, "not verified", 4.0),
];

const bannerType = [
  { value: "", label: "Select" },
  { value: "rewards", label: "Rewards banner" },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "shop_name",
    numeric: false,
    disablePadding: true,
    label: "",
  },
  //   {
  //     id: 'shop_id',
  //     numeric: false,
  //     disablePadding: true,
  //     label: '',
  //   },

  {
    id: "banner_name",
    numeric: false,
    disablePadding: false,
    label: "Banner Name",
  },

  {
    id: "publish_date",
    numeric: true,
    disablePadding: false,
    label: "Publish date ",
  },

  // {
  //   id: 'total_products',
  //   numeric: true,
  //   disablePadding: false,
  //   label: '',
  // },

  {
    id: "delivery_method",
    numeric: true,
    disablePadding: false,
    label: " ",
  },
  {
    id: "category",
    numeric: true,
    disablePadding: false,
    label: "Link Category",
  },
  {
    id: "banner_type",
    numeric: true,
    disablePadding: false,
    label: "Banner type",
  },
  {
    id: "update",
    numeric: true,
    disablePadding: false,
    label: "",
  },
  {
    id: "action",
    numeric: true,
    disablePadding: false,
    label: "Action",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    countVendor,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "center" : "left"}
            padding={headCell.disablePadding ? "none" : "none"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ textTransform: "uppercase" }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected, countVendor } = props;
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <div
          className="flex-justify-between "
          style={{ width: "100%", paddingTop: 6, paddingRight: 6 }}
        >
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            {`Banners (${props.countVendor})`}
          </Typography>
          <Button
            variant="contained"
            style={{ width: "20%", padding: "10px", boxShadow: "none" }}
            component="label"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Add Banner
            <input
              hidden
              accept="image/*"
              onChange={props.addNewBanner}
              multiple
              type="file"
            />
          </Button>
        </div>
      )}

      <Tooltip title="Filter list">
        <>
          {numSelected > 0 && (
            <Tooltip title="More">
              <IconButton>
                <MoreVertOutlinedIcon
                  style={{ cursor: "pointer" }}
                  ref={ref}
                  onClick={() => setIsOpen(true)}
                  fontSize="medium"
                />
                {/* <Menu
      open={isOpen}
      anchorEl={ref.current}
      onClose={() => setIsOpen(false)}
      PaperProps={{
        sx: { width: 200, maxWidth: '100%' },
      }}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
       <MenuItem component={Link} to="#" sx={{ color: 'text.secondary' }}>
        <ListItemIcon>
          <Iconify icon="eva:edit-fill" width={24} height={24} />
        </ListItemIcon>
        <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
      </MenuItem>
      <MenuItem sx={{ color: 'text.secondary' }}>
        <ListItemIcon>
          <Iconify icon="eva:trash-2-outline" width={24} height={24} />
        </ListItemIcon>
        <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
      </MenuItem>

     
    </Menu> */}
              </IconButton>
            </Tooltip>
          )}
        </>
      </Tooltip>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function Banners() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [filterName, setFilterName] = useState("");
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [data, setData] = useState([]);
  const [categoryForLinkBanner, setCategoryForLinkBanner] = useState([]);
  const [selectedBannerCategory, setSelectedBannerCategory] = useState();
  const [bannerTypeInfo, setBannerTypeInfo] = useState("");
  const [updateCategoryBtn, setUpdateCategoryBtn] = useState();
  const [countVendor, setCountVendor] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState({ type: "", message: "" });
  const [render, setRender] = useState(false);
  const [openRemoveImageModal, setOpenRemoveImageModal] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [fileUpload, setFileUpload] = useState();
  const [loading, setLoading] = useState(false);
  const [addBannerFileUpload, setaddBannerFileUpload] = useState();
  const open = Boolean(anchorEl);
  // console.log("all Banners===",data)
  // console.log("CATEGORY  BANNER ===",selectedBannerCategory)
  // console.log("CATEGORY  UPDATE ===",updateCategoryBtn)

  // ================== GET ALL Banners ==============
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/get/all/banners`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("BANNERS DATA", res?.data);
        setData(res?.data?.allbanners);
        setCategoryForLinkBanner(res?.data?.category);
        setCountVendor(res?.data?.allbanners?.length);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [render]);
  // ================== GET ALL Banners ==============

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };
  // ##################### SNACK BAR FUNCTIONs ##################
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };
  // ##################### SNACK BAR FUNCTIONs ##################

  const handleCloseSubCateConfirmModal = (i) => {
    console.log("CLOSE MODAL", i);
    let closeModalState = [...openRemoveImageModal];
    closeModalState[i] = false;
    setOpenRemoveImageModal(closeModalState);
  };

  const handleOpenRemoveImageModal = (i, value) => {
    console.log("openModal ==", i, "-==", value);
    let newModalState = [...openRemoveImageModal];
    newModalState[i] = value;
    setOpenRemoveImageModal(newModalState);
  };
  // REMOVE BANNER IMAGE
  const handleRemoveBannerImage = async (
    i,
    bannerId,
    image_name,
    image_path
  ) => {
    console.log(" DELETE BANNER ==", bannerId, image_name, image_path);
    let closeModalState = [...openRemoveImageModal];
    closeModalState[i] = false;
    setOpenRemoveImageModal(closeModalState);
    deleteImageFromFirebase(image_path, image_name);
    await axios
      .delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/delete/banner/by/id/${bannerId}`,
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        if (res?.data?.status === true) {
          setMessage((prev) => ({
            ...prev,
            type: "success",
            message: "Banner Deleted Successfully !",
          }));
          setSnackbarOpen(true);
          setRender((prev) => !prev);
        } else {
          setMessage((prev) => ({
            ...prev,
            type: "error",
            message: "Banner Deleted Failed !",
          }));
          setSnackbarOpen(true);
          setRender((prev) => !prev);
        }
      })
      .catch((err) => {
        let closeModalState = [...openRemoveImageModal];
        closeModalState[i] = false;
        setOpenRemoveImageModal(closeModalState);
        setMessage((prev) => ({
          ...prev,
          type: "error",
          message: "Banner Deleted Failed !",
        }));
        console.log(err);
      });
  };

  // add new banner
  const addNewBanner = async (e) => {
    // console.log(e)
    setLoading(true);
    if (e.target.files?.length > 1)
      return alert("You can only select 1 images");
    // console.log(e.target.files[0])
    let allImages = [...e.target.files];
    setaddBannerFileUpload(allImages);
    const bannersToFirebase = await uploadFileToFirebase(
      `/ssastore/banners/${e.target?.files[0]?.name}/`,
      e.target.files[0]
    );
    //    console.log("IMAGES AFTER FIREBASE",bannersToFirebase);
    if (bannersToFirebase.image_url) {
      await axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/api/add/new/banner`,
          { ...bannersToFirebase },
          { withCredential: true }
        )
        .then((res) => {
          console.log(res?.data);
          setMessage((prev) => ({
            ...prev,
            type: "success",
            message: "Banner Added Successfully !",
          }));
          setSnackbarOpen(true);
          setRender((prev) => !prev);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setMessage((prev) => ({
            ...prev,
            type: "error",
            message: "Banner Not Uploaded !",
          }));
          setSnackbarOpen(true);
          setRender((prev) => !prev);
          setLoading(false);
        });
    }
  };

  // chnage banner
  const handleFileUpload = async (bannerId, e) => {
    // console.log(e)
    setLoading(true);
    if (e.target.files?.length > 1)
      return alert("You can only select 1 images");
    // console.log(e.target.files[0])
    let allImages = [...e.target.files];
    setaddBannerFileUpload(allImages);
    const bannersToFirebase = await uploadFileToFirebase(
      `/ssastore/banners/${e.target?.files[0]?.name}/`,
      e.target.files[0]
    );
    //    console.log("IMAGES AFTER FIREBASE",bannersToFirebase);
    if (bannersToFirebase.image_url) {
      await axios
        .patch(
          `${process.env.REACT_APP_BACKEND_URL}/api/change/banner/by/id/${bannerId}`,
          { ...bannersToFirebase },
          { withCredential: true }
        )
        .then((res) => {
          console.log(res?.data);
          if (res?.data?.status) {
            deleteImageFromFirebase(
              res?.data?.previous?.path,
              res?.data?.previous?.image_name
            );
            setMessage((prev) => ({
              ...prev,
              type: "success",
              message: "Banner Change Successfully !",
            }));
            setSnackbarOpen(true);
            setRender((prev) => !prev);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setMessage((prev) => ({
            ...prev,
            type: "error",
            message: "Banner Not Changed !!",
          }));
          setSnackbarOpen(true);
          setRender((prev) => !prev);
          setLoading(false);
        });
    }
  };
  // console.log(fileUpload)

  // ===== HANDLE CHANGE BANNER BANNER CATEGORY ========
  const handleChangeBannerCategory = (_id, value, index) => {
    setSelectedBannerCategory((prev) => ({
      bannerId: _id,
      select_category: value,
    }));
    let updateBannerCate = data;
    for (let i = 0; i < updateBannerCate?.length; i++) {
      if (updateBannerCate[i]._id == _id) {
        updateBannerCate[i].selected_category = value;
      }
    }
    setData(updateBannerCate);
    setUpdateCategoryBtn((prev) => ({ index: index, status: true }));
  };
  // ===== HANDLE CHANGE BANNER BANNER CATEGORY ========

  const handleUpdateBannerCategory = async (banner_id, category) => {
    console.log(
      "handleUpdateBannerCategory adlashdlkahslkdhlaskhdlsakhdlashdklhasjldhasjlhdjkash =",
      banner_id,
      category
    );
    setLoading(true);
    const linkCategoryData = {
      selected_category: category,
      category_chain: {},
      bannerType: bannerTypeInfo,
    };
    for (let i = 0; i < categoryForLinkBanner?.length; i++) {
      if (categoryForLinkBanner[i]?.sub_category == category) {
        linkCategoryData.category_chain = categoryForLinkBanner[i];
      }
    }

    console.log("linkCategoryData ======>>>>>>>", linkCategoryData);
    await axios
      .patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/link/banner/to/category/by/id/${banner_id}`,
        { ...linkCategoryData },
        { withCredential: true }
      )
      // await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/link/banner/to/category/by/id/${banner_id}`,{selected_category:category},{withCredential:true})
      .then((res) => {
        console.log(res?.data);
        if (res?.data?.status) {
          setMessage((prev) => ({
            ...prev,
            type: "success",
            message: "Banner Change Successfully !",
          }));
          setSnackbarOpen(true);
          setRender((prev) => !prev);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setMessage((prev) => ({
          ...prev,
          type: "error",
          message: "Banner Not Changed !!",
        }));
        setSnackbarOpen(true);
        setRender((prev) => !prev);
        setLoading(false);
      });
  };

  console.log("selectedBannerCategory==>", selectedBannerCategory);

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
      <div className="custom-conatiner">
        {/* #################### SANCKBAR MESSAGE ######################## */}
        <CustomizedSnackbars
          onOpen={snackbarOpen}
          type={message?.type}
          handleClose={handleCloseSnackbar}
          message={message?.message}
        />
        {/* #################### SANCKBAR MESSAGE ######################## */}

        <Box sx={{ width: "100%" }}>
          <Paper elevation={3} sx={{ width: "100%", mb: 2, borderRadius: 1 }}>
            {/* <VendorListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}
            {/* <UserListToolbar filterName={filterName} onFilterName={handleFilterByName} /> */}
            <EnhancedTableToolbar
              numSelected={selected.length}
              countVendor={countVendor}
              addNewBanner={addNewBanner}
            />
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? "small" : "medium"}
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={data?.length}
                />

                <TableBody>
                  {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
                  {stableSort(data, getComparator(order, orderBy))
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    ?.map((row, index) => {
                      const isItemSelected = isSelected(row._id);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <>
                          <ConfimModal
                            open={openRemoveImageModal[index]}
                            title="Delete"
                            onYes={() =>
                              handleRemoveBannerImage(
                                index,
                                row?._id,
                                row?.image_name,
                                row?.path
                              )
                            }
                            message="Do you want to delete?"
                            handleClose={() =>
                              handleCloseSubCateConfirmModal(index)
                            }
                          />

                          <TableRow
                            hover
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row._id}
                            selected={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                onClick={(event) => handleClick(event, row._id)}
                                checked={isItemSelected}
                                inputProps={{
                                  "aria-labelledby": labelId,
                                }}
                              />
                            </TableCell>
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                              style={{ textTransform: "capitalize" }}
                            >
                              <a target="_blank" href={row?.image_url}>
                                <img
                                  className="banner-table-image"
                                  alt="product"
                                  src={
                                    row?.image_url
                                      ? `${row?.image_url}`
                                      : noImage
                                  }
                                />
                              </a>
                              {/* <img className='banner-table-image' alt="product" src='https://firebasestorage.googleapis.com/v0/b/shop-daba0.appspot.com/o/banner.webp?alt=media&token=31da54ac-d9e6-4b1a-ae43-49b3c0c89744' /> */}
                            </TableCell>
                            <TableCell
                              style={{ textTransform: "capitalize" }}
                              align="left"
                            >
                              {returnFileName(row?.image_name)}
                            </TableCell>

                            <TableCell align="center">
                              {convertDate(row?.updatedAt)}
                            </TableCell>
                            <TableCell align="right">{""}</TableCell>
                            <TableCell align="center">
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <TextField
                                  style={{
                                    textTransform: "capitalize",
                                    width: 160,
                                  }}
                                  labelId="demo-select-small"
                                  id="demo-select-small"
                                  className="select_field"
                                  value={row?.selected_category}
                                  onChange={(e) =>
                                    handleChangeBannerCategory(
                                      row?._id,
                                      e.target?.value,
                                      index
                                    )
                                  }
                                  name="product_subcategory"
                                  label="Select Category"
                                  select
                                  SelectProps={{
                                    isNative: true,
                                    MenuProps: {
                                      PaperProps: {
                                        style: {
                                          maxHeight: 350,
                                          width: 200,
                                        },
                                      },
                                    },
                                  }}
                                >
                                  {/* <MenuItem value='choose_sub_category'>Choose Category </MenuItem> */}
                                  {categoryForLinkBanner?.map((value) => (
                                    <MenuItem
                                      key={value?.sub_category}
                                      style={{ textTransform: "capitalize" }}
                                      value={value?.sub_category}
                                    >
                                      {value?.sub_category}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </div>
                            </TableCell>
                            <TableCell align="center">
                              <TextField
                                name="bannerType"
                                value={row?.bannerType}
                                onChange={(e) => {
                                  setBannerTypeInfo(e.target.value);
                                  setUpdateCategoryBtn(() => ({
                                    index: index,
                                    status: true,
                                  }));
                                }}
                                select
                                label="Select"
                                sx={{ marginLeft: 2, width: 200 }}
                              >
                                {bannerType.map((option) => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                disabled={
                                  updateCategoryBtn?.index == index
                                    ? false
                                    : true
                                }
                                sx={{ marginLeft: 2 }}
                                onClick={() =>
                                  handleUpdateBannerCategory(
                                    row?._id,
                                    selectedBannerCategory?.select_category
                                  )
                                }
                                variant="contained"
                                startIcon={
                                  <Iconify icon="material-symbols:check-circle-outline-rounded" />
                                }
                              >
                                {" "}
                                Update
                              </Button>
                            </TableCell>
                            {/* <TableCell align="right">{row.total_products}</TableCell> */}
                            <TableCell align="center">
                              {/* <EditOutlinedIcon fontSize='small' /> */}
                              {/* <VisibilityOutlinedIcon fontSize='small' /> */}
                              {/* <Button variant="contained" style={{boxShadow:'none'}}  startIcon={<Iconify icon="eva:plus-fill" />}> 
          
               </Button> */}
                              <Button
                                variant="contained"
                                style={{ boxShadow: "none" }}
                                component="label"
                                startIcon={<Iconify icon="akar-icons:edit" />}
                              >
                                Change
                                <input
                                  hidden
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleFileUpload(row?._id, e)
                                  }
                                  multiple
                                  type="file"
                                />
                              </Button>

                              <Button
                                onClick={() =>
                                  handleOpenRemoveImageModal(index, true)
                                }
                                variant="contained"
                                style={{
                                  backgroundColor: "#de040c",
                                  marginLeft: 8,
                                  boxShadow: "none",
                                }}
                                startIcon={
                                  <Iconify icon="eva:trash-2-outline" />
                                }
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })}
                  {!data.length > 0 && (
                    <TableCell colSpan={12}>
                      {" "}
                      <div className="search-not-found">
                        <img
                          className="search-not-found-img"
                          src={searchNotFound}
                          alt="searchNotFound"
                        />
                        <Typography
                          variant="h6"
                          id="tableTitle"
                          component="div"
                        >
                          Banners Not Found
                        </Typography>
                      </div>{" "}
                    </TableCell>
                  )}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={countVendor}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
          />
        </Box>
      </div>
    </>
  );
}

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Toolbar,
  TextField,
  Tooltip,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Button,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@mui/material/InputLabel";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import SideDrawer from "../global/Drawer";
import OrderListToolbar from "../sections/@dashboard/orders/OrderListToolbar";
import AddCategory from "./SidebarPages/categorypage/AddCategory";
import EditCategory from "./SidebarPages/categorypage/EditCategory";
import Iconify from "../components/Iconify";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import searchNotFound from "../assests/searchnotfound.gif";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import noImage from "../assests/No_image.svg";
import EditMainCategory from "./SidebarPages/categorypage/EditMainCategory";
import CustomizedSnackbars from "../global/Snackbar/CustomSnackbar";
import ConfimModal from "../global/Modals/ConfimModal";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

function createData(name, calories, fat, carbs, protein, amount, status) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    amount,
    status,
  };
}

const rows = [
  createData("Cupcake", 305, 3.7, 67, "COD", 40, "pending"),
  createData("Donut", 452, 25.0, 51, "COD", 100, "cancel"),
  createData("Eclair", 262, 16.0, 24, "COD", 100, "delivered"),
  createData("Frozen yoghurt", 159, 6.0, 24, "COD", 100, "delivered"),
  createData("Gingerbread", 356, 16.0, 49, "COD", 10, "pending"),
  createData("Honeycomb", 408, 3.2, 87, "COD", 100, "pending"),
  createData("Ice cream sandwich", 237, 9.0, 37, "COD", 100, "pending"),
  createData("Jelly Bean", 375, 0.0, 94, "COD", 100, "processing"),
  createData("KitKat", 518, 26.0, 65, "COD", 20, "processing"),
  createData("Lollipop", 392, 0.2, 98, "COD", 100, "processing"),
  createData("Marshmallow", 318, 0, 81, "COD", 100, "pending"),
  createData("Nougat", 360, 19.0, 9, "COD", 100, "cancel"),
  createData("Oreo", 437, 18.0, 63, "COD", 100, "cancel"),
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
  const stabilizedThis = array.map((el, index) => [el, index]);
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
    id: "image",
    numeric: false,
    disablePadding: true,
    label: "Image",
  },
  {
    id: "Brands",
    numeric: true,
    disablePadding: false,
    label: "Brands",
  },
  {
    id: "Category",
    numeric: true,
    disablePadding: false,
    label: "Category ",
  },

  {
    id: "sub_category",
    numeric: true,
    disablePadding: false,
    label: "Sub Category",
  },
  {
    id: "View",
    numeric: true,
    disablePadding: false,
    label: "View",
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
            align={headCell.numeric ? "left" : "left"}
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
  const { numSelected } = props;
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const ref2 = useRef(null);
  const [isOpen2, setIsOpen2] = useState(false);

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
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          All {`(${props.countCategory})`}
        </Typography>
      )}

      <Tooltip title="Filter list">
        <>
          {numSelected > 0 && (
            <Tooltip title="More">
              <IconButton>
                <MoreVertOutlinedIcon
                  style={{ cursor: "pointer" }}
                  ref={ref2}
                  onClick={() => setIsOpen2(true)}
                  fontSize="medium"
                />
                <Menu
                  open={isOpen2}
                  anchorEl={ref2.current}
                  onClose={() => setIsOpen2(false)}
                  PaperProps={{
                    sx: { width: 200, maxWidth: "100%" },
                  }}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  {/* <MenuItem component={Link} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem> */}
                  <MenuItem
                    sx={{ color: "text.secondary" }}
                    onClick={() => props.setOpenDeleteConfimModal(true)}
                  >
                    <ListItemIcon>
                      <Iconify
                        icon="eva:trash-2-outline"
                        width={24}
                        height={24}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Delete Brand"
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </MenuItem>
                </Menu>
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

export default function EnhancedTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const ref = useRef(null);
  const ref2 = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [drawerAddCategory, setDrawerAddCategory] = React.useState(false);
  const [drawerEditCategory, setDrawerEditCategory] = React.useState(false);
  const [drawerEditMainCategory, setDrawerEditMainCategory] =
    React.useState(false);
  const [age, setAge] = React.useState("");
  const [data, setData] = useState([]);
  const [countCategory, setCountCategory] = useState();
  const [categoryIdForEdit, setCategoryIdForEdit] = useState("");
  const [mainCategoryForFilter, setMainCategoryForFilter] = useState([]);
  const [filterMainCategory, setFilterMainCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [render, setRender] = useState(false);
  const [search, setSearch] = useState("");
  const [openDeleteConfimModal, setOpenDeleteConfimModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState({ type: "", message: "" });

  console.log("SELECTED-->", selected);

  // console.log("MAIN CATEGORY ERROR ===",categoryIdForEdit)
  // GET ALL CATEGORIES
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/get/all/category`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        setData(res.data?.all_categories);
        setCountCategory(res.data?.countCategory || 0);
        setMainCategoryForFilter(res.data?.categoryForFilter);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [drawerAddCategory, drawerEditCategory, render]);

  // useEffect(()=>{

  // },[filterMainCategory])

  // SEARCH IN CATEGORY TABLE
  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/search/in/category?search=${search}`,
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        setData(res.data?.result);
        setCountCategory(res.data?.result?.length || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Filter by main category handle chnage
  const handleFilterByMainCategory = async (e) => {
    setFilterMainCategory(e.target.value);
    if (e.target.value == "all") {
      setRender((prev) => !prev);
      return;
    }
    setLoading(true);
    await axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/filter/category?main_category=${e.target.value}`,
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        setData(res.data);
        setCountCategory(res.data?.length || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (event) => {
    setAge(event.target.value);
  };

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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  //   const handleFilterByName = (event) => {
  //   setFilterName(event.target.value);
  // };

  //############################# ADD CATEGORY SIDE BAR DRAWER FUNCTION #############################
  const handleOpenAddCategorySidebar = () => {
    setDrawerAddCategory(true);
  };

  const handleCloseAddCategorySideBar = () => {
    setDrawerAddCategory(false);
  };
  //############################# ADD CATEGORY SIDE BAR DRAWER FUNCTION #############################

  //############################# EDIT CATEGORY SIDE BAR DRAWER FUNCTION #############################
  const handleOpenEditCategorySidebar = () => {
    setDrawerEditCategory(true);
  };

  const handleCloseEditCategorySideBar = () => {
    setDrawerEditCategory(false);
    setRender((prev) => !prev);
  };
  //############################# EDIT CATEGORY SIDE BAR DRAWER FUNCTION #############################

  //############################# EDIT MAIN CATEGORY SIDE BAR DRAWER FUNCTION #############################
  const handleOpenEditMainCategorySidebar = () => {
    setDrawerEditMainCategory(true);
  };

  const handleCloseEditMainCategorySideBar = () => {
    setDrawerEditMainCategory(false);
    setRender((prev) => !prev);
  };
  //############################# EDIT MAIN CATEGORY SIDE BAR DRAWER FUNCTION #############################

  //############################# CLOSE DELETE CONFIRM MODAL FUNCTION #############################
  const handleCloseConfimModal = () => {
    setOpenDeleteConfimModal(false);
    setIsOpen2(false);
  };
  //############################# CLOSE DELETE CONFIM MODAL FUNCTION #############################

  //############################# HANDLE DELETE CATEGORIES FUNCTION #############################
  const handleDleteCategories = async (value) => {
    console.log("VALUE FOR DELETE=>", value);
    await axios
      .delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/delete/category`,
        { data: value },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        setOpenDeleteConfimModal(false);
        setRender((prev) => !prev);
        if (res?.data?.status) {
          setMessage((prev) => ({
            ...prev,
            type: "success",
            message: "Category Deleted Successfully !",
          }));
          setSnackbarOpen(true);
          setFilterMainCategory("all");
        }
        if (!res?.data?.status) {
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
        setOpenDeleteConfimModal(false);
      });
    setSelected([]);
  };
  //############################# HANDLE DELETE CATEGORIES FUNCTION #############################

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

      {/*################ EDIT CATEGORY SIDEBAR  ################*/}
      <SideDrawer
        state={drawerEditCategory}
        toggleDrawerClose={handleCloseEditCategorySideBar}
        toggleDrawerOpen={handleOpenEditCategorySidebar}
        ComponentData={
          <EditCategory
            handleClose={handleCloseEditCategorySideBar}
            mainCategoryId={categoryIdForEdit}
          />
        }
      />
      {/*################ EDIT CATEGORY SIDEBAR  ################*/}
      <div className="custom-conatiner">
        <Box sx={{ width: "100%" }}>
          {/* <Skeleton variant="rectangular"  height={118} animation="" /> */}
          <Paper elevation={3} sx={{ width: "100%", mb: 2, borderRadius: 1 }}>
            <div className="category-topbar-box ">
              <h3 className="">Brands</h3>
              {/* <Button variant="contained"  startIcon={<Iconify icon="eva:plus-fill" />}> 
     Add Category
         </Button> */}
              <div className="category-topbar-btn">
                <ReactHTMLTableToExcel
                  id="test-table-xls-button"
                  className="download-table-xls-button"
                  table="brands-export-to-xlsx"
                  filename="Brands export"
                  sheet="tablexls"
                  buttonText={
                    <Button
                      className="hide-mobile"
                      variant="outlined"
                      startIcon={<Iconify icon="akar-icons:download" />}
                    >
                      Export
                    </Button>
                  }
                />
                {/*################ MAIN CATEGORY SIDEBAR BUTTON ################*/}
                <SideDrawer
                  state={drawerEditMainCategory}
                  toggleDrawerClose={handleCloseEditMainCategorySideBar}
                  toggleDrawerOpen={handleOpenEditMainCategorySidebar}
                  ComponentData={
                    <EditMainCategory
                      handleClose={handleCloseEditMainCategorySideBar}
                    />
                  }
                  ComponentButton={
                    <Button
                      variant="contained"
                      startIcon={<Iconify icon="carbon:category" />}
                    >
                      Brands
                    </Button>
                  }
                />
                {/*################ MAIN CATEGORY SIDEBAR BUTTON ################*/}

                {/*################ ADD CATEGORY SIDEBAR BUTTON ################*/}
                <SideDrawer
                  state={drawerAddCategory}
                  toggleDrawerClose={handleCloseAddCategorySideBar}
                  toggleDrawerOpen={handleOpenAddCategorySidebar}
                  ComponentData={
                    <AddCategory handleClose={handleCloseAddCategorySideBar} />
                  }
                  ComponentButton={
                    <Button
                      variant="contained"
                      startIcon={<Iconify icon="eva:plus-fill" />}
                    >
                      Add Category
                    </Button>
                  }
                />
                {/*################ ADD CATEGORY SIDEBAR BUTTON ################*/}
              </div>
            </div>
            {/* CONFIRM MODAL */}
            <ConfimModal
              open={openDeleteConfimModal}
              title="Delete"
              onYes={() => handleDleteCategories(selected)}
              message="Do you want to delete?"
              handleClose={handleCloseConfimModal}
            />
            {/* CONFIRM MODAL */}
            <div className="flex flex-justify-between order-top-bar ">
              <form
                onSubmit={handleSearch}
                className="flex"
                style={{ width: "100%" }}
              >
                <TextField
                  id="outlined-basic"
                  type="search"
                  fullWidth
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  label="Search"
                  placeholder="Search Anything..."
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  className="search-btn"
                  sx={{ mx: 2, height: 54, px: 5 }}
                  type="submit"
                  variant="contained"
                >
                  Search
                </Button>
              </form>
              {/* <div style={{width:"60%"}} ></div>
   <div style={{width:"60%"}} ></div> */}
              <div className=" order-toolbar-selectbox-1">
                <FormControl fullWidth>
                  {/* <InputLabel id="demo-select-main-category">Filter By Main Category</InputLabel> */}
                  <TextField
                    labelId="demo-select-main-category"
                    id="demo-select-main-category"
                    select
                    value={filterMainCategory}
                    label="Filter By Brands"
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
                          <FilterAltOutlinedIcon />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {/* <MenuItem value="" selected >
          <em>Status</em>
        </MenuItem> */}
                    <MenuItem value="all">All</MenuItem>
                    {mainCategoryForFilter.map((item) => (
                      <MenuItem
                        style={{ textTransform: "capitalize" }}
                        key={item._id}
                        value={item._id}
                      >
                        {item._id}
                      </MenuItem>
                    ))}
                    {/* <MenuItem value={10}>Processing</MenuItem>
        <MenuItem value={20}>Delivered</MenuItem>
        <MenuItem value={30}>Cancel</MenuItem> */}
                  </TextField>
                </FormControl>
              </div>

              {/* <div className='more-icon-btn' >
    <Tooltip title="Filter list">
            <>
       <MoreVertOutlinedIcon style={{cursor:"pointer"}} ref={ref2} onClick={() => setIsOpen2(true)} fontSize='medium' />
       <Menu
        open={isOpen2}
        anchorEl={ref2.current}
        onClose={() => setIsOpen2(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Customer" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem component={Link} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:download-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Download" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
      </>

        </Tooltip>
       </div>
     <div className='more-text-btn'  >
      <Tooltip title="Filter list">
            <>
      <p  style={{display:"flex",justifyContent:"end"}} ref={ref} onClick={() => setIsOpen(true)} >More Option <ExpandMoreIcon /></p>
      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Customer" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem component={Link} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:download-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Download" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>

        </Tooltip>
     </div> */}
            </div>
          </Paper>

          <Paper elevation={3} sx={{ width: "100%", mb: 2 }}>
            <EnhancedTableToolbar
              countCategory={countCategory}
              setOpenDeleteConfimModal={setOpenDeleteConfimModal}
              numSelected={selected.length}
            />
            <TableContainer>
              <Table
                id="brands-export-to-xlsx"
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
                  rowCount={data.length}
                />
                <TableBody>
                  {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
                  {stableSort(data, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row._id);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
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
                              checked={isItemSelected}
                              onClick={(event) => handleClick(event, row._id)}
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
                            align="left"
                          >
                            {/* <Avatar alt="Remy Sharp" src={row?.category_image ? `${row.category_image.image_url}` :"" } /> */}
                            <a
                              target="_blank"
                              href={row?.category_image?.image_url}
                            >
                              <img
                                className="category-table-image"
                                alt="product"
                                src={
                                  row?.category_image
                                    ? `${row?.category_image?.image_url}`
                                    : noImage
                                }
                              />
                            </a>
                          </TableCell>
                          <TableCell
                            style={{ textTransform: "capitalize" }}
                            align="left"
                          >
                            {row.main_category_name}
                          </TableCell>
                          <TableCell
                            style={{ textTransform: "capitalize" }}
                            align="left"
                          >
                            {row.category_name}
                          </TableCell>
                          <TableCell
                            style={{ textTransform: "capitalize" }}
                            align="left"
                          >
                            <div className="sub-category-table-flex">
                              {row.subcategory.map(
                                (value, index) =>
                                  index < 3 && (
                                    <p
                                      className="sub-category-style"
                                      key={value.name}
                                    >
                                      {value.name?.slice(0, 12) + ".."}
                                    </p>
                                  )
                              )}
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            {/* <ModeEditOutlinedIcon fontSize='small' /> */}

                            {/*################ EDIT CATEGORY SIDEBAR BUTTON ################*/}
                            <div className="flex-justify-start">
                              {/* <SideDrawer state={drawerEditCategory} toggleDrawerClose={handleCloseEditCategorySideBar} toggleDrawerOpen={handleOpenEditCategorySidebar}
           ComponentData={<EditCategory handleClose={handleCloseEditCategorySideBar} mainCategoryId={categoryIdForEdit} />}
           ComponentButton={ <VisibilityOutlinedIcon style={{cursor:"pointer"}} onClick={()=>setCategoryIdForEdit(row._id)} fontSize='small' />} /> */}
                              {/*################ EDIT CATEGORY SIDEBAR BUTTON ################*/}

                              {row.category_name && (
                                <AppRegistrationIcon
                                  style={{ cursor: "pointer" }}
                                  fontSize="small"
                                  onClick={() => {
                                    setCategoryIdForEdit(row._id);
                                    setDrawerEditCategory(true);
                                  }}
                                />
                              )}
                              {/* <DeleteOutlineOutlinedIcon fontSize='small' /> */}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {!data.length > 0 && (
                    <TableCell colSpan={6}>
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
                          Brands Not Found...
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
              count={countCategory}
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

{
  /* <CustomModel modalWidth='50%'  open={openaddcategory}  data={<Addcategory handleonclosecategory={closeaddcategory} />} />
  <CustomModel modalWidth='auto' data={<EditCategoryModal handleonclose={closeeditmodal}/>} open={openeditmodal} /> */
}

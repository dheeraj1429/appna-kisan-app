import emailjs from "@emailjs/browser";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DateRangeIcon from "@mui/icons-material/DateRange";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import {
  Button,
  Container,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
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
import { addDays } from "date-fns";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import SideDrawer from "src/global/Drawer";
import noImage from "../../../assests/No_image.svg";
import searchNotFound from "../../../assests/searchnotfound.gif";
import Iconify from "../../../components/Iconify";
import LoadingSpinner from "../../../components/Spinner";
import CustomizedSnackbars from "../../../global/Snackbar/CustomSnackbar";
import { convertDateForOrder } from "../../../global/globalFunctions";
import palette from "../../../theme/palette";
import InvoicePreview from "./InvoicePreview";

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
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis?.map((el) => el[0]);
}

const headCells = [
  {
    id: "product",
    numeric: false,
    disablePadding: true,
    label: "Product",
  },
  {
    id: "Product Code",
    numeric: true,
    disablePadding: false,
    label: "Product Code",
  },
  {
    id: "Quantity",
    numeric: true,
    disablePadding: false,
    label: "Quantity",
  },
  // {
  //   id: 'price',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Price',
  // },
  {
    id: "cartoon",
    numeric: true,
    disablePadding: false,
    label: "Quantity By",
  },
  {
    id: "Option",
    numeric: true,
    disablePadding: false,
    label: "update order price",
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "Status",
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
  const { numSelected, handleChangeProductDelivery } = props;
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
          {`All Ordered Products (${props.orderCount})`}
        </Typography>
      )}

      <Tooltip title="Filter list">
        <>
          {numSelected > 0 && (
            <>
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
                    sx: { width: 230, maxWidth: "100%" },
                  }}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem
                    onClick={() => handleChangeProductDelivery(true)}
                    sx={{ color: "text.secondary" }}
                  >
                    <ListItemIcon>
                      <Iconify icon="mdi:truck-check" width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Marked as Shipped"
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleChangeProductDelivery(false)}
                    sx={{ color: "text.secondary" }}
                  >
                    <ListItemIcon>
                      <Iconify
                        icon="mdi:truck-remove-outline"
                        width={24}
                        height={24}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Un-Marked as Shipped"
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </MenuItem>
                </Menu>
              </IconButton>
            </>
          )}
        </>
      </Tooltip>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

function ViewOrder({ handleClose, orderId }) {
  const [render, setRender] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openConfimModal, setOpenConfimModal] = useState(false);
  const [userData, setUserData] = useState([]);
  const [message, setMessage] = useState({ type: "", message: "" });
  const [orderDetail, setOrderDetail] = useState({});
  const [orderStatus, setOrderStatus] = useState([]);
  const [updateBtn, setUpdateBtn] = useState(false);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [filterName, setFilterName] = useState("");
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [ordersCount, setOrdersCount] = useState(0);
  const [shippedProductsCount, setShippedProductsCount] = useState(0);
  const [allOrders, setAllOrders] = useState();
  const [filters, setFilters] = useState({
    by_status: "all",
    recentDays: "All",
  });
  const [age, setAge] = React.useState("");
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [drawerEditOrders, setDrawerEditOrders] = React.useState(false);
  const [downloadPdfLoading, setDownloadPdfLoading] = React.useState(true);
  const [stateDate, setStateDate] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      startDate: "",
      endDate: "",
      key: "selection",
    },
  ]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  console.log("shippedProductsCount = = =>", shippedProductsCount);
  // console.log("selected = = =>",selected)
  // console.log("orderId",orderId)
  // console.log("USER DATA",orderDetail)

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: orderDetail?.customer_name,
  });

  //##################### GET ORDER BY ID #####################
  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/get/order/by/id/${orderId}`,
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        setOrderDetail(res?.data?.result);
        setOrderStatus(res?.data?.order_status);
        setOrdersCount(res?.data?.result?.products?.length);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [render]);
  //##################### GET ORDER BY ID #####################

  //##################### Handle order status change #####################
  const handleOrderStatusChange = (e) => {
    setOrderDetail((prev) => ({ ...prev, order_status: e.target.value }));
    setUpdateBtn(true);
  };

  const sendEmailWhenOrderPartialShipped = (emailOrderDetail) => {
    console.log("emailOrderDetail", emailOrderDetail);

    emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          order_id: emailOrderDetail.order_id,
          shipped_product_count: shippedProductsCount,
          name: emailOrderDetail.customer_name,
          email: emailOrderDetail.customer_email,
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        (result) => {
          console.log(result.text);
          console.log("EMAIL SENT++++++ ");
        },
        (error) => {
          console.log(error.text);
          console.log("EMAIL SENT++++++ ERROR ");
        }
      );
  };

  //##################### Handle submit  #####################

  const handleSubmit = async (e) => {
    if (
      shippedProductsCount > 0 &&
      orderDetail?.order_status === "partial shipped"
    ) {
      sendEmailWhenOrderPartialShipped(orderDetail);
    }
    await axios
      .patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/change/order/status/${orderId}`,
        { ...orderDetail },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        if (res?.data?.status === true) {
          setMessage((prev) => ({
            ...prev,
            type: "success",
            message: "Order Status Updated Successfully !!",
          }));
          setSnackbarOpen(true);
          setRender((prev) => !prev);
        } else {
          setMessage((prev) => ({
            ...prev,
            type: "error",
            message: "Unexcepted Error Occur !!",
          }));
          setSnackbarOpen(true);
          setRender((prev) => !prev);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //##################### Handle submit  #####################

  // ##################### SNACK BAR FUNCTIONs ##################
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };
  // ##################### SNACK BAR FUNCTIONs ##################

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = orderDetail?.products?.map((n) => n?._id);
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

  // DECREASE QUANTITY FUNCTION
  const decreaseQuantity = async (product_id) => {
    let updateProduct = orderDetail?.products;
    orderDetail?.products?.map((value, index) => {
      if (value._id == product_id) {
        if (value.product_quantity > 0) {
          // console.log("FIND>>>>")
          updateProduct[index] = {
            ...value,
            product_quantity: value.product_quantity - 1,
          };
          setOrderDetail((prev) => ({ ...prev, products: updateProduct }));
          console.log(updateProduct, "updated products quantity");
          setUpdateBtn(true);
        }
      }
    });
    return;
  };

  // INCREASE QUANTITY FUNCTION
  const increaseQuantity = async (product_id) => {
    let updateProduct = orderDetail?.products;
    orderDetail?.products?.map((value, index) => {
      if (value._id == product_id) {
        // console.log("FIND>>>>")
        updateProduct[index] = {
          ...value,
          product_quantity: value.product_quantity + 1,
        };
        setOrderDetail((prev) => ({ ...prev, products: updateProduct }));
        console.log(updateProduct, "updated products quantity");
        setUpdateBtn(true);
      }
    });
  };

  // handle transportion field
  const handleChangeProductPrice = async (product_id, e) => {
    let updateProductPrice = orderDetail?.products;
    orderDetail?.products?.map((value, index) => {
      if (value._id == product_id) {
        // console.log("FIND>>>>")
        updateProductPrice[index] = { ...value, product_price: e.target.value };
        setOrderDetail((prev) => ({ ...prev, products: updateProductPrice }));
        console.log(updateProductPrice, "updated products price");
        setUpdateBtn(true);
      }
    });
  };

  // handle transportion field
  const handleTransportDetails = async (e) => {
    setOrderDetail((prev) => ({
      ...prev,
      ordered_products_transport_detail: e.target.value,
    }));
    setUpdateBtn(true);
  };

  // handle change product delivery status
  const handleChangeProductDeliveryStatus = async (productStatus) => {
    console.log("FUNC RUNS");
    // for sending email to shipped products
    if (productStatus === true) {
      console.log("RUNS SHIPPED ");
      orderDetail?.products?.map((product) => {
        if (product?.product_delivery_status === true) {
          console.log("ALREADY TRUE");
          return;
        } else {
          console.log("SHIPPED-----");
          setShippedProductsCount(selected?.length);
        }
      });
    }
    // for sending email to shipped products
    let updateProductStatus = orderDetail?.products;
    orderDetail?.products?.map((value, index) => {
      console.log("FUNC RUNS 2");
      selected?.map((product_id) => {
        console.log(
          "FUNC RUNS 3",
          product_id,
          " ==== ",
          productStatus,
          "-----",
          value
        );
        if (value._id == product_id) {
          console.log("FIND TRUE");
          // console.log("FIND>>>>")
          updateProductStatus[index] = {
            ...value,
            product_delivery_status: productStatus,
          };
          setOrderDetail((prev) => ({
            ...prev,
            products: updateProductStatus,
          }));
          console.log(updateProductStatus, "updated products Status");
          setUpdateBtn(true);
        }
      });
    });
  };

  // ======== INVOICE ===========
  const downloadInvoice = () => {
    setInvoiceLoading(true);
    let products = [];
    for (let i = 0; i < orderDetail?.products?.length; i++) {
      products[i] = {
        quantity: orderDetail?.products[i]?.product_quantity,
        description: `${orderDetail?.products[
          i
        ]?.product_code?.toUpperCase()} | ${orderDetail?.products[
          i
        ]?.product_name?.toUpperCase()} | QTY-BY : ${orderDetail?.products[
          i
        ]?.product_quantity_by?.toUpperCase()} `,
        "tax-rate": 0,
        price: 0,
      };
    }

    let data = {
      images: {
        // "background": "https://public.easyinvoice.cloud/pdf/sample-background.pdf",
        logo: "https://firebasestorage.googleapis.com/v0/b/ssa-app-7f8ea.appspot.com/o/ssa_logo.3758b4a24cc9716699dc%20(1).png?alt=media&token=5bffa68b-bd52-425a-bddc-a9cd414b696f",
      },
      sender: {
        company: "SUPREME SALES AGENCY",
        address: "33/1, Netaji Subhas Road, Room No. 323,3rd Floor",
        zip: "700040",
        city: "Kolkata",
        country: "India",
      },
      client: {
        company: `${
          orderDetail?.order_id
        } <br/> ${orderDetail?.customer_name?.toUpperCase()} `,
        address: orderDetail?.shipping_address,
        zip: orderDetail?.pincode,
        city: orderDetail?.state,
        country: `<b>E-mail:</b> ${orderDetail?.customer_email}`,
      },
      information: {
        number: `${orderDetail?.customer_phone_number}`,
        date: convertDateForOrder(orderDetail?.createdAt)?.split(",")[0],
        "due-date": "---",
      },
      products: products,
      // "products": [
      //   {
      //     "quantity": "2",
      //     "description": "Test1",
      //     "tax-rate": 6,
      //     "price": 33.87
      //   },
      //   {
      //     "quantity": "4",
      //     "description": "Test2",
      //     "tax-rate": 21,
      //     "price": 10.45
      //   }
      // ],
      "bottom-notice": "Have a Nice Day,Thankyou For Shopping With Us.",
      settings: {
        currency: "INR",
        "tax-notation": "Taxes",
        "margin-top": 50,
        "margin-right": 50,
        "margin-left": 50,
        "margin-bottom": 25,
      },
      translate: {
        number: "Phone-Number",
      },
    };

    //Create your invoice! Easy!

    window.easyinvoice.createInvoice(data, function (result) {
      //The response will contain a base64 encoded PDF file
      window.easyinvoice.download(
        `${orderDetail?.customer_name}_invoice.pdf`,
        result.pdf
      );
      setInvoiceLoading(false);
      // console.log('PDF base64 string: ', result.pdf);
    });
  };

  // ======== INVOICE ===========

  console.log("order------>>>>", orderDetail);

  //############################# INVOICE PREVIEW SIDE BAR DRAWER FUNCTION #############################
  const handleOpenEditOrderSidebar = () => {
    setDrawerEditOrders(true);
  };

  const handleCloseEditOrderSideBar = () => {
    setDrawerEditOrders(false);
    setRender((prev) => !prev);
  };
  //############################# INVOICE PREVIEW SIDE BAR DRAWER FUNCTION #############################

  const updateOrderPrice = async function (data) {
    if (!data?.order_price) {
      setSnackbarOpen(true);
      setMessage((prev) => ({
        ...prev,
        type: "error",
        message: "Please provide a valid order price",
      }));
      return;
    }
    setLoading(true);
    axios
      .patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/update/order/amount`,
        data
      )
      .then((res) => {
        console.log(res);
        setSnackbarOpen(true);
        setLoading(false);
        setMessage((prev) => ({
          ...prev,
          type: "success",
          message: "Order price Updated Successfully !!",
        }));
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setSnackbarOpen(true);
        setMessage((prev) => ({
          ...prev,
          type: "error",
          message: "Something went wrong updating order price",
        }));
      });
  };

  return (
    <>
      <div ref={componentRef}>
        <LoadingSpinner loading={loading} />
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
        <Container maxWidth="xl">
          <div className="add-category-pad-top-bot flex-justify-between ">
            <div>
              <h2>Order Details</h2>
              <p> View your order and change necessary information from here</p>
            </div>
            <div>
              {/*################ INVOICE PREVIEW SIDEBAR  ################*/}
              <SideDrawer
                state={drawerEditOrders}
                toggleDrawerClose={handleCloseEditOrderSideBar}
                toggleDrawerOpen={handleOpenEditOrderSidebar}
                ComponentData={
                  <InvoicePreview
                    orderDetail={orderDetail}
                    handleClose={handleCloseEditOrderSideBar}
                  />
                }
                ComponentButton={
                  <Button
                    className="product-btn"
                    variant="contained"
                    startIcon={<Iconify icon="basil:invoice-solid" />}
                  >
                    View Export
                  </Button>
                }
              />
              {/*################ INVOICE PREVIEW SIDEBAR  ################*/}

              {/* <LoadingButton
         onClick={downloadInvoice}
         loading={invoiceLoading}
         loadingPosition="start"
         startIcon={<Iconify icon="basil:invoice-solid" />}
         variant="contained"
         style={{marginRight:10}}
       >
         <span>Export Invoice </span>
       </LoadingButton>
               
        <CsvDownloadButton className='download-table-xls-button'  data={[orderDetail]} filename="orders" > 
                <Button className='hide-mobile' variant="outlined"  startIcon={<Iconify icon="akar-icons:download" />}> 
                Export Csv
                    </Button>
                </CsvDownloadButton> */}
            </div>
          </div>
          <div>
            <div className="order-details-main">
              <div className="flex-justify-between">
                <div>
                  <h4 className="flex">
                    {" "}
                    <DateRangeIcon /> "{" "}
                    {convertDateForOrder(orderDetail?.createdAt)}
                  </h4>
                  <p style={{ fontSize: 13, color: "gray", paddingLeft: 23 }}>
                    {" "}
                    #{orderDetail?.order_id}
                  </p>
                </div>
                <div>
                  <div className="flex">
                    <h4>Total order price</h4>
                    <p style={{ marginLeft: "1rem", fontSize: 12 }}>
                      Rs {orderDetail?.total_amount}
                    </p>
                  </div>
                  <div className="flex">
                    <h4>Billing price</h4>
                    <p style={{ marginLeft: "1rem", fontSize: 12 }}>
                      Rs {orderDetail?.totalPrice}
                    </p>
                  </div>
                </div>
                <div className="flex" style={{ gap: 15 }}>
                  {/* {orderDetail?.order_status} */}

                  {/* <label htmlFor=""> Select Category  </label> */}
                  <div className="flex">
                    <TextField
                      style={{
                        textTransform: "capitalize",
                        width: 240,
                        paddingRight: 10,
                      }}
                      labelId="demo-select-small"
                      id="demo-select-small"
                      className="select_field"
                      name="order_status"
                      value={`${orderDetail?.order_status}`}
                      onChange={(e) => handleOrderStatusChange(e)}
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
                      {orderStatus?.map((order, index) => (
                        <MenuItem
                          style={{ textTransform: "capitalize" }}
                          key={order?.name}
                          value={order?.name}
                        >
                          {order?.name}
                        </MenuItem>
                      ))}
                    </TextField>

                    <Button
                      disabled={updateBtn ? false : true}
                      sx={{ mx: 0, height: 54, px: 5 }}
                      variant="contained"
                      onClick={handleSubmit}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </div>
              <div style={{ padding: "30px 0px 20px 0px" }}>
                <Divider />
              </div>
              <div className="order-detail-table-container">
                <div>
                  <div className="customer-order-detail">
                    <div
                      style={{ display: "flex", justifyContent: "flex-start" }}
                    >
                      <AccountCircleIcon
                        style={{ color: palette.primary.main }}
                        fontSize="large"
                      />
                      <div style={{ paddingLeft: 8, paddingTop: 4 }}>
                        <h4>Customer</h4>
                        <div
                          style={{
                            fontSize: 14,
                            color: "gray",
                            overflow: "scroll",
                          }}
                        >
                          {/* <p style={{fontSize:12}} >#{orderDetail?.customer_id}</p> */}
                          <p>{orderDetail?.customer_name}</p>
                          <p>{orderDetail?.customer_email}</p>
                          <p>{orderDetail?.customer_phone_number}</p>
                          {/* <p>Transport Detail :  {orderDetail?.transport_detail}</p> */}
                          <p>Address : {orderDetail?.shipping_address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* TRANSPORTAION DETAILS */}
                  <div
                    className="customer-order-detail"
                    style={{ marginTop: 20 }}
                  >
                    <div
                      style={{ display: "flex", justifyContent: "flex-start" }}
                    >
                      <div
                        style={{ width: "100%" }}
                        className="add_product_label_input"
                      >
                        <label htmlFor="">Transport Details </label>
                        <TextField
                          style={{ paddingTop: 6 }}
                          multiline
                          rows={3}
                          fullWidth
                          className="product_form_input"
                          id="outlined-basic"
                          name="transport_detail"
                          placeholder="Enter Transport Details"
                          value={orderDetail?.ordered_products_transport_detail}
                          onChange={(e) => handleTransportDetails(e)}
                          variant="outlined"
                        />
                      </div>
                    </div>
                  </div>
                  {/* TRANSPORTAION DETAILS */}
                </div>
                <div
                  className="customer-order-detail"
                  style={{ width: "100%" }}
                >
                  <EnhancedTableToolbar
                    orderCount={ordersCount}
                    numSelected={selected.length}
                    handleChangeProductDelivery={
                      handleChangeProductDeliveryStatus
                    }
                  />
                  <TableContainer>
                    <Table
                      sx={{
                        minWidth: 800,
                        overflow: "scroll",
                      }}
                      aria-labelledby="tableTitle"
                      size={dense ? "small" : "medium"}
                    >
                      <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={orderDetail?.products?.length}
                      />
                      <TableBody>
                        {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
                        {stableSort(
                          orderDetail?.products,
                          getComparator(order, orderBy)
                        )
                          ?.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          ?.map((row, index) => {
                            const isItemSelected = isSelected(row?._id);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                              <TableRow
                                hover
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={row?._id}
                                selected={isItemSelected}
                              >
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    color="primary"
                                    checked={isItemSelected}
                                    onClick={(event) =>
                                      handleClick(event, row._id)
                                    }
                                    inputProps={{
                                      "aria-labelledby": labelId,
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  component="th"
                                  id={labelId}
                                  scope="row"
                                  padding="2"
                                  style={{
                                    textTransform: "capitalize",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                  }}
                                >
                                  <img
                                    className="product-table-image"
                                    alt="product"
                                    src={
                                      row?.product_images[0]?.image_url
                                        ? `${row?.product_images[0]?.image_url}`
                                        : noImage
                                    }
                                  />
                                  {row?.product_name}
                                </TableCell>
                                <TableCell align="center">
                                  {row.product_code}
                                </TableCell>
                                {/* <TableCell align="right">{row.fat}</TableCell> */}
                                <TableCell align="center">
                                  <Button
                                    variant="outline"
                                    sx={{ px: 2, mr: 2 }}
                                    onClick={() => decreaseQuantity(row?._id)}
                                  >
                                    <Iconify icon="ic:round-minus" />
                                  </Button>
                                  {row?.product_quantity}
                                  <Button
                                    variant="outline"
                                    sx={{ px: 2, ml: 2 }}
                                    onClick={() => increaseQuantity(row?._id)}
                                  >
                                    <Iconify icon="eva:plus-fill" />
                                  </Button>
                                </TableCell>
                                {/* <TableCell align="center"   >
                      <TextField 
                     className='product_form_input' id="outlined-basic" style={{width:'90px'}}
                     onChange={(e)=>handleChangeProductPrice(row?._id,e)}
                     value={row?.product_price}
                      name="transport_detail"  size='small' placeholder="(₹)Price"
                      variant="outlined" />
                      </TableCell> */}
                                <TableCell align="center">
                                  {/* <p className={row.order_status === "cartoon" ? "order_delivered" : row.order_status === "cancelled"? "order_cancel":row.order_status === "shipped" ?"order_processing": row.order_status === "pending"? "order_pending" : "normal"  } > */}
                                  <p
                                    className={
                                      row?.product_quantity_by == "cartoon"
                                        ? "order_delivered"
                                        : row?.product_quantity_by == "piece"
                                        ? "order_pending"
                                        : ""
                                    }
                                  >
                                    {row?.product_quantity_by}
                                  </p>
                                </TableCell>
                                <TableCell>
                                  {orderDetail?.user_type === "B2BUsers" ? (
                                    <div>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            "& > :not(style)": {
                                              m: 1,
                                              width: 170,
                                            },
                                          }}
                                          autoComplete="off"
                                        >
                                          <TextField
                                            size="small"
                                            label="Order price"
                                            variant="outlined"
                                            type="number"
                                            defaultValue={row?.product_price}
                                            onChange={(event) => {
                                              orderDetail.order_price =
                                                event.target.value;
                                            }}
                                            inputProps={{
                                              min: 0,
                                              step: 0.01,
                                            }}
                                          />
                                        </Box>
                                        <Button
                                          size="small"
                                          variant="contained"
                                          onClick={() =>
                                            updateOrderPrice({
                                              _id: orderDetail?._id,
                                              customer_id:
                                                orderDetail?.customer_id,
                                              order_id: orderDetail?.order_id,
                                              order_price:
                                                +orderDetail?.order_price,
                                              productId: row?._id,
                                            })
                                          }
                                        >
                                          Update
                                        </Button>
                                      </div>
                                    </div>
                                  ) : null}
                                </TableCell>
                                {row?.product_delivery_status ? (
                                  <TableCell
                                    align="center"
                                    sx={{
                                      fontSize: 26,
                                      color: palette.primary.main,
                                    }}
                                  >
                                    {" "}
                                    <Iconify icon="mdi:truck-check" />{" "}
                                  </TableCell>
                                ) : (
                                  <TableCell
                                    align="center"
                                    sx={{ fontSize: 26, color: "#e8e6e6" }}
                                  >
                                    {" "}
                                    <Iconify icon="mdi:truck-check" />{" "}
                                  </TableCell>
                                )}
                              </TableRow>
                            );
                          })}
                        {!orderDetail?.products?.length > 0 && (
                          <TableCell colSpan={9}>
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
                                Products Not Found !!
                              </Typography>
                            </div>{" "}
                          </TableCell>
                        )}
                        {/* {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
                      </TableBody>
                    </Table>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={orderDetail?.products?.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableContainer>
                </div>
              </div>
            </div>
            <div style={{ paddingBottom: 70 }}></div>
          </div>
        </Container>
      </div>
    </>
  );
}

export default ViewOrder;

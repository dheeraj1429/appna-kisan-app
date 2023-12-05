import * as React from 'react';
import { useState,useRef } from 'react';

import { Toolbar, Tooltip,Menu, MenuItem,TextField,InputLabel,Select,FormControl, IconButton, Typography,Button,ListItemIcon, ListItemText, OutlinedInput, InputAdornment } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { Link } from 'react-router-dom';
import VendorListToolbar from '../sections/@dashboard/vendor/VendorListToolbar';
import Iconify from '../components/Iconify';
import CloseIcon from '@mui/icons-material/Close';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
import palette from '../theme/palette';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import { convertDate ,getGapBetweenDates} from '../global/globalFunctions';
import { useEffect } from 'react';
import axios from 'axios';
import searchNotFound from "../assests/searchnotfound.gif"


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
  createData('Cupcake', 305, 3.7, "pending", 4.3,),
  createData('Donut', 452, 25.0, "verified", 4.9,),
  createData('Eclair', 262, 16.0, "pending", 6.0,),
  createData('Frozen yoghurt', 159, 6.0, "verified", 4.0,),
  createData('Gingerbread', 356, 16.0, "not verified", 3.9,),
  createData('Honeycomb', 408, 3.2, "not verified", 6.5,),
  createData('Ice cream sandwich', 237, 9.0, "not verified", 4.3,),
  createData('Jelly Bean', 375, 0.0, "pending", 0.0,),
  createData('KitKat', 518, 26.0, "verified", 7.0,),
  createData('Lollipop', 392, 0.2, "not verified", 0.0,),
  createData('Marshmallow', 318, 0, "verified", 2.0,),
  createData('Nougat', 360, 19.0, "not verified", 37.0,),
  createData('Oreo', 437, 18.0, "not verified", 4.0,),
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
  return order === 'desc'
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
    id: 'shop_name',
    numeric: false,
    disablePadding: true,
    label: 'Shop Name',
  },
  // {
  //   id: 'shop_id',
  //   numeric: false,
  //   disablePadding: true,
  //   label: 'Shop ID',
  // },

  {
    id: 'vendor_name',
    numeric: false,
    disablePadding: true,
    label: 'Vendor Name',
  },

  {
    id: 'joining_date',
    numeric: true,
    disablePadding: false,
    label: 'Joining date ',
  },
  // {
  //   id: 'shop_contact',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Shop Contact',
  // },

  // {
  //   id: 'total_products',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Total Products',
  // },
  
  // {
  //   id: 'delivery_method',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Delivery Method ',
  // },
 
  {
    id: 'shop_type',
    numeric: true,
    disablePadding: false,
    label: 'Shop Type ',
  },
  {
    id: 'shop_plan',
    numeric: true,
    disablePadding: false,
    label: 'Shop Plan',
  },
  {
    id: 'shop_status',
    numeric: true,
    disablePadding: false,
    label: 'Shop Status',
  },
  {
    id: 'action',
    numeric: true,
    disablePadding: false,
    label: 'Action',
  },

];

function EnhancedTableHead(props) {
  const { onSelectAllClick,order, orderBy, numSelected, rowCount, onRequestSort , countVendor } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead >
      <TableRow  >
      <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'center' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'none'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{textTransform:"uppercase"}}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
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
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected,countVendor} = props;
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  

  return (
    <Toolbar
    sx={{
      pl: { sm: 2 },
      pr: { xs: 1, sm: 1 },
      ...(numSelected > 0 && {
        bgcolor: (theme) =>
          alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
      }),
    }}
  >


{numSelected > 0 ? (
      <Typography
        sx={{ flex: '1 1 100%' }}
        color="inherit"
        variant="subtitle1"
        component="div"
      >
        {numSelected} selected
      </Typography>
    ) : 
      (<Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {`All Vendors(${countVendor})`}
      </Typography>
    )
      } 

      <Tooltip title="Filter list">
          <>
      
        {numSelected > 0 && (
      <Tooltip title="More">
        <IconButton>
       


      
          <MoreVertOutlinedIcon style={{cursor:"pointer"}} ref={ref} onClick={() => setIsOpen(true)} fontSize='medium' />
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

     
    </Menu>

        </IconButton>
      </Tooltip>
    ) }
  </>

      </Tooltip>
    
  </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [filterName, setFilterName] = useState('');
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const ref = useRef(null);
  const ref2 = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [age, setAge] = React.useState('');
  const [ data, setData ] = useState([])
  const [ countVendor, setCountVendor ] = useState(0)
  const [ shopType , setShopType ] = useState([])
  const [ shopPlan , setShopPlan ] = useState([])
  const [ deliveryMethod , setDeliveryMethod ] =useState([])
  const [ vendorStatus , setVendorStatus ] =useState([])
  const [render , setRender ] = useState(false)
  const [filters , setFilters ] = useState({by_status:'all',recentDays:'All',by_shoptype:'all',by_shopplan:'all',by_delivery_method:'all'})
  const [search , setSearch ] = useState('')
  
  const [stateDate, setStateDate] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      startDate: '',
      endDate: '',
      key: 'selection'
    }
  ]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  console.log("all vendors===",data)
  console.log("all vendors===",countVendor)

  // ================== GET ALL VENDORS ==============
  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/vendors/get/allvendor`,{withCredentials:true})
    .then(res=>{
      console.log(res)
      setData(res?.data?.alluser)
      setCountVendor(res?.data?.countVendor)
      setShopType(res?.data?.getAllShopTypes)
      setShopPlan(res?.data?.getAllShopPlan)
      setDeliveryMethod(res?.data?.getAlldeliveryMethod)
      setVendorStatus(res?.data?.getAllVendorStatus)
    })
    .catch(err=>{
      console.log(err)
    })
  },[render])
  // ================== GET ALL VENDORS ==============

  
  //================ GET FILTERED VENDORS ==================
  useEffect(()=>{
    if(filters.by_status === 'all' && filters.recentDays ==='All' && filters.by_shoptype === 'all' && filters?.by_shopplan=== 'all' && filters?.by_delivery_method==='all'){
      setRender(prev=>!prev)
      return
    }
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/filter/for/vendors?by_status=${filters?.by_status}&date_from=${stateDate[0]?.startDate}&date_to=${stateDate[0]?.endDate}&by_shoptype=${filters?.by_shoptype}&by_shopplan=${filters?.by_shopplan}&by_delivery_method=${filters?.by_delivery_method}`,{withCredentials:true})
    .then(res=>{
      console.log("FILTER VENDORS",res)
      setData(res?.data)
      setCountVendor(res?.data?.length)
    })
    .catch(err=>{
      console.log(err)
    })
  },[filters?.by_status,stateDate,filters?.recentDays,filters?.by_shoptype,filters?.by_shopplan,filters?.by_delivery_method ])
  //================ GET FILTERED VENDORS ==================

//=================== HANDLE RECENT VENDORS FUNCTION ==========================
const handleRecentVendors = (value)=>{
  console.log("+++++value=========",value)
   let date = new Date().toJSON().slice(0, 10);
  // console.log(date); // "2022-06-17"
  const currentDate = new Date().toDateString()
  // console.log("current Date",currentDate.length)
  const getCompareValue = `${value?.startDate}`
  // console.log("getCompareValue",getCompareValue?.slice(0,15)?.length)

  // FOR SETTING TODAY IN DATE FILTER
  if(getCompareValue?.slice(0,15) == `${currentDate}` ){
    // console.log("ENTERED")
    setFilters((prev)=>({...prev,recentDays:"Today"}))
    return;
  }
  const startDateGap = getGapBetweenDates(value?.endDate,value?.startDate)
  console.log("getGapBetweenDates",startDateGap)
  // FOR SETTING YESTERDAY IN DATE FILTER
  if(startDateGap == 1){
    setFilters((prev)=>({...prev,recentDays:"Yesterday"}))
    return;
  }
  // FOR SETTING YESTERDAY IN DATE FILTER
  if(startDateGap == 7){
    setFilters((prev)=>({...prev,recentDays:"Week"}))
    return;
  }
  // FOR SETTING YESTERDAY IN DATE FILTER
  if(startDateGap == 30,31,29,28  ){
    setFilters((prev)=>({...prev,recentDays:"Month"}))
    // return;
  }
  if(startDateGap != 30,31,29,28,1,7  ){
    // console.log("ELSE")
    setFilters((prev)=>({...prev,recentDays:"Custom"}))
  }

  // if(filters.recentDays =='All'  ){
  //   setRender(prev=>!prev)
  //   return
  //  }

  console.log(value)
}
//=================== HANDLE RECENT VENDORS FUNCTION ==========================


  //============= HANDLE ON SEARCH =====================
  const handleSearch = async(e)=>{
    e.preventDefault();
    if(e.target.value === ''){
      setRender(prev=>!prev)
      return;
    }
   await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/search/in/vendors?search=${search}`,{withCredentials:true})
    .then(res=>{
      console.log(res)
      setData(res?.data)
      setCountVendor(res?.data?.length)
    })
    .catch(err=>{
      console.log(err)
    })
  }
  // ============== HANDLE ON SEARCH =======================
console.log("FILTERS-====>>>",filters)


  // =============== HANDLE FILTER BY STATUS -==============
  const handleOnStatusChange = async(e)=>{
    if(e.target.value === 'all'){
      setFilters((prev)=>({...prev,by_status:e.target.value}))
      setRender(prev=>!prev)
      return;
    }
    setFilters((prev)=>({...prev,by_status:e.target.value})) 
  }
  // =============== HANDLE FILTER BY STATUS -==============

  // ========================= HANDLE RESET FILTER ======================
  const handleResetFilter=()=>{
    setIsOpen2(false);
    setFilters({by_status:'all',recentDays:'All',by_shoptype:'all',by_shopplan:'all',by_delivery_method:'all'})
  }
  // ========================= HANDLE RESET FILTER ======================



  // open date menu
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  // handle close date menu
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  // HANDLE SHOPTYPE FILTER 
  const handleShopTypeChange=(e)=>{
    if(e.target.value === 'all' ){
      setFilters((prev)=>({...prev,by_shoptype:e.target.value}))
      setRender(prev=>!prev)
      return;
    }
    setFilters((prev)=>({...prev,by_shoptype:e.target.value}))
  }

  // HANDLE SHOP PLAN FILTER 
  const handleShopPlanChange=(e)=>{
    if(e.target.value === 'all' ){
      setFilters((prev)=>({...prev,by_shopplan:e.target.value}))
      setRender(prev=>!prev)
      return;
    }
    setFilters((prev)=>({...prev,by_shopplan:e.target.value}))
  }
  // HANDLE SHOP DELIVERY METHOD FILTER 
  const handleShopDeliveryMethodChange=(e)=>{
    if(e.target.value === 'all' ){
      setFilters((prev)=>({...prev,by_delivery_method:e.target.value}))
      setRender(prev=>!prev)
      return;
    }
    setFilters((prev)=>({...prev,by_delivery_method:e.target.value}))
  }
  

  const handleChange = (event) => {
    setAge(event.target.value);
  };
 
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
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
        selected.slice(selectedIndex + 1),
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

  // handle close more menu three dots 
  const handleChangeMoreMenu=() => setIsOpen2(false);

  // handle Close more menu text btn
  const handleChangeMoreMenuText=() => setIsOpen(false)
  

  return (
    <div className='custom-conatiner'>
    <Box sx={{ width: '100%' }}>

    <Paper elevation={3} sx={{ width: '100%', mb: 2, borderRadius:1 }}>
   <div className='flex-justify-between vendor-topbar-box ' >
   <h3 className='' >Vendors</h3>
  <div className='vendor-topbar-btn' >
  <Button className='hide-mobile' variant="outlined"  startIcon={<Iconify icon="akar-icons:download" />}> 
     Export
         </Button>
    <Button variant="contained" component={Link} to="/dashboard/products/add_product/12345" startIcon={<Iconify icon="eva:plus-fill" />}> 
     Add Vendor
         </Button>
  </div>
   </div>
   <div className='flex order-top-bar ' >
   <form onSubmit={handleSearch} className='vendor-search-bar-box'  >
   <TextField id="outlined-basic" type="search" fullWidth value={search} onChange={(e)=>setSearch(e.target.value)}  label="Search" placeholder='Search Anything...' variant="outlined"  InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlinedIcon />
            </InputAdornment>
          ),
        }} />
   <Button className='search-btn' sx={{mx:2,height:54,px:5}} variant="contained" type='submit' >
        Search
      </Button>
   </form>
   <div className="order-toolbar-selectbox-1 hide-mobile" >
   <FormControl fullWidth  >
                      {/* <InputLabel id="demo-select-small"  >Filter By Status</InputLabel> */}
      <TextField
        labelId="demo-select-small"
        id="demo-select-small"
        value={filters?.by_status}
        label="Filter By Status"
        style={{textTransform:'capitalize'}}
        select
        onChange={handleOnStatusChange}
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
        
        <MenuItem value={"all"}>All</MenuItem>
        {vendorStatus?.map(value=>(
          <MenuItem style={{textTransform:'capitalize'}} key={value?._id} value={value?.name}>{value?.name}</MenuItem>
        ))}
        {/* <MenuItem value={"notverified"}>Not Verified</MenuItem>
        <MenuItem value={"pending"}>Pending</MenuItem> */}
      </TextField>
      </FormControl>
   </div>
 
     <div className="order-toolbar-selectbox-2 hide-mobile" >
     <FormControl fullWidth  >
<TextField
        id="basic-button"
        InputProps={{      
          startAdornment: (
            <InputAdornment position="start">
               <CalendarMonthIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
               <ArrowDropDownIcon />
            </InputAdornment>
          ),
          readOnly: true,
        }}
        label="Recent Vendors"
        aria-readonly={true}
        value={filters?.recentDays}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClickMenu}
        
      />
      
      {/* </TextField> */}
          <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
         PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
           
          },
        }}
      >
        <div className='date-filter-box' >
        <DateRangePicker
 
 onChange={item => {setStateDate([item.selection])
  handleRecentVendors(item.selection)

  }}
 showSelectionPreview={false}
 showPreview={false}
 moveRangeOnFirstSelection={false}
 months={1}
 
 ranges={stateDate}
 direction="vertical"
/>
<div className='date-filter-reset-btn' >

<Button onClick={()=>{setFilters((prev)=>({...prev,recentDays:'All'}))
                                                              setStateDate([ {
                                                                
                                                                startDate: '',
                                                                endDate: '',
                                                                key: 'selection'
                                                              }])
                                                            }}  variant="contained" > Reset</Button>
                                                            </div>
        </div>
{/* <MenuItem value={'today'}> </MenuItem> */}


      </Menu>
      </FormControl>
     </div>
     <div className="order-toolbar-selectbox-2 hide-mobile " >
   <FormControl fullWidth  >
                    

        <TextField
        labelId="demo-select-small"
        id="demo-select-small"
        value={filters?.by_shoptype}
        label="Filter By Shop Type"
   
        select
        onChange={handleShopTypeChange}
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
          <MenuItem value='all'>All </MenuItem>
        {shopType?.map((value,index)=>(
          <MenuItem key={index} value={value._id}  > <p style={{textTransform:'capitalize'}} >{value._id}</p></MenuItem>

        ))}
        {/* <MenuItem value={20}>Cosmetic</MenuItem> */}
      </TextField>

      </FormControl>
   </div>
     {/*============== DESKTOP MORE ICONS=============== */}
     <div className='more-icon-btn' >
    <Tooltip title="Filter list">
            <>
       <MoreVertOutlinedIcon style={{cursor:"pointer"}} ref={ref2} onClick={() => setIsOpen2(true)} fontSize='medium' />
       {/* <CustomMoreMenu isOpen={isOpen2} openReference={ref2.current} handleCloseMoreMenu={handleChangeMoreMenu} handleChangeMoreMenu={handleChange}  /> */}

       <Menu
        open={isOpen2}
        anchorEl={ref2.current}
        onClose={() => setIsOpen2(false)}
        PaperProps={{
          sx: { width: 300, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {/* <MenuItem sx={{ color: 'text.secondary' }}> */}
   
        {/* </MenuItem> */}
        {/* <MenuItem component={Link} to="#" sx={{ color: 'text.secondary' }}> */}
        <div className="filter-toolbar-selectbox-1 " >
   <FormControl fullWidth  >
   <TextField
        labelId="demo-select-small"
        id="demo-select-small"
        value={filters?.by_shopplan}
        label="Filter By Shop Plan"
   
        select
        onChange={handleShopPlanChange}
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
         <MenuItem value='all'>All </MenuItem>
         {shopPlan?.map((value,index)=>(
           <MenuItem key={index} value={value?._id}> <p style={{textTransform:'capitalize'}} >{value?._id}</p></MenuItem>

         ))}
      
      </TextField>
      </FormControl>
   </div>


   {/* </MenuItem> */}
   {/* <MenuItem component={Link} to="#" sx={{ color: 'text.secondary' }}> */}
        <div className="filter-toolbar-selectbox-1 " >
   <FormControl fullWidth  >
                      

                      <TextField
        labelId="demo-select-small"
        id="demo-select-small"
        value={filters?.by_delivery_method}
        label="Delivery Method "
   
        select
        onChange={handleShopDeliveryMethodChange}
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
        <MenuItem value='all'> All </MenuItem>
        {deliveryMethod?.map((value,index)=>(
          <MenuItem key={index} value={value?._id}><p style={{textTransform:'capitalize'}} >{value?._id}</p> </MenuItem>

        ))}
 
      </TextField>

      </FormControl>
   </div>
 
   {/* </MenuItem> */}
   {/* <MenuItem component={Link} to="#" sx={{ color: 'text.secondary' }}> */}
 <div className="filter-toolbar-selectbox-button  " >
  <Button  onClick={handleResetFilter} fullWidth variant="contained" startIcon={<Iconify icon="carbon:update-now" />}> 
    Reset Filter
         </Button>
  </div>
         {/* </MenuItem> */}
         {/* <MenuItem component={Link} to="#" sx={{ color: 'text.secondary' }}> */}
        
        {/* <div className="filter-toolbar-selectbox-button  " >
<Button  onClick={()=>setIsOpen(false)} fullWidth variant="outlined" startIcon={<Iconify icon="eva:download-fill" />}> 
Download
     </Button>
</div> */}
    {/* </MenuItem> */}
      </Menu>
      </>

        </Tooltip>
       </div>
     {/*============== DESKTOP MORE ICONS=============== */}

     {/*============== MOBILE MORE ICONS=============== */}

     <div className='more-text-btn'  >
      <Tooltip title="Filter list">
            <>
      <p  style={{display:"flex",justifyContent:"end"}} ref={ref} onClick={() => setIsOpen(true)} >More Option <ExpandMoreIcon /></p>
      {/* <CustomMoreMenu isOpen={isOpen} openReference={ref.current} handleCloseMoreMenu={handleChangeMoreMenuText}   /> */}
      
      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 300, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >

<p className='close-menu-btn' style={{color:palette.primary.main}} onClick={()=>setIsOpen(false)} ><Iconify icon="ci:close-small" />  </p>

        {/* <MenuItem sx={{ color: 'text.secondary' }}> */}

        <div className="filter-toolbar-selectbox-1" >
        <FormControl fullWidth  >
                      {/* <InputLabel id="demo-select-small"  >Filter By Status</InputLabel> */}
      <TextField
        labelId="demo-select-small"
        id="demo-select-small"
        value={filters?.by_status}
        label="Filter By Status"

        select
        onChange={handleOnStatusChange}
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
        
        <MenuItem value={"all"}>All</MenuItem>
        <MenuItem value={"verified"}>Verified</MenuItem>
        <MenuItem value={"notverified"}>Not Verified</MenuItem>
        <MenuItem value={"pending"}>Pending</MenuItem>
      </TextField>
      </FormControl>
   </div>

   <div className="filter-toolbar-selectbox-1" >
   <FormControl fullWidth  >
     <TextField
        id="basic-button"
        InputProps={{      
          startAdornment: (
            <InputAdornment position="start">
               <CalendarMonthIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
               <ArrowDropDownIcon />
            </InputAdornment>
          ),
          readOnly: true,
        }}
        label="Recent Products"
        aria-readonly={true}
        value={filters?.recentDays}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClickMenu}
        
      />
      
      {/* </TextField> */}
          <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
         PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
           
          },
        }}
      >
        <div className='date-filter-box' >
        <DateRangePicker
 
 onChange={item => {setStateDate([item.selection])
  handleRecentVendors(item.selection)

  }}
 showSelectionPreview={false}
 showPreview={false}
 moveRangeOnFirstSelection={false}
 months={1}
 
 ranges={stateDate}
 direction="vertical"
/>
<div className='date-filter-reset-btn' >

<Button onClick={()=>{setFilters((prev)=>({...prev,recentDays:'All'}))
                                                              setStateDate([ {
                                                                
                                                                startDate: '',
                                                                endDate: '',
                                                                key: 'selection'
                                                              }]);handleClose();
                                                            }}  variant="outlined" > Reset</Button>
                                                            <div>
                                                            <Button onClick={handleClose}  variant="contained" > Apply</Button>
                                                            </div>
                                                            </div>
        </div>
{/* <MenuItem value={'today'}> </MenuItem> */}


      </Menu>
      </FormControl>
   </div>

        <div className="filter-toolbar-selectbox-1" >
   <FormControl fullWidth  >
                      {/* <InputLabel id="demo-select-small">Filter By Shop Type</InputLabel> */}
                      
                      <TextField
        labelId="demo-select-small"
        id="demo-select-small"
        value={filters?.by_shoptype}
        label="Filter By Shop Type"
   
        select
        onChange={handleShopTypeChange}
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
          <MenuItem value='all'>All </MenuItem>
        {shopType?.map((value,index)=>(
          <MenuItem key={index} value={value._id}  > <p style={{textTransform:'capitalize'}} >{value._id}</p></MenuItem>

        ))}
        {/* <MenuItem value={20}>Cosmetic</MenuItem> */}
      </TextField>
      </FormControl>
   </div>


   <div className="filter-toolbar-selectbox-1" >
   <FormControl fullWidth  >
                      {/* <InputLabel id="demo-select-small">Filter By Shop Type</InputLabel> */}
                      
                      <TextField
        labelId="demo-select-small"
        id="demo-select-small"
        value={filters?.by_shoptype}
        label="Filter By Shop Plan"
   
        select
        onChange={handleShopTypeChange}
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
          <MenuItem value='all'>All </MenuItem>
        {shopType?.map((value,index)=>(
          <MenuItem key={index} value={value._id}  > <p style={{textTransform:'capitalize'}} >{value._id}</p></MenuItem>

        ))}
        {/* <MenuItem value={20}>Cosmetic</MenuItem> */}
      </TextField>
      </FormControl>
   </div>
        {/* </MenuItem> */}
        {/* <MenuItem component={Link} to="#" sx={{ color: 'text.secondary' }}> */}
        <div className="filter-toolbar-selectbox-1" >
   <FormControl fullWidth  >
   <TextField
        labelId="demo-select-small"
        id="demo-select-small"
        value={filters?.by_shopplan}
        label="Filter By Shop Type"
   
        select
        onChange={handleShopPlanChange}
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
         <MenuItem value='all'>All </MenuItem>
         {shopPlan?.map((value,index)=>(
           <MenuItem key={index} value={value?._id}> <p style={{textTransform:'capitalize'}} >{value?._id}</p></MenuItem>

         ))}
      
      </TextField>
      
      </FormControl>
   </div>


   {/* </MenuItem> */}
   {/* <MenuItem component={Link} to="#" sx={{ color: 'text.secondary' }}> */}
        <div className="filter-toolbar-selectbox-1" >
   <FormControl fullWidth  >
                      {/* <InputLabel id="demo-select-small">Delivery Method </InputLabel> */}

                      <TextField
        labelId="demo-select-small"
        id="demo-select-small"
        value={filters?.by_delivery_method}
        label="Delivery Method "
   
        select
        onChange={handleShopDeliveryMethodChange}
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
        <MenuItem value='all'> All </MenuItem>
        {deliveryMethod?.map((value,index)=>(
          <MenuItem key={index} value={value?._id}><p style={{textTransform:'capitalize'}} >{value?._id}</p> </MenuItem>

        ))}
 
      </TextField>
      </FormControl>
   </div>


   {/* </MenuItem> */}
   {/* <MenuItem component={Link} to="#" sx={{ color: 'text.secondary' }}> */}
   <div className="filter-toolbar-selectbox-button " >
  <Button  onClick={handleResetFilter} fullWidth variant="contained" startIcon={<Iconify icon="carbon:update-now" />}> 
    Reset Filter
         </Button>
  </div>
  {/* </MenuItem> */}
        {/* <MenuItem component={Link} to="#" sx={{ color: 'text.secondary' }}> */}
        
            <div className="filter-toolbar-selectbox-button " >
  <Button  onClick={()=>setIsOpen(false)} fullWidth variant="outlined" startIcon={<Iconify icon="akar-icons:download" />}> 
    Export
         </Button>
  </div>
        {/* </MenuItem> */}
      </Menu>
    </>

        </Tooltip>
     </div>
     {/*============== MOBILE MORE ICONS=============== */}
    
   </div>

    </Paper>

      <Paper elevation={3} sx={{ width: '100%', mb: 2, borderRadius:1 }}>
     
      {/* <VendorListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}
      {/* <UserListToolbar filterName={filterName} onFilterName={handleFilterByName} /> */}
        <EnhancedTableToolbar numSelected={selected.length} countVendor={countVendor} />
        <TableContainer  >
          <Table
          
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            
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
                          onClick={(event) => handleClick(event, row._id)}
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      {/* <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.shop_id}
                      </TableCell> */}
                      <TableCell style={{textTransform:'capitalize'}} align="left">{row?.firstname} {row?.lastname}</TableCell>
                      <TableCell style={{textTransform:'capitalize'}} align="left">{row.shop_name}</TableCell>
                      <TableCell align="center">{convertDate(row.createdAt)}</TableCell>
                      {/* <TableCell align="right">{row.total_products}</TableCell> */}
                      {/* <TableCell align="right">{row.delivery_method[0]?.name}</TableCell> */}
                      <TableCell style={{textTransform:'capitalize'}} align="center">{row.shop_type}</TableCell>
                      <TableCell style={{textTransform:'capitalize'}} align="center">{row.shop_plan}</TableCell>
                      <TableCell style={{textTransform:'capitalize'}} align="right"  >
                       {/* <p  className={row.shop_status =="not verified" 
                       ?"user_not_verified" :row.shop_status=="verified" 
                       ?"user_verified": row.shop_status=="pending" 
                       ?"user_pending" : "normal"} > {row.shop_status }</p> */}


<p className={row.shop_status =="pending" ?"product-status-pending" 
                     :row.shop_status=="approved" ?"product-status-approved"
                     :row.shop_status=="rejected" ?"product-status-rejected"
                    : "normal"} >{row.shop_status =="pending" ?<Iconify icon="bi:pause-circle" />
                    :row.shop_status=="approved" ?<Iconify icon="bi:check-circle" />
                    :row.shop_status=="rejected" ?<Iconify icon="carbon:close-outline" />
                    : "normal"} {row.shop_status }</p>



                      </TableCell>
                      <TableCell align="center">
                        {/* <EditOutlinedIcon fontSize='small' /> */}
                         <VisibilityOutlinedIcon fontSize='small' />
                          <DeleteOutlineOutlinedIcon fontSize='small' />
                          </TableCell>
                    </TableRow>
                  );
                })}
                 {!data.length >0 &&   <TableCell colSpan={12}> <div className='search-not-found' >
                  <img className='search-not-found-img' src={searchNotFound} alt="searchNotFound" />
                  <Typography
          
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Users Not Found 
        </Typography>
                </div> </TableCell> }
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
  );
}

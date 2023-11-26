import * as React from 'react';
import { useState,useRef } from 'react';

import { Toolbar, Tooltip,Menu, MenuItem,TextField,InputLabel,Select,FormControl, IconButton, Typography,Button,ListItemIcon, ListItemText, OutlinedInput, InputAdornment } from '@mui/material';

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
import Backdrop from '@mui/material/Backdrop';
import { visuallyHidden } from '@mui/utils';
import { Link } from 'react-router-dom';
import { deleteImageFromFirebase, returnFileName, splitString, uploadFileToFirebase } from 'src/global/globalFunctions';
import Iconify from '../components/Iconify';
import CircularProgress from '@mui/material/CircularProgress';
import CustomizedSnackbars from '../global/Snackbar/CustomSnackbar';
import ConfimModal from "../global/Modals/ConfimModal"
import { convertDate ,getGapBetweenDates} from '../global/globalFunctions';
import { useEffect } from 'react';
import axios from 'axios';
import searchNotFound from "../assests/searchnotfound.gif"
import noImage from '../assests/No_image.svg'


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
//   {
//     id: 'shop_name',
//     numeric: false,
//     disablePadding: true,
//     label: '',
//   },
//   {
//     id: 'shop_id',
//     numeric: false,
//     disablePadding: true,
//     label: '',
//   },

  {
    id: 'order_id',
    numeric: true,
    disablePadding: false,
    label: 'Order ID',
  },

//   {
//     id: 'user_id',
//     numeric: true,
//     disablePadding: false,
//     label: 'User ID ',
//   },
  {
    id: 'Name',
    numeric: true,
    disablePadding: false,
    label: 'Name',
  },

  {
    id: 'phone_number',
    numeric: true,
    disablePadding: false,
    label: 'Phone Number',
  },
  {
    id: 'date',
    numeric: true,
    disablePadding: false,
    label: 'Date',
  },
  {
    id: 'message',
    numeric: true,
    disablePadding: false,
    label: 'Message',
  },
 

//   {
//     id: 'action',
//     numeric: true,
//     disablePadding: false,
//     label: 'Action',
//   },

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
            align={headCell.numeric ? 'center' : 'center'}
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
      (<div className='flex-justify-between ' style={{width:'100%',paddingTop:6,paddingRight:6}}  >
        <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {`All Enquiries (${props.countVendor})`}
      </Typography>
               {/* <Button variant="contained" style={{width:'20%',padding:'10px',boxShadow:'none'}} component="label" startIcon={<Iconify icon="eva:plus-fill" />}>
               Add Banner
                      <input hidden accept="image/*" onChange={props.addNewBanner} multiple type="file" />
                  </Button> */}
      </div>
    )
      } 

      <Tooltip title="Filter list">
          <>
      
        {numSelected > 0 && (
      <Tooltip title="More">
        <IconButton>
       


      
          <MoreVertOutlinedIcon style={{cursor:"pointer"}} ref={ref} onClick={() => setIsOpen(true)} fontSize='medium' />
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
    ) }
  </>

      </Tooltip>
    
  </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function Enquiry() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [filterName, setFilterName] = useState('');
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [ data, setData ] = useState([])
  const [ countVendor, setCountVendor ] = useState(0)
  const [snackbarOpen,setSnackbarOpen ] = useState(false)
  const [message ,setMessage] = useState({type:"",message:""})
  const [render , setRender ] = useState(false)
  const [ openRemoveImageModal , setOpenRemoveImageModal ] =useState([])
  const [ loading, setLoading  ] =useState(false);




  // ================== GET ALL Banners ==============
  useEffect(()=>{
    setLoading(true)
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/get/all/order/enquiries`,{withCredentials:true})
    .then(res=>{
      console.log(res?.data);
      setData(res?.data);
      setCountVendor(res?.data?.length)
      setLoading(false)
      
    })
    .catch(err=>{
      console.log(err)
      setLoading(false)
    })
  },[render])
  // ================== GET ALL Banners ==============



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
// ##################### SNACK BAR FUNCTIONs ##################
const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  
    setSnackbarOpen(false);
  };
  // ##################### SNACK BAR FUNCTIONs ##################

  const handleCloseSubCateConfirmModal=(i)=>{
  console.log("CLOSE MODAL",i)
  let closeModalState=[...openRemoveImageModal]
  closeModalState[i] = false
  setOpenRemoveImageModal(closeModalState)
}

const handleOpenRemoveImageModal=(i,value)=>{
    console.log("openModal ==",i ,"-==",value)
    let newModalState=[...openRemoveImageModal]
    newModalState[i] = value 
    setOpenRemoveImageModal(newModalState)
  
  }

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
    <div className='custom-conatiner'>
         {/* #################### SANCKBAR MESSAGE ######################## */}
    <CustomizedSnackbars onOpen={snackbarOpen} type={message?.type} handleClose={handleCloseSnackbar}  message={message?.message} />
    {/* #################### SANCKBAR MESSAGE ######################## */}

    <Box sx={{ width: '100%' }}>
      <Paper elevation={3} sx={{ width: '100%', mb: 2, borderRadius:1 }}>
     
      {/* <VendorListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}
      {/* <UserListToolbar filterName={filterName} onFilterName={handleFilterByName} /> */}
        <EnhancedTableToolbar numSelected={selected.length} countVendor={countVendor}  />
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
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <>  
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
                      <TableCell align="left" style={{textTransform:'capitalize'}} >{row?.order_id}</TableCell>
                      <TableCell align="center" style={{textTransform:'capitalize'}} >{row?.username}</TableCell>
                      <TableCell align="center">{row?.phone_number}</TableCell>
                      <TableCell align="center">{convertDate(row?.createdAt)}</TableCell>
                      <TableCell align="center" style={{textTransform:'capitalize'}} >{row?.message}</TableCell>

                      {/* <TableCell align="center">
               <Button variant="contained" style={{boxShadow:'none'}} component="label" startIcon={<Iconify icon="akar-icons:edit" />}>
               Change
                      <input hidden accept="image/*" onChange={(e)=>handleFileUpload(row?._id,e)} multiple type="file" />
                  </Button>

               <Button onClick={()=>handleOpenRemoveImageModal(index,true)} variant="contained" style={{backgroundColor:'#de040c',marginLeft:8,boxShadow:'none'}}  startIcon={<Iconify icon="eva:trash-2-outline" />}> 
           Remove
               </Button>
                          </TableCell> */}
                    </TableRow></>
                  );
                })}
                 {!data.length >0 &&   <TableCell colSpan={12}> <div className='search-not-found' >
                  <img className='search-not-found-img' src={searchNotFound} alt="searchNotFound" />
                  <Typography
          
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Banners Not Found 
        </Typography>
                </div> </TableCell> }
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

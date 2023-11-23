import React from 'react';
import TextField from '@mui/material/TextField';
import "../../index.css";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
    Card,
    Table,
    Stack,
    Avatar,
    Button,
    Checkbox,
    TableRow,
    TableBody,
    TableCell,
    
    Typography,
    TableContainer,
    TablePagination,
  } from '@mui/material';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import palette from '../../theme/palette';

import Iconify from '../../components/Iconify';


function EditCategoryModal({handleonclose}) {
  return (
    <div>
        <h3 className='edit_h3'>Edit Category</h3>
        <p className='category_text'>Main Category</p>
        <TextField className='edit_category_field main_category_text' id="outlined-basic" variant="outlined" />
        <p className='category_text'>Sub Category</p>
        <TextField className='edit_category_field' id="outlined-basic"  variant="outlined" />
        <TextField className='edit_category_field' id="outlined-basic"  variant="outlined" />
        <TextField className='edit_category_field' id="outlined-basic"  variant="outlined" />
        <TextField className='edit_category_field' id="outlined-basic"  variant="outlined" />
        <HighlightOffIcon style={{color:palette.primary.main}} onClick={handleonclose} className='close_edit_Category' />
        <div className='editmodalbtns'>
        <Button variant="contained" to="#" startIcon={<Iconify icon="eva:plus-fill" />}>
            Add More
          </Button>
          <Button variant="contained" to="#" startIcon={<Iconify icon="ic:baseline-update" />}>
            Update
          </Button>
        </div>
    </div>
  )
}

export default EditCategoryModal
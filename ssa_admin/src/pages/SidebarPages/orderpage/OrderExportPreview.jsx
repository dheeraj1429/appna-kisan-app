import React, { useRef } from 'react'
import { Toolbar,TextField ,Container,FormControl,Tooltip,Menu, MenuItem, IconButton, Typography,Button,ListItemIcon, ListItemText, OutlinedInput, InputAdornment, colors } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import Invoice from './InvoiceTemplate/Invoice';
import palette from 'src/theme/palette';
import Iconify from 'src/components/Iconify';
import "./InvoiceTemplate/Invoice.css"
import { DownloadTableExcel ,useDownloadExcel } from 'react-export-table-to-excel';
import { convertDateForOrder } from 'src/global/globalFunctions';

function OrderExportPreview({orderDetail,handleClose}) {

    const tableRef = useRef(null);

//   const handleExportWithComponent = event => {
//     pdfExportComponent.current.save();
//   };
// const { onDownload } = useDownloadExcel({
//     currentTableRef: tableRef.current,
//     filename: `${orderDetail?.customer_name} order`,
//     sheet: 'Order',
    
// })
const  onDownload  =(fileExt,filename)=>{
  var elt = tableRef.current
  var wb = window.XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
  return window.XLSX.writeFile(wb,filename+"."+fileExt || ('MySheet.'+(fileExt || 'xlsx')))
}


let sub_total = 0
for(let i=0;i<orderDetail?.products?.length;i++){
    sub_total = sub_total + (orderDetail?.products[i]?.product_sale_price * orderDetail?.products[i]?.product_quantity)
}


  return (
    <div>
        <Container  >
          
         <div className='close_edit_Category ' >
    <HighlightOffIcon style={{color:palette.primary.main}} onKeyDown={handleClose}  onClick={handleClose} fontSize='large' />
    {/* <HighlightOffIcon style={{color:palette.primary.main}}  fontSize='large' /> */}
</div>
          {/* <div style={{textAlign:'left'}} >
          <h2>Inovice Preivew</h2>
          </div> */}

    {/* <div  ref={tableRef}   >
    <Invoice orderDetail={orderDetail} />
        </div> */}
  <Typography
          variant="h6"
          id="tableTitle"
          component="div"
          sx={{marginTop:12}}
        >
        Export Preview
        </Typography>
<div style={{display:'flex',justifyContent:'center',marginBottom:22}} > 
          <Button onClick={handleClose}  variant="text"  style={{marginRight:10}}  startIcon={<Iconify icon="material-symbols:arrow-back-rounded" />} >  
                 Go Back
                    </Button>
                    <Button  variant="contained" onClick={()=>onDownload('xlsx','order-export')} startIcon={<Iconify icon="basil:invoice-solid" />}>  
                    Export Excel
                    </Button>
         
          </div>
       

    <div class="invoice-main-container"   >
    <div class="invoice-main-inner ">
        <div class="row-invoice mt-4">
            <div class="col-12 col-lg-12">
                <div class="row-invoice">
                        <div class="text-center text-150">
                        
                    </div>
                </div>
                {/* <div class="row-invoice">
                        <div class="text-center text-150">
                        <h3 class="">INVOICE</h3>
                    </div>
                        <div class="invoice-store-owner-detail-box font-capitalize-case">
                         <h3>SUPREME SALES AGENCY</h3>
                       <p>33/1, Netaji Subhas Road, Room No. 323,3rd Floor</p>
                       <p style={{paddingLeft:'10px'}} >Kolkata, 700040</p>
                       <p>{authState?.user?.invoice_details?.company_phone_number ? authState?.user?.invoice_details?.company_phone_number : 'Your Phone Number'}</p>
                       </div>
                </div> */}


                {/* <hr class="row-invoice brc-default-l1 mx-n1 mb-4" /> */}

               <div ref={tableRef}  id='tbl_exporttable_to_xls' >
               <div class="row-invoice">
                    {/* <div class="invoice-customer-detail-box">
                         <h4 >To : {orderDetail?.customer_name?.toUpperCase()}</h4>
                      <div className='invoice-customer-details' >
                      <p>{orderDetail?.shipping_address}</p>
                       <p> {orderDetail?.state}, {orderDetail?.pincode} </p>
                       <p> <strong>Payment Mode :</strong> {orderDetail?.payment_mode}</p>
                      </div>
                       </div> */}
        {/* <Table  aria-label="simple table"   >
        <TableHead sx={{fontWeight:'900'}} >
        <TableRow>
            <TableCell align='left' ><h4>Order ID</h4></TableCell>
            <TableCell align='left' ><h4>Customer Name</h4></TableCell>
            <TableCell align='left' ><h4>Shipping Address</h4></TableCell>
            <TableCell align="left"><h4>State / Pincode</h4></TableCell>
            <TableCell align="left"><h4>Mobile</h4></TableCell>
            <TableCell align="left"><h4>Email</h4></TableCell>
          </TableRow>
            </TableHead>
            <TableBody>
        <TableRow>
            <TableCell align='left' >{orderDetail?.order_id}</TableCell>
            <TableCell align='left' >{orderDetail?.customer_name?.toUpperCase()}</TableCell>
            <TableCell align='left' >{orderDetail?.shipping_address}</TableCell>
            <TableCell align='left' >{orderDetail?.state} / {orderDetail?.pincode}</TableCell>
            <TableCell align='left' >+91-{orderDetail?.customer_phone_number}</TableCell>
            <TableCell align='left' >{orderDetail?.customer_email}</TableCell>
          </TableRow>
        </TableBody>
      </Table> */}
                       {/* <div class="invoice-customer-detail-box-right">
                      <div className='invoice-customer-details' >
                      <p><strong>Invoice ID :</strong> {orderDetail?.order_id}</p>
                      <p><strong>Date & Time :</strong> {convertDateForOrder(orderDetail?.createdAt)}</p>
                       <p> <strong>Mobile : </strong>+91-{orderDetail?.customer_phone_number}</p>
                       <p style={{textTransform:'lowercase'}} ><strong style={{textTransform:'capitalize'}} >Email : </strong> {orderDetail?.customer_email}</p>
                      </div>
                       </div> */}
              
                </div>
                {/* <hr class="row-invoice brc-default-l1 mx-n1 mb-4" /> */}
                <div class="mt-4">
                <TableContainer >
      <Table sx={{ minWidth: 850 }} aria-label="simple table"   >
        <TableHead sx={{fontWeight:'900'}} >
          <TableRow>
            <TableCell align='left' ><h4>#</h4></TableCell>
            <TableCell align='left' ><h4>Customer Name</h4></TableCell>
            <TableCell align="center"><h4>Phone Number</h4></TableCell>
            <TableCell align="center"><h4>Order ID</h4></TableCell>
            <TableCell align="center"><h4>Time</h4></TableCell>
            <TableCell align="center"><h4>Products</h4></TableCell>
            <TableCell align="center"><h4>Status</h4></TableCell>
            {/* <TableCell align="left"><h4>Amount</h4></TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
            {orderDetail?.map((value,index)=>(
                     <TableRow
                     sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                     <TableCell align="left">{index+ 1}</TableCell>
                     <TableCell style={{maxWidth:250}} align="left"> {value?.customer_name?.toUpperCase()}</TableCell>
                     <TableCell align="center">{value?.customer_phone_number}</TableCell>
                     <TableCell align="center">{value?.order_id}</TableCell>
                     <TableCell align="center">{convertDateForOrder(value.createdAt)}</TableCell>
                     <TableCell align="center">{value?.products?.length}</TableCell>
                     <TableCell align="center">{value?.order_status}</TableCell>
                     {/* <TableCell align="left">Rs. {value?.product_sale_price}</TableCell> */}
                     {/* <TableCell align="left">Rs.{value?.product_quantity * value?.product_sale_price}</TableCell> */}
                   </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
                </div>
               </div>
            </div>
        </div>
    </div>
</div>







        </Container>
    </div>

  )
}

export default OrderExportPreview
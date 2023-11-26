import React from 'react'
import { Toolbar,TextField ,Container,FormControl,Tooltip,Menu, MenuItem, IconButton, Typography,Button,ListItemIcon, ListItemText, OutlinedInput, InputAdornment, colors } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import "./Invoice.css"
import { convertDateForOrder } from 'src/global/globalFunctions';
import { UseContextState } from 'src/global/GlobalContext/GlobalContext';

function Invoice({orderDetail}) {
  const {authState}=UseContextState()
    console.log("orderDetails-----------",orderDetail)

    let sub_total = 0
    for(let i=0;i<orderDetail?.products?.length;i++){
        sub_total = sub_total + (orderDetail?.products[i]?.product_sale_price * orderDetail?.products[i]?.product_quantity)
    }



  return (
    <div class="invoice-main-container" >
    <div class="invoice-main-inner ">
        <div class="row-invoice mt-4">
            <div class="col-12 col-lg-12">
                <div class="row-invoice">
                        <div class="text-center text-150">
                        
                    </div>
                </div>
                <div class="row-invoice">
                        <div class="text-center text-150">
                        <h3 class="">INVOICE</h3>
                    </div>
                        <div class="invoice-store-owner-detail-box font-capitalize-case">
                         <h3>SUPREME SALES AGENCY</h3>
                       <p>33/1, Netaji Subhas Road, Room No. 323,3rd Floor</p>
                       <p style={{paddingLeft:'10px'}} >Kolkata, 700040</p>
                       {/* <p>{authState?.user?.invoice_details?.company_phone_number ? authState?.user?.invoice_details?.company_phone_number : 'Your Phone Number'}</p> */}
                       </div>
                </div>


                <hr class="row-invoice brc-default-l1 mx-n1 mb-4" />

                <div class="row-invoice">
                    <div class="invoice-customer-detail-box">
                         <h4 >To : {orderDetail?.customer_name?.toUpperCase()}</h4>
                      <div className='invoice-customer-details' >
                      <p>{orderDetail?.shipping_address}</p>
                       <p> {orderDetail?.state}, {orderDetail?.pincode} </p>
                       <p> <strong>Payment Mode :</strong> {orderDetail?.payment_mode}</p>
                      </div>
                       </div>

                       <div class="invoice-customer-detail-box-right">
                      <div className='invoice-customer-details' >
                      <p><strong>Invoice ID :</strong> {orderDetail?.order_id}</p>
                      <p><strong>Date & Time :</strong> {convertDateForOrder(orderDetail?.createdAt)}</p>
                       <p> <strong>Mobile : </strong>+91-{orderDetail?.customer_phone_number}</p>
                       <p style={{textTransform:'lowercase'}} ><strong style={{textTransform:'capitalize'}} >Email : </strong> {orderDetail?.customer_email}</p>
                      </div>
                       </div>
              
                </div>
                <hr class="row-invoice brc-default-l1 mx-n1 mb-4" />
                <div class="mt-4">
                <TableContainer >
      <Table sx={{ minWidth: 850 }} aria-label="simple table">
        <TableHead sx={{fontWeight:'900'}} >
          <TableRow>
            <TableCell align='left' ><h4>#</h4></TableCell>
            <TableCell align='left' ><h4>Products</h4></TableCell>
            <TableCell align="center"><h4>Quantity</h4></TableCell>
            <TableCell align="right"><h4>Price</h4></TableCell>
            <TableCell align="right"><h4>Amount</h4></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {orderDetail?.products?.map((value,index)=>(
                     <TableRow
                     sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                     <TableCell align="left">{index+ 1}</TableCell>
                     <TableCell style={{maxWidth:250}} align="left"> {value?.product_name?.toUpperCase()}{value?.product_code ? ` | code: ${value?.product_code}`:''}{value?.product_color? ` | color: ${value?.product_color}`:''}{value?.product_size?` | size: ${value?.product_size}` :''}{value?.product_weight? ` | weight: ${value?.product_weight}` :''}</TableCell>
                     <TableCell align="center">{value?.product_quantity}</TableCell>
                     <TableCell align="right">Rs.{value?.product_sale_price}</TableCell>
                     <TableCell align="right">Rs.{value?.product_quantity * value?.product_sale_price}</TableCell>
                   </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
    <hr class="row-invoice brc-default-l1 mx-n1 mb-4" />

                    <div class="row-invoice mt-3">
                        <div class="col-12 col-sm-6 text-grey-d2 text-95 mt-2 mt-lg-0">
                            {/* Extra note such as company or payment information... */}
                        </div>
                        <div class="invoice-customer-detail-box-right">
                      <div className='invoice-customer-total-details' >
                      <p className='total-amount-box' ><strong>Sub Total :</strong> Rs.{sub_total}</p>
                      <p className='total-amount-box' ><strong style={{paddingRight:'13px'}} >Delivery & Shipping : </strong> Rs.{orderDetail?.delivery_charges}</p>
                      <hr />
                       <p className='total-amount-box total-amount-detail' > <strong style={{paddingRight:'13px'}} >Total Amount : </strong><strong>Rs.{orderDetail?.delivery_charges + parseInt(orderDetail?.order_total)}</strong></p>
                      </div>
                       </div>
                    </div>

                    

                    <div style={{marginTop:'80px',textAlign:'center'}} >
                        <p class="">Have a Nice Day, Thank You For Shopping With Us.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
  )
}

export default Invoice
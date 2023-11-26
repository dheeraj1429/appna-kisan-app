import React from 'react'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { Button } from '@mui/material';
import palette from '../../theme/palette';
import Iconify from '../Iconify';
import uploadImage from "../../assests/uploadimage.gif"
import "../../index.css"
import Avatar from '@mui/material/Avatar';

function FileUploadDesign({fileUpload,handleFileUpload}) {
  return (
    <div>
         <div className="file-upload" >
              <div className="file-upload-box" >
                 <div className="file-upload-sub-box">
                <img className='upload-image' src={uploadImage} alt="" />
                 <p>Drag your image here </p>
                 <span>or</span>
                 {/* <CloudUploadOutlinedIcon style={{color:palette.primary.main}} /> */}
                 <Button variant="contained" component="label" startIcon={<Iconify icon="ant-design:cloud-upload-outlined" />}>
                      Upload
                      <input hidden accept="image/*" onChange={handleFileUpload} multiple type="file" />
                  </Button>
                 {/* <Button variant='contained'  > Browse </Button> */}
                 
                 </div>
              </div>
                 <div style={{textAlign:"center"}} > 
                 <sub >(Only *.jpeg and *.png images will be accepted)</sub>
                 </div>

          </div>

          {/* <div className='fileupload_avtar'>
          <Avatar sx={{ width: 70, height: 70 }} alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </div> */}
    </div>
  )
}

export default FileUploadDesign
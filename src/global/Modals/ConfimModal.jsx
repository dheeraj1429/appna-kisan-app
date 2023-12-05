// import * as React from 'react';
// import Backdrop from '@mui/material/Backdrop';
// import Box from '@mui/material/Box';
// import Modal from '@mui/material/Modal';
// import Fade from '@mui/material/Fade';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';



// export default function ConfimModal(props) {
//   const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: props.modalWidth,
//     bgcolor: 'background.paper',
//     border: '0px solid #000',
//     borderRadius:"10px 10px ",
//     boxShadow: 24,
//     p: 4,
//   };

  
 

//   return (
//     <div>
      
//       <Modal
//         aria-labelledby="transition-modal-title"
//         aria-describedby="transition-modal-description"
//         disableAutoFocus
//         open={props.open}
//         onClose={props.close}
//         // closeAfterTransition
//         // disableEscapeKeyDown
//         // disableEnforceFocus
//         // onBackdropClick='false'
//         // BackdropComponent={Backdrop}
//         // BackdropProps={{
//         //   timeout: 500,
//         // }}
//       >
//         <Fade in={props.open}>
//           <Box sx={style}>
//               <div>
//                   {props.message}
//               </div>
//           </Box>
//         </Fade>
//       </Modal>
//     </div>
//   );
// }


import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  // bgcolor: 'white',
  border: 'none',
  boxShadow: 4,
  borderRadius:1,
  p: 2,
};

export default function BasicModal(props) {
  const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

  return (
    <div>
    
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableAutoFocus
       
            
            // BackdropComponent={Backdrop}
            // BackdropProps={{
            // timeout: 500,
            //  }}
        // disableEscapeKeyDown={false}
      >
         
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {props.title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 1 }}>
          {props.message}
          </Typography>
         <div style={{paddingTop:10,display:'flex',justifyContent:"end"}} >
         <Button style={{marginRight:"10px"}} variant='outlined' onClick={props.onYes}  >YES</Button>
          <Button variant='contained' onClick={props.handleClose} >NO</Button>
         </div>

        </Box>

      </Modal>
    </div>
  );
}
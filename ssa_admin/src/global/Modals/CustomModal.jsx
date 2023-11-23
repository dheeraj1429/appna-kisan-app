import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';



export default function GlobalModal(props) {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: props.modalWidth,
    bgcolor: 'background.paper',
    border: '0px solid #000',
    borderRadius:"10px 10px ",
    boxShadow: 24,
    p: 4,
  };

  
 

  return (
    <div>
      
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        disableAutoFocus
        open={props.open}
        onClose={props.close}
        closeAfterTransition
        // disableEscapeKeyDown
        disableEnforceFocus
        // onBackdropClick='false'
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.open}>
          <Box sx={style}>
              <div>
                  {props.data}
              </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
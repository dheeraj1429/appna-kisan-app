import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbars(props) {
//   const [open, setOpen] = React.useState(false);


  return (
    <>
     <Stack spacing={2} sx={{ width: '100%' }}>
      {/* <Button variant="outlined" onClick={props.}>
        Open success snackbar
      </Button> */}
      <Snackbar open={props.onOpen} autoHideDuration={2000} onClose={props.handleClose}>
        <Alert onClose={props.handleClose} severity={`${props.type}`}
         sx={{ width: '100%',color:"white",
         backgroundColor:props.type === "success" ? "#029e02" : props.type === "error" ?"#1e1e1e" : props.type === "warning" ? "#edb200": props.type === "info" ? "#1890FF" : "#1890FF" }}>
          {props.message}
        </Alert>
      </Snackbar>
      {/* #029e02 success
     #edb200 warning
      #1e1e1e error
       #1890FF info
      */}
     </Stack>
    </>
  );
}

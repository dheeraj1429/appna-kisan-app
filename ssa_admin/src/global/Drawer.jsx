import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import palette from '../theme/palette';

export default function SideDrawer({ ComponentButton, ComponentData, toggleDrawerOpen, toggleDrawerClose, state }) {
  const list = (anchor) => (
    <Box sx={{ width: '100%' }} role="presentation">
      <>{ComponentData}</>
    </Box>
  );

  return (
    <div>
     
      <React.Fragment>
        <div style={{width:"100%"}}  onClick={toggleDrawerOpen}>{ComponentButton}</div>
        {/* <Component/> */}
        <Drawer
          disableAutoFocus
          disableEnforceFocus
          disableRestoreFocus
          anchor={'right'}
          open={state}
          onClose={toggleDrawerClose}
        >
          {list('right')}
        </Drawer>
      </React.Fragment>

    </div>
  );
}

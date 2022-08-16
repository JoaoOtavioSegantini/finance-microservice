import * as React from 'react';
import { IconButton, Menu as MuiMenu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/router';

export const Menu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const handleOpen = (event: any) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <React.Fragment>
      <IconButton color="inherit" onClick={handleOpen}>
        <MenuIcon />
      </IconButton>

      <MuiMenu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            router.push('/');
          }}
        >
          Home
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            router.push('/login?from=/reports');
          }}
        >
          Relatórios
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            router.push('/login?from=/transactions');
          }}
        >
          Transações
        </MenuItem>
      </MuiMenu>
    </React.Fragment>
  );
};

export default Menu;

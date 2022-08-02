import { IconButton, MenuItem, Divider, Menu } from '@mui/material';
import AccountBox from '@mui/icons-material/AccountBox';
import { useKeycloak } from '@react-keycloak/ssr';
import { KeycloakInstance } from 'keycloak-js';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const UserAccountMenu: React.FunctionComponent = () => {
  const { keycloak } = useKeycloak<KeycloakInstance>();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOpen = (event: any) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <React.Fragment>
      <IconButton edge="end" color="inherit" onClick={handleOpen}>
        <AccountBox />
      </IconButton>

      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MenuItem disabled={true}>
          {(keycloak?.idTokenParsed as any).family_name}
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => router.push('/logout')}>Logout</MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default UserAccountMenu;

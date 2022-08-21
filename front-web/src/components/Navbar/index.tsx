import { AppBar, Toolbar, Typography, styled, Theme } from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import { useKeycloak } from '@react-keycloak/ssr';
import React, { useContext } from 'react';
import TenantContext from '../TenantProvider';
import Menu from './Menu';
import UserAccountMenu from './UserAccountMenu';
import { useTheme } from '@emotion/react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: theme.palette.primary.main,
  marginBottom: '25px',
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Title = styled('span')(({ theme }) => ({
  flexGrow: 1,
}));
//next static
const Navbar: React.FunctionComponent = () => {
  const { initialized, keycloak } = useKeycloak();
  const tenant = useContext(TenantContext);
  const theme = useTheme() as Theme;

  return initialized && keycloak?.authenticated && tenant ? (
    <Root>
      <AppBar
        position="static"
        style={{ backgroundColor: theme.palette.primary.main }}
      >
        <Toolbar>
          <Menu />
          <StoreIcon />
          <Title>Fincycle - {tenant.name}</Title>
          <Typography>Saldo R$ {tenant.balance}</Typography>
          <UserAccountMenu />
        </Toolbar>
      </AppBar>
    </Root>
  ) : null;
};

export default Navbar;

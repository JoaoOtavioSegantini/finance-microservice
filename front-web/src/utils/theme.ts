import { createTheme, PaletteOptions } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const palette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: red[800],
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#242526',
  },
};

const theme = createTheme({
  palette,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          'html, body, body>div': {
            height: '100%',
          },
        },
      },
    },
  },
});

export default theme;

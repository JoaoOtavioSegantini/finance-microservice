import { Grid } from '@devexpress/dx-react-grid-material-ui';

declare module '@devexpress/dx-react-grid-material-ui' {
  interface GridProps {
    children: React.ReactNode;
  }
}

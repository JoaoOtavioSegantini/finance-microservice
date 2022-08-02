import { styled } from '@mui/material';
import { NextPage } from 'next';
import { ReactNode } from 'react';
import Navbar from '../Navbar';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Root = styled('div')(({ theme }) => ({
  height: 'calc(100% - 64px)',
}));

export interface PageProps {
  children?: ReactNode;
}
export const Page: NextPage<PageProps> = (props) => {
  return (
    <>
      <Navbar />
      <Root>{props.children}</Root>
    </>
  );
};

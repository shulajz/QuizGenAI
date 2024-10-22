import React from 'react';
import { Box } from '@mui/material';
import './Layout.scss';

const Layout = ({ children }) => {
  return (
    <Box className="layout-root">
      <Box className="layout-decoration layout-decoration-top" />
      <Box className="layout-decoration layout-decoration-bottom" />
      {children}
    </Box>
  );
};

export default Layout;

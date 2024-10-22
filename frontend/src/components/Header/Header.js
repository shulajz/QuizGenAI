import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import './Header.scss';

const Header = ({ isSignedIn, onSignOut }) => {
  return (
    <AppBar position="sticky" elevation={0} className="header-root">
      <Toolbar className="header-toolbar">
        <Typography variant="h4" component="div" className="header-title">
          Trivia Game
        </Typography>
        {isSignedIn && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={onSignOut}
            className="header-button"
          >
            Sign Out
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;

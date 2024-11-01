// Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import './Header.scss';

const Header = ({ isSignedIn, onSignOut, onHistory }) => {
  return (
    <AppBar position="sticky" elevation={0} className="header-root">
      <Toolbar className="header-toolbar">
        <Typography variant="h4" component="div" className="header-title">
          Trivia Game
        </Typography>
        {isSignedIn && (
          <>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onSignOut}
              className="header-button"
            >
              Sign Out
            </Button>
            <Button
              variant="outlined"
              onClick={onHistory}
              className="header-button header-history-button"
            >
              History
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;

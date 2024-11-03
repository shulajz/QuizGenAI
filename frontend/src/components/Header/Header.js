import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useContext } from 'react';
import { UserContext } from '../UserContext';
import { Link } from 'react-router-dom'; // Import Link

import './Header.scss';

const Header = ({ isSignedIn, onSignOut }) => {
  const { logout } = useContext(UserContext);

  const handleOnSignOut = () => {
    logout();
    onSignOut();
  };

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
              component={Link} // Change to Link component
              to="/main" // Route to main page
              className="header-button header-main-button"
            >
              Main
            </Button>
            <Button
              variant="outlined"
              component={Link} // Change to Link component
              to="/history" // Route to history page
              className="header-button header-history-button"
            >
              History
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleOnSignOut}
              className="header-button"
            >
              Sign Out
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;

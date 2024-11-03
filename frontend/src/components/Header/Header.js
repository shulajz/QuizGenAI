import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useContext } from 'react';
import { UserContext } from '../UserContext';
import { Link } from 'react-router-dom';
import './Header.scss';

const Header = ({ isSignedIn, onSignOut }) => {
  const { logout, username } = useContext(UserContext);

  const handleOnSignOut = () => {
    logout();
    onSignOut();
  };

  return (
    <AppBar position="sticky" elevation={0} className="header-root">
      <Toolbar className="header-toolbar">
        <div className="title-container">
          <Typography variant="h4" component="div" className="header-title">
            Trivia Game
          </Typography>
          {isSignedIn && username && (
            <Typography variant="h6" component="div" className="username-text">
              Welcome, {username}
            </Typography>
          )}
        </div>
        {isSignedIn && (
          <div className="button-group">
            <Button
              variant="outlined"
              component={Link}
              to="/main"
              className="header-button header-main-button"
            >
              Main
            </Button>
            <Button
              variant="outlined"
              component={Link}
              to="/history"
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
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;

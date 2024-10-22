import React, { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import SignIn from './SignIn';
import SignUp from './SignUp';

const AuthComponent = ({ onSignIn }) => {
  const [showSignUp, setShowSignUp] = useState(false);

  const handleAuthSuccess = () => {
    onSignIn();
  };

  const toggleAuthMode = () => {
    setShowSignUp(!showSignUp);
  };

  return (
    <Box>
      {showSignUp ? (
        <>
          <SignUp onSuccess={handleAuthSuccess} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 2,
              gap: 1,
            }}
          >
            <Typography variant="body2">Already have an account?</Typography>
            <Button onClick={toggleAuthMode} sx={{ minWidth: 'auto' }}>
              Sign In
            </Button>
          </Box>
        </>
      ) : (
        <>
          <SignIn onSuccess={handleAuthSuccess} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 2,
              gap: 1,
            }}
          >
            <Typography variant="body2">Don't have an account?</Typography>
            <Button onClick={toggleAuthMode} sx={{ minWidth: 'auto' }}>
              Sign Up
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AuthComponent;

import React from 'react';
import { Typography, Box } from '@mui/material';
import './Welcome.scss';

const Welcome = () => {
  return (
    <Box className="welcome-container">
      <Typography variant="h4" className="welcome-title" gutterBottom>
        Welcome to Trivia Master
      </Typography>
      <Typography variant="h6" className="welcome-subtitle">
        Transform any PDF into an interactive learning experience
      </Typography>
      <Typography variant="body1" className="welcome-description">
        Upload a PDF and challenge yourself with custom trivia questions based
        on its content. Test your knowledge and learn in a fun, interactive way!
      </Typography>
    </Box>
  );
};

export default Welcome;

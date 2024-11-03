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
        Create custom trivia from your own content
      </Typography>
      <Typography variant="body1" className="welcome-description">
        Start by uploading a PDF or entering a topic, and we'll generate trivia
        questions for you. <br />
        Challenge yourself, expand your knowledge, <br />
        and make learning fun!
      </Typography>
    </Box>
  );
};

export default Welcome;

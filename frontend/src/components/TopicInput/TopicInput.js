import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';

const TopicInput = ({ onQuizGenerated }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTopicSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ topic }),
      });

      if (response.ok) {
        const data = await response.json();
        onQuizGenerated(data.quiz_id);
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="topic-input-container" alignItems="center">
      <TextField
        fullWidth
        label="Enter a topic for your quiz"
        variant="outlined"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        sx={{ mr: 2, width: '80%' }}
      />
      <Button
        variant="contained"
        onClick={handleTopicSubmit}
        disabled={!topic.trim() || loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Generate Quiz'}
      </Button>
    </Box>
  );
};

export default TopicInput;

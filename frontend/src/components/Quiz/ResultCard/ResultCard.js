import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import './ResultCard.scss';

const ResultCard = ({ numCorrect, totalQuestions }) => {
  return (
    <Card className="result-card">
      <CardContent>
        <Typography className="quiz-completed-title">
          Quiz Completed!
        </Typography>
        <Typography className="result-message">
          You answered {numCorrect} out of {totalQuestions} questions correctly!
          🎉
        </Typography>
        <Typography className="encouragement-text">
          Great job! Click 'Exit Quiz' to return to the main menu.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ResultCard;

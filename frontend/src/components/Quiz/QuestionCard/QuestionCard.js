import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  Box,
} from '@mui/material';
import './QuestionCard.scss';

const QuestionCard = ({ currentQuestion, onNext }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswerClick = (answer) => {
    if (!isAnswered) {
      setSelectedAnswer(answer);
      setIsAnswered(true);
    }
  };

  const handleNextClick = () => {
    const isCorrectAnswer =
      selectedAnswer === currentQuestion.correct_answer_text;
    onNext(isCorrectAnswer ? 1 : 0);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  return (
    <Card className="question-card">
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {currentQuestion.question_text}
        </Typography>
        <List>
          {Object.values(currentQuestion.options).map((answer, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor:
                  isAnswered &&
                  answer.answer_text === currentQuestion.correct_answer_text
                    ? 'lightgreen'
                    : isAnswered &&
                      answer.answer_text === selectedAnswer &&
                      answer.answer_text !== currentQuestion.correct_answer_text
                    ? 'lightcoral'
                    : 'transparent',
                cursor: 'pointer',
                marginBottom: '8px',
                padding: '8px',
                ...(isAnswered
                  ? {}
                  : {
                      '&:hover': {
                        backgroundColor: 'lightblue',
                      },
                    }),
              }}
              onClick={() => handleAnswerClick(answer.answer_text)}
            >
              <ListItem disabled={isAnswered}>
                <Typography
                  variant="body1"
                  color={
                    isAnswered &&
                    answer.answer_text === currentQuestion.correct_answer_text
                      ? 'green'
                      : isAnswered && answer.answer_text === selectedAnswer
                      ? 'red'
                      : 'textPrimary'
                  }
                >
                  {answer.answer_text}
                </Typography>
              </ListItem>
            </Box>
          ))}
        </List>
        {isAnswered && (
          <Typography
            variant="body2"
            color={
              selectedAnswer === currentQuestion.correct_answer_text
                ? 'green'
                : 'red'
            }
          >
            {selectedAnswer === currentQuestion.correct_answer_text
              ? 'Correct!'
              : 'Wrong!'}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleNextClick}
          disabled={!isAnswered}
          className="next-button"
        >
          Next
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;

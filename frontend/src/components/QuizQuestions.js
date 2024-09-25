import React, { useState } from 'react';

import {
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
} from '@mui/material';

import './QuizQuestions.scss';

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
    const isCorrectAnswer = selectedAnswer === currentQuestion.correct_answer;
    onNext(isCorrectAnswer ? 1 : 0);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  return (
    <Card
      sx={{
        border: 'none', // Removes the border
        boxShadow: 'none', // Removes the shadow
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {currentQuestion.question}
        </Typography>
        <List>
          {Object.values(currentQuestion.options).map((answer, index) => (
            <ListItem
              key={index}
              button
              onClick={() => handleAnswerClick(answer)}
              disabled={isAnswered}
              className={isAnswered ? 'disabled' : ''}
              sx={{
                backgroundColor:
                  isAnswered && answer === currentQuestion.correct_answer
                    ? 'lightgreen'
                    : isAnswered &&
                      answer === selectedAnswer &&
                      answer !== currentQuestion.correct_answer
                    ? 'lightcoral'
                    : 'transparent',
              }}
            >
              <Typography
                variant="body1"
                color={
                  isAnswered && answer === currentQuestion.correct_answer
                    ? 'green'
                    : isAnswered && answer === selectedAnswer
                    ? 'red'
                    : 'textPrimary'
                }
              >
                {answer}
              </Typography>
            </ListItem>
          ))}
        </List>
        {isAnswered && (
          <Typography
            variant="body2"
            color={
              selectedAnswer === currentQuestion.correct_answer
                ? 'green'
                : 'red'
            }
          >
            {selectedAnswer === currentQuestion.correct_answer
              ? 'Correct!'
              : 'Wrong!'}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleNextClick}
          disabled={!isAnswered}
          sx={{ mt: 1, float: 'right' }} // Aligns button to the right
        >
          Next
        </Button>
      </CardContent>
    </Card>
  );
};

const QuizQuestions = ({ quizQuestions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [numOfCorrectAnswers, setNumOfCorrectAnswers] = useState(0);
  console.log('quizquestions comp questions--', quizQuestions);

  const handleNextQuestion = (isCorrectAnswer) => {
    setNumOfCorrectAnswers((prevIndex) => prevIndex + isCorrectAnswer);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  if (currentQuestionIndex >= quizQuestions.length) {
    return (
      <div>
        <p>
          You got {numOfCorrectAnswers}/{quizQuestions.length} questions
          correct!
        </p>
      </div>
    );
  }
  const currentQuestion = quizQuestions[currentQuestionIndex];
  console.log('currentQuestion--', currentQuestion);

  return (
    <div>
      <h2>Quiz Questions</h2>
      <QuestionCard
        currentQuestion={currentQuestion}
        onNext={handleNextQuestion}
      />
    </div>
  );
};

export default QuizQuestions;

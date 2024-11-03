import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  Box,
} from '@mui/material';
import './QuizQuestions.scss';
import { UserContext } from '../UserContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
            <ListItem
              key={index}
              button
              onClick={() => handleAnswerClick(answer.answer_text)}
              disabled={isAnswered}
              className={isAnswered ? 'disabled' : ''}
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
              }}
            >
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
          sx={{ mt: 2, alignSelf: 'flex-end' }}
          className="next-button"
        >
          Next
        </Button>
      </CardContent>
    </Card>
  );
};

const QuizQuestions = ({ quizId: propQuizId }) => {
  const location = useLocation();
  const quizId = propQuizId || location.state?.quizId;
  const navigate = useNavigate();

  const { userId } = useContext(UserContext);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [numOfCorrectAnswers, setNumOfCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuizQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://127.0.0.1:5000/api/quizzes/${quizId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const quizData = response.data;
      setQuizTitle(quizData.title);
      setQuizQuestions(quizData.questions);
      setError(null);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      setError('Failed to fetch quiz questions. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [quizId]); // Only add quizId as a dependency

  const handleQuizFinish = useCallback(async () => {
    const score = (numOfCorrectAnswers / quizQuestions.length) * 100;
    const totalQuestions = quizQuestions.length;
    const resultData = {
      user_id: userId,
      quiz_id: quizId,
      score: Math.round(score),
      total_questions: totalQuestions,
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://127.0.0.1:5000/api/results', resultData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Result sent successfully');
    } catch (error) {
      console.error('Error sending result:', error);
    }
  }, [userId, quizId, numOfCorrectAnswers, quizQuestions.length]);

  useEffect(() => {
    fetchQuizQuestions();
  }, [fetchQuizQuestions]); // Add fetchQuizQuestions as a dependency

  useEffect(() => {
    if (quizCompleted) {
      handleQuizFinish();
    }
  }, [quizCompleted, handleQuizFinish]); // Add handleQuizFinish as a dependency

  const handleNextQuestion = (isCorrectAnswer) => {
    setNumOfCorrectAnswers((prevCount) => prevCount + isCorrectAnswer);
    if (currentQuestionIndex + 1 >= quizQuestions.length) {
      setQuizCompleted(true);
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
      </div>
    );
  }

  const handleExitQuiz = () => {
    navigate('/');
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];
  return (
    <div className="quiz-questions">
      <h2>{quizTitle}</h2>
      {quizCompleted ? (
        <Card className="result-card">
          <CardContent>
            <Typography className="quiz-completed-title">
              Quiz Completed!
            </Typography>
            <Typography className="result-message">
              You answered {numOfCorrectAnswers} out of {quizQuestions.length}{' '}
              questions correctly! 🎉
            </Typography>
            <Typography className="encouragement-text">
              Great job! Click 'Exit Quiz' to return to the main menu.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <QuestionCard
          currentQuestion={currentQuestion}
          onNext={handleNextQuestion}
        />
      )}

      <Box className="exit-button-container">
        <Button variant="outlined" color="secondary" onClick={handleExitQuiz}>
          Exit Quiz
        </Button>
      </Box>
    </div>
  );
};

export default QuizQuestions;

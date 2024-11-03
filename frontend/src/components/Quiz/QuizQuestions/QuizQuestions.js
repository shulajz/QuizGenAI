import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Typography, Button, Box, CircularProgress } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import QuestionCard from '../QuestionCard/QuestionCard';
import ResultCard from '../ResultCard/ResultCard';
import { fetchQuizData, submitQuizResult } from '../../services/quizService';
import './QuizQuestions.scss';

const QuizQuestions = ({ quizId: propQuizId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useContext(UserContext);

  const quizId = propQuizId || location.state?.quizId;
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
      const quizData = await fetchQuizData(quizId);
      console.log('quizData--', quizData);
      if (quizData?.questions?.length) {
        setQuizTitle(quizData.title);
        setQuizQuestions(quizData.questions);
        setError(null);
      } else {
        setError('No quiz data available');
      }
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      setError('Failed to fetch quiz questions. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  const handleQuizFinish = useCallback(async () => {
    const score = (numOfCorrectAnswers / quizQuestions.length) * 100;
    await submitQuizResult({
      user_id: userId,
      quiz_id: quizId,
      score: Math.round(score),
      total_questions: quizQuestions.length,
    });
  }, [userId, quizId, numOfCorrectAnswers, quizQuestions?.length]);

  useEffect(() => {
    fetchQuizQuestions();
  }, [fetchQuizQuestions]);

  useEffect(() => {
    if (quizCompleted) {
      handleQuizFinish();
    }
  }, [quizCompleted, handleQuizFinish]);

  const handleNextQuestion = (isCorrectAnswer) => {
    setNumOfCorrectAnswers((prevCount) => prevCount + isCorrectAnswer);
    if (currentQuestionIndex + 1 >= quizQuestions.length) {
      setQuizCompleted(true);
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleExitQuiz = () => {
    navigate('/');
  };

  if (loading)
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <CircularProgress color="primary" size={50} />
        <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
          Loading quiz questions, please wait...
        </Typography>
      </Box>
    );

  if (error)
    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );

  return (
    <div className="quiz-questions">
      <h2>{quizTitle}</h2>
      {quizCompleted ? (
        <ResultCard
          numCorrect={numOfCorrectAnswers}
          totalQuestions={quizQuestions.length}
        />
      ) : (
        <QuestionCard
          currentQuestion={quizQuestions?.[currentQuestionIndex]}
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

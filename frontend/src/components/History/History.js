import React, { useEffect, useState, useContext } from 'react';
import {
  Typography,
  Box,
  List,
  ListItem,
  Button,
  Collapse,
  CircularProgress,
} from '@mui/material';
import { UserContext } from '../UserContext';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import './History.scss';

const History = () => {
  const { userId } = useContext(UserContext);
  const [quizzes, setQuizzes] = useState([]);
  const [expandedQuiz, setExpandedQuiz] = useState(null);
  const [error, setError] = useState(null);
  const [loadingQuizzes, setLoadingQuizzes] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/${userId}/quizzes`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setQuizzes(response.data);
      } catch (err) {
        setError('Failed to load quizzes');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) fetchQuizzes();
  }, [userId]);

  const handleTryAgain = (quizId) => {
    navigate(`/quiz/${quizId}`, { state: { quizId } });
  };

  const handleToggleExpand = (quizId) => {
    setExpandedQuiz(expandedQuiz === quizId ? null : quizId);
  };

  const handleDeleteQuiz = async (quizId) => {
    setLoadingQuizzes((prev) => ({ ...prev, [quizId]: true }));
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/quizzes/${quizId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
      console.log('Quiz deleted successfully');
    } catch (error) {
      console.error('Error deleting quiz:', error);
    } finally {
      setLoadingQuizzes((prev) => ({ ...prev, [quizId]: false }));
    }
  };

  if (error) {
    return (
      <Typography variant="body1" color="error">
        {error}
      </Typography>
    );
  }

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="history-container">
      <List>
        {quizzes.map((quiz, index) => (
          <ListItem key={index}>
            <Box className="quiz-box">
              <Box className="delete-icon-container">
                <DeleteIcon
                  className="delete-icon"
                  onClick={() => handleDeleteQuiz(quiz.id)}
                />
              </Box>

              <Box onClick={() => handleToggleExpand(quiz.id)}>
                <Typography variant="h6" component="h3" className="quiz-title">
                  {quiz.title}
                </Typography>
                <Typography variant="body2" component="p">
                  Best Score: {quiz?.['best_score']}%
                </Typography>
                <Typography variant="body2" component="p">
                  Average Score: {quiz?.['average_score']}%
                </Typography>
                <Typography variant="body2" component="p">
                  Total Attempts: {quiz.results.length}
                </Typography>
              </Box>

              <Box className="try-again-button">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleTryAgain(quiz.id)}
                >
                  Try Again
                </Button>
              </Box>

              <Collapse in={expandedQuiz === quiz.id}>
                <Box className="attempt-list">
                  {quiz.results.map((result, resultIndex) => (
                    <Box key={resultIndex} className="attempt-item">
                      <Typography
                        variant="body2"
                        component="p"
                        className="attempt-date"
                      >
                        Attempt on{' '}
                        {new Date(result.attempt_date).toLocaleString()}:
                      </Typography>
                      <Typography variant="body2" component="p">
                        Score: {result.score}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Collapse>

              {loadingQuizzes[quiz.id] && (
                <CircularProgress size={24} className="loading-spinner" />
              )}
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default History;

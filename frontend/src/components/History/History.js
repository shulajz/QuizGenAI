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
  const [loadingQuizzes, setLoadingQuizzes] = useState({}); // Track loading state for each quiz
  const navigate = useNavigate();
  console.log('userId--', userId);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/users/${userId}/quizzes`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        console.log('shula--', response.data);
        setQuizzes(response.data);
      } catch (err) {
        setError('Failed to load quizzes');
        console.error(err);
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
      await axios.delete(`http://127.0.0.1:5000/api/quizzes/${quizId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
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

  return (
    <Box className="history-container">
      <List>
        {quizzes.map((quiz, index) => (
          <ListItem key={index}>
            <Box
              className="quiz-box"
              style={{ position: 'relative' }}
              onClick={() => handleToggleExpand(quiz.id)}
            >
              <DeleteIcon
                sx={{
                  cursor: 'pointer',
                  width: '30px',
                  height: '30px',
                  position: 'absolute',
                  top: '25x',
                  right: '25px',
                  '&:hover': {
                    transform: 'scale(1.2)',
                    color: 'blue',
                  },
                }}
                onClick={() => handleDeleteQuiz(quiz.id)}
              />
              <Typography variant="h6" component="h3" className="quiz-title">
                {quiz.title}
              </Typography>
              <Typography variant="body2" component="p">
                Best Score: {quiz?.['best_score']}
              </Typography>
              <Typography variant="body2" component="p">
                Average Score: {quiz?.['average_score']}
              </Typography>
              <Typography variant="body2" component="p">
                Total Attempts: {quiz.results.length}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleTryAgain(quiz.id)}
                sx={{ marginTop: '10px' }}
              >
                Try Again
              </Button>
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
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    right: '50%',
                    marginLeft: '-12px',
                    marginTop: '-12px',
                  }}
                />
              )}
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default History;

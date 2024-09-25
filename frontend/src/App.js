import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import QuizQuestions from './components/QuizQuestions';
import PdfUpload from './components/PdfUpload';
import { Button } from '@mui/material';

import './App.scss';

const App = () => {
  const [showPdfUpload, setShowPdfUpload] = useState(true);
  const [showQuizPage, setShowQuizPage] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);

  const handleSuccessPdf = (quizQuestions) => {
    console.log('quizQuestions---', quizQuestions);
    setQuizQuestions(quizQuestions.questions);
    setShowPdfUpload(false);
    setShowQuizPage(true);
  };

  const handleReturn = () => {
    setShowQuizPage(false);
    setShowPdfUpload(true);
  };

  console.log('questions?.length', quizQuestions?.length);
  return (
    <Container className="container" maxWidth="sm">
      <Typography variant="h4" className="title" gutterBottom>
        Welcome to Your Trivia Game
      </Typography>
      <div>
        {showPdfUpload && <PdfUpload onSuccess={handleSuccessPdf} />}
        {showQuizPage && quizQuestions?.length > 0 && (
          <>
            <QuizQuestions quizQuestions={quizQuestions} />
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReturn}
              sx={{ mt: 2 }}
            >
              Exit
            </Button>
          </>
        )}
      </div>
    </Container>
  );
};

export default App;

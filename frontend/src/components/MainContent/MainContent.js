import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import PdfUpload from '../PdfUpload/PdfUpload';
import QuizQuestions from '../QuizQuestions/QuizQuestions';
import './MainContent.scss';

const MainContent = () => {
  const [quizState, setQuizState] = useState({
    showQuizPage: false,
    quizQuestions: [],
  });

  const handlePdfSuccess = (quizQuestions) => {
    setQuizState({
      showQuizPage: true,
      quizQuestions: quizQuestions.questions,
    });
  };

  const handleExitQuiz = () => {
    setQuizState({
      showQuizPage: false,
      quizQuestions: [],
    });
  };

  return (
    <Box>
      {quizState.showQuizPage ? (
        <>
          <QuizQuestions quizQuestions={quizState.quizQuestions} />
          <Box className="exit-button-container">
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleExitQuiz}
            >
              Exit Quiz
            </Button>
          </Box>
        </>
      ) : (
        <Box className="pdf-upload-container">
          <PdfUpload onSuccess={handlePdfSuccess} />
        </Box>
      )}
    </Box>
  );
};

export default MainContent;

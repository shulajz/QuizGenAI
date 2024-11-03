import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import PdfUpload from '../PdfUpload/PdfUpload';
import QuizQuestions from '../QuizQuestions/QuizQuestions';
import './MainContent.scss';

const MainContent = () => {
  const [quizState, setQuizState] = useState({
    showQuizPage: false,
    quizId: null,
  });

  const handlePdfSuccess = (quizId) => {
    setQuizState({
      showQuizPage: true,
      quizId: quizId,
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
        <QuizQuestions quizId={quizState.quizId} />
      ) : (
        <Box className="pdf-upload-container">
          <PdfUpload onSuccess={handlePdfSuccess} />
        </Box>
      )}
    </Box>
  );
};

export default MainContent;

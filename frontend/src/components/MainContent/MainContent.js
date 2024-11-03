import React, { useState } from 'react';
import { Box } from '@mui/material';
import PdfUpload from '../PdfUpload/PdfUpload';
import QuizQuestions from '../Quiz/QuizQuestions/QuizQuestions';
import TopicInput from '../TopicInput/TopicInput';
import './MainContent.scss';

const MainContent = () => {
  const [quizState, setQuizState] = useState({
    showQuizPage: false,
    quizId: null,
  });

  const handleQuizGenerated = (quizId) => {
    setQuizState({
      showQuizPage: true,
      quizId: quizId,
    });
  };

  if (quizState.showQuizPage) {
    return <QuizQuestions quizId={quizState.quizId} />;
  }

  return (
    <Box className="main-content">
      <Box className="quiz-options-container">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={4}
          className="input-upload-container"
        >
          <TopicInput onQuizGenerated={handleQuizGenerated} />

          <PdfUpload onSuccess={handleQuizGenerated} />
        </Box>
      </Box>
    </Box>
  );
};

export default MainContent;

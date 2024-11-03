import React from 'react';
import { Route, Navigate, Routes } from 'react-router-dom';
import Welcome from './Welcome/Welcome';
import AuthComponent from './AuthComponent';
import MainContent from './MainContent/MainContent';
import History from './History/History';
import QuizQuestions from './QuizQuestions/QuizQuestions';

const RoutesComponent = ({ isSignedIn, handleSignIn }) => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          !isSignedIn ? (
            <>
              <Welcome />
              <AuthComponent onSignIn={handleSignIn} />
            </>
          ) : (
            <Navigate to="/main" />
          )
        }
      />
      <Route
        path="/main"
        element={isSignedIn ? <MainContent /> : <Navigate to="/" />}
      />
      <Route
        path="/history"
        element={isSignedIn ? <History /> : <Navigate to="/" />}
      />
      <Route path="/quiz/:quizId" element={<QuizQuestions />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default RoutesComponent;

import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Container, Paper } from '@mui/material';
import { theme } from './theme/theme';
import Layout from './components/Layout/Layout';
import Header from './components/Header/Header';
import Welcome from './components/Welcome/Welcome';
import AuthComponent from './components/AuthComponent';
import MainContent from './components/MainContent/MainContent';
import './App.scss';

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsSignedIn(!!token);
  }, []);

  const handleSignIn = () => setIsSignedIn(true);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsSignedIn(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Header isSignedIn={isSignedIn} onSignOut={handleSignOut} />
        <Container maxWidth="lg" className="main-container">
          {!isSignedIn && <Welcome />}
          <Paper className="content-paper">
            {isSignedIn ? (
              <MainContent />
            ) : (
              <AuthComponent onSignIn={handleSignIn} />
            )}
          </Paper>
        </Container>
      </Layout>
    </ThemeProvider>
  );
};

export default App;

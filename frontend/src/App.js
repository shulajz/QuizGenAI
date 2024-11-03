import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Container, Paper } from '@mui/material';
import { theme } from './theme/theme';
import Layout from './components/Layout/Layout';
import Header from './components/Header/Header';
import RoutesComponent from './components/Routes';
import { UserProvider } from './components/UserContext';
import './App.scss';
import { BrowserRouter } from 'react-router-dom';

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
    <UserProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Layout>
            <Header isSignedIn={isSignedIn} onSignOut={handleSignOut} />
            <Container maxWidth="lg" className="main-container">
              <RoutesComponent
                isSignedIn={isSignedIn}
                handleSignIn={handleSignIn}
              />
            </Container>
          </Layout>
        </ThemeProvider>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;

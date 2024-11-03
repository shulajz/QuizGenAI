import React, { useState } from 'react';
import {
  Button,
  Typography,
  Box,
  LinearProgress,
  Paper,
  Alert,
  IconButton,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import './PdfUpload.scss';

const PdfUpload = ({ onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setErrorMessage('');
    } else {
      setSelectedFile(null);
      setErrorMessage('Please select a valid PDF file.');
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      setLoading(true);
      setProgress(0);

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentCompleted);
            },
          }
        );

        console.log('File uploaded successfully:', response.data);
        onSuccess(response.data.quizId);
      } catch (error) {
        setLoading(false);
        setProgress(0);
        if (error.response) {
          setErrorMessage('An error occurred on the server. Please try again.');
        } else {
          setErrorMessage(
            'An unexpected error occurred. Please check your connection and try again.'
          );
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setProgress(0);
    setErrorMessage('');
  };

  return (
    <Paper elevation={3} className="pdf-upload-paper">
      <Box className="pdf-upload-content">
        <Typography variant="h6" gutterBottom align="center">
          Upload PDF to Generate Quiz
        </Typography>
        <Box className="upload-box">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="file-input"
          />
          {selectedFile ? (
            <Box className="selected-file">
              <Typography variant="body2" noWrap>
                {selectedFile.name}
              </Typography>
              <IconButton size="small" onClick={handleRemoveFile}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ) : (
            <Box className="upload-placeholder">
              <CloudUploadIcon className="upload-icon" />
              <Typography variant="body2">
                Click or drag to upload PDF
              </Typography>
            </Box>
          )}
        </Box>

        {selectedFile && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={loading}
            className="upload-button"
            startIcon={
              loading ? <CheckCircleOutlineIcon /> : <CloudUploadIcon />
            }
          >
            {loading ? 'Uploading...' : 'Upload PDF'}
          </Button>
        )}
        {loading && (
          <Box className="progress-container">
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="body2" color="text.secondary" align="center">
              {`${Math.round(progress)}%`}
            </Typography>
          </Box>
        )}
        {errorMessage && (
          <Alert severity="error" className="error-alert">
            {errorMessage}
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default PdfUpload;

import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import axios from 'axios';

const PdfUpload = ({ onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setErrorMessage('');
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      setLoading(true);

      try {
        const response = await axios.post(
          'http://127.0.0.1:5000/api/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        console.log('File uploaded successfully:', response.data);
        onSuccess(response.data.quiz);
      } catch (error) {
        setLoading(false); // Stop loading
        if (error.response) {
          setErrorMessage('An error occurred on the server.');
        } else {
          setErrorMessage(
            'An unexpected error occurred. Please check your input and try again.'
          );
        }
      }
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!selectedFile || loading}
      >
        {loading ? 'Uploading...' : 'Upload PDF'}
      </Button>
      {errorMessage && (
        <Typography color="error" variant="body2">
          {errorMessage}
        </Typography>
      )}
    </div>
  );
};

export default PdfUpload;

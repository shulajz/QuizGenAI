import axios from 'axios';

const API_BASE_URL = 'api';

export const fetchQuizData = async (quizId) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_BASE_URL}/quizzes/${quizId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const submitQuizResult = async (resultData) => {
  const token = localStorage.getItem('token');
  await axios.post(`${API_BASE_URL}/results`, resultData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

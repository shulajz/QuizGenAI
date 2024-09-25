import React, { useState } from 'react';
import Dropdown from './Dropdown';
import axios from 'axios';
import useDataFetcher from './useDataFetcher';
import './QuizForm.scss';

const QuizForm = ({ onSubmit }) => {
  const {
    data: categories,
    loading,
    error,
  } = useDataFetcher('https://opentdb.com/api_category.php');
  const [numQuestions, setNumQuestions] = useState(5);
  const [category, setCategory] = useState('any');
  const [difficulty, setDifficulty] = useState('any');

  const handleSelection = (setter) => (value) => {
    setter(value);
    console.log(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      numQuestions,
      category,
      difficulty,
    };

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/api/request-quiz',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      onSubmit(response?.data?.quizQuestions);
      console.log('Form submission result:', response.data.quizQuestions);
    } catch (error) {
      console.error('Form submission error:', error);
    }

    console.log('Form submitted with values:', {
      numQuestions,
      category,
      difficulty,
    });
  };

  const difficultyOptions = [
    { value: 'any', label: 'Any difficulty' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <form className="quiz-form" onSubmit={handleSubmit}>
      <Dropdown
        label="Number of Questions"
        value={numQuestions}
        options={[
          { value: 1, label: '1' },
          { value: 5, label: '5' },
          { value: 10, label: '10' },
          { value: 15, label: '15' },
          { value: 20, label: '20' },
        ]}
        onChange={handleSelection(setNumQuestions)}
      />
      <Dropdown
        label="Select Category"
        value={category}
        options={[
          { value: 'any', label: 'Any category' },
          ...(categories?.trivia_categories?.map((cat) => ({
            value: cat.id,
            label: cat.name,
          })) || []),
        ]}
        onChange={handleSelection(setCategory)}
      />
      <Dropdown
        label="Select Difficulty"
        value={difficulty}
        options={difficultyOptions}
        onChange={handleSelection(setDifficulty)}
      />

      <button type="submit" className="submit-button">
        Lets start!
      </button>
    </form>
  );
};

export default QuizForm;

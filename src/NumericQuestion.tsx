import React, { useState, useMemo } from 'react';
import './App.css';
import NumericQuestionLayout from './components/NumericQuestionLayout';
import { numericQuestions } from './numericQuestions';

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function NumericQuestion() {
  // Create a shuffled array of indices that will be used to cycle through all questions
  const shuffledIndices = useMemo(() => shuffleArray(Array.from({ length: numericQuestions.length }, (_, i) => i)), []);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentShuffledIndices, setCurrentShuffledIndices] = useState(shuffledIndices);

  const handleNextQuestion = () => {
    setCurrentPosition((prevPosition) => {
      const nextPosition = prevPosition + 1;
      
      // If we've used all questions, reshuffle and start over
      if (nextPosition >= currentShuffledIndices.length) {
        const newShuffled = shuffleArray(Array.from({ length: numericQuestions.length }, (_, i) => i));
        setCurrentShuffledIndices(newShuffled);
        return 0;
      }
      
      return nextPosition;
    });
  };

  const currentIndex = currentShuffledIndices[currentPosition];

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <NumericQuestionLayout key={`${currentIndex}-${currentPosition}`} question={numericQuestions[currentIndex]} onNextQuestion={handleNextQuestion} />
    </div>
  );
}

export default NumericQuestion;


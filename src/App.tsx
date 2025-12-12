import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MapView from './MapView';
import ChoiceQuestion from './ChoiceQuestion';
import NumericQuestion from './NumericQuestion';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MapView />} />
        <Route path="/question" element={<ChoiceQuestion />} />
        <Route path="/numeric-question" element={<NumericQuestion />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MapView from './MapView';
import ChoiceQuestion from './ChoiceQuestion';
import NumericQuestion from './NumericQuestion';

function App() {
  // Get the basename from the homepage field in package.json
  // For GitHub Pages, this will be '/triviador'
  const basename = process.env.PUBLIC_URL || '/triviador';
  
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<MapView />} />
        <Route path="/question" element={<ChoiceQuestion />} />
        <Route path="/numeric-question" element={<NumericQuestion />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import EducationCardDetail from './components/EducationCardDetail';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/education/:cardId" element={<EducationCardDetail />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
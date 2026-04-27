import { Routes, Route } from 'react-router-dom';
// Ensure these paths match your folder structure exactly
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AssessmentPage from './pages/AssessmentPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/assessment" element={<AssessmentPage />} />
    </Routes>
  );
}
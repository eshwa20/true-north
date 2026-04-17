<<<<<<< HEAD
import { Routes, Route } from 'react-router-dom';
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
=======
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Ensure these paths match your folder structure exactly
import HomePage       from './pages/home-page';
import LoginPage      from './pages/login-page';
import AssessmentPage from './pages/assessment-page';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"           element={<HomePage />} />
        <Route path="/login"      element={<LoginPage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
      </Routes>
    </Router>
  );
>>>>>>> f6760fc (initial commit)
}
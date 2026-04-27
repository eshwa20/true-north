import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from "react";

// Pages
import HomePage from './pages/home-page';
import LoginPage from './pages/login-page';
import Assessment from './pages/Assessment';
import ResumePage from "./pages/ResumePage";
import ResumeScorer from "./pages/ResumeScorer";
import Settings from "./pages/Settings";
import Achievements from './pages/Achievements';
import HistoryPage from "./pages/HistoryPage";
import ChatBot from "./pages/ChatBot";


// Auth
import ProtectedRoute from "./pages/ProtectedRoute";
import { isAuthenticated, logout } from "./auth";

// 1. Create a sub-component for the logic and routes
function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        // If they aren't authenticated and aren't on a public page, kick them out
        if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
          logout(); // Clear storage
          navigate("/login");
        }
      }
    };

    const interval = setInterval(checkAuth, 2000);
    window.addEventListener("storage", checkAuth);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", checkAuth);
    };
  }, [navigate]);

  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* PROTECTED */}
      <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
      <Route path="/resume" element={<ProtectedRoute><ResumePage /></ProtectedRoute>} />
      <Route path="/resume-scorer" element={<ProtectedRoute><ResumeScorer /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
    </Routes>
  );
}

// 2. Your main App component just provides the Router context
export default function App() {
  return (
    <Router>
      <AppContent />
      {isAuthenticated() && <ChatBot />}
    </Router>
  );
}
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home-page';
import AuthPage from "./pages/login-page";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* ADD THIS LINE BELOW */}
        <Route path="/login" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}
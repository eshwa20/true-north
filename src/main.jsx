import { StrictMode } from 'react';
import "./index.css";
import { createRoot } from 'react-dom/client';
import App from './App.jsx'; // Added .jsx extension for clarity

// Inject Font Awesome
const faLink = document.createElement('link');
faLink.rel = 'stylesheet';
faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
document.head.appendChild(faLink);

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.error("Critical Error: Could not find the 'root' element in index.html");
}
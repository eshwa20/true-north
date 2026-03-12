import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Font Awesome CDN — keeps icon support without an npm package
const faLink = document.createElement('link');
faLink.rel = 'stylesheet';
faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
document.head.appendChild(faLink);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
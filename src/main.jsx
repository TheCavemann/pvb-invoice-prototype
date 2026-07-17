import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { KycProvider } from './context/KycContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <KycProvider>
        <App />
      </KycProvider>
    </BrowserRouter>
  </StrictMode>,
);

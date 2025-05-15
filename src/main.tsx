
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { ToastProvider } from '@/contexts/ToastContext';

// Function to initialize the application
function initializeApp() {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Failed to find the root element');
    return;
  }

  const root = createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <ToastProvider>
          <App />
        </ToastProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

// Check if the document is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // Document already loaded, initialize immediately
  initializeApp();
}

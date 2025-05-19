
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize the root element
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Render the app with the new title "LAWerp500"
createRoot(rootElement).render(<App />);

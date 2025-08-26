import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { UserProvider } from './Components/useUserContext';
import ErrorBoundary from './Components/ErrorBoundary';
import './index.css';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <UserProvider>
          <App />
        </UserProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
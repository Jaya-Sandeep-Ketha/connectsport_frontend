import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './Components/LoginForm';
import RegisterForm from './Components/RegisterForm';
import HomePage from './Components/HomePage';
// import NotFoundPage from './Components/NotFoundPage'; // Ensure you have this component for handling 404 errors
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

// A functional ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem("token")); // Example check for authentication token

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route 
          path="/home/:userId" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        {/* <Route path="*" element={<NotFoundPage />} /> Handle unmatched routes */}
      </Routes>
    </Router>
  );
}

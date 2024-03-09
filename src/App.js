import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './pages/Login_Register_Page/login_form';
import RegisterForm from './pages/Login_Register_Page/register_form';
import HomePage from './pages/Home_Page/index';
import ForgotPassword from './pages/Login_Register_Page/ForgetPassword';
// import NotFoundPage from './Components/NotFoundPage'; // Ensure this component exists for handling 404 errors
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import SettingsPage from './pages/Settings';

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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        {/* <Route path="*" element={<NotFoundPage />} /> Uncomment and ensure this component for handling unmatched routes */}
      </Routes>
    </Router>
  );
}

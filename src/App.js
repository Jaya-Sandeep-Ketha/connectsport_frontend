import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginForm from "./pages/Login_Register_Page/login_form";
import RegisterForm from "./pages/Login_Register_Page/register_form";
import HomePage from "./pages/Home_Page/index";
import ForgotPassword from "./pages/Login_Register_Page/ForgetPassword";
import SettingsPage from "./pages/Settings";
import ChatApp from "./pages/Messaging";
// import NotFoundPage from './Components/NotFoundPage'; // Ensure this component exists for handling 404 errors
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

// A functional ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem("token")); // Check for authentication token
  return isAuthenticated ? children : <Navigate to="/login" replace />;
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
          path="/:userId/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:userId/messages"
          element={
            <ProtectedRoute>
              <ChatApp />
            </ProtectedRoute>
          }
        />
        {/* <Route path="*" element={<NotFoundPage />} /> Uncomment for handling unmatched routes */}
      </Routes>
    </Router>
  );
}

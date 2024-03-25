import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook from React Router

// HomePage component
const MainPage = () => {
  const navigate = useNavigate(); // Hook to navigate to different routes

  // Function to handle the login redirect
  const handleLoginRedirect = () => {
    navigate(`/login`); // Redirecting to the login page
  };

  return (
    <div className="home-page">
      <h1>Welcome to the Main Home Page</h1>
      <button onClick={handleLoginRedirect}>Login</button> {/* Login button */}
    </div>
  );
};

export default MainPage;

import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('userName') ? JSON.parse(localStorage.getItem('userName')).name : null;
        console.log('useAuth useEffect:', { token, user }); // Debugging line

        setIsLoggedIn(!!token);
        setCurrentUser(user);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        setIsLoggedIn(false);
        setCurrentUser(null);
        navigate("/login");
    };

    return { isLoggedIn, currentUser, handleLogout };
};

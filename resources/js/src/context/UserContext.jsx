import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            fetchUserData(token); // Fetch user data if token is present
        }
    }, []);

    const fetchUserData = async (token) => {
        try {
            const response = await fetch('http://localhost:8001/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const userData = await response.json();
            setUser(userData); // Set user data in context
            console.log('Fetched user data:', userData);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setUser(null); // Clear user data on error
        }
    };

    const login = async (token) => {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);

        // Fetch user data after setting the token
        await fetchUserData(token); // Await the fetch to ensure user data is set
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null); // Clear user data
    };

    return (
        <UserContext.Provider value={{ user, isLoggedIn, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);

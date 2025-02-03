import React from 'react';
import { useNavigate } from 'react-router-dom';


const NotFound = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="not-found-wrapper">
            <div className="background-image"></div>
            <div className="not-found-container">
                <h1 className="error404">404</h1>
                <h1>Page Not Found</h1>
                <p>The page you are looking for does not exist.</p>
                <button onClick={handleGoHome} className="go-home-button">GO HOME</button>
            </div>
        </div>
    );
};

export default NotFound;

import React from 'react';
import { Link } from 'react-router-dom';
// import './ThankYouPage.css';

const ThankYouPage = () => {
    return (
        <div className="thank-you-container">
            <div className="text-box">
                <h1>Thank You for Your Order!</h1>
                <p>Your order has been successfully placed.</p>
                <p>An email confirmation has been sent to your inbox.</p>
                <p>If you have any questions, feel free to contact our support team.</p>
                <Link to="/" className="btn-home">GO HOME</Link>
            </div>
        </div>
    );
};

export default ThankYouPage;

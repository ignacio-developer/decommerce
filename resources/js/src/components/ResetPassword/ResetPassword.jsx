import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './ResetPassword.module.css';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showResetForm, setShowResetForm] = useState(false); // State to manage reset form visibility
    const navigate = useNavigate();

    const handleSendCode = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post('http://localhost:8001/reset-password', {
                email,
            });

            setMessage('A password reset code has been sent to your email.');
            setShowResetForm(true); // Show the reset password form
            console.log('Reset password code sent');
        } catch (err) {
            console.error(err);
            setError("No account found with that email. Please double-check and try again.");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8001/update-password', {
                email,
                reset_code: resetCode,
                new_password: newPassword,
                new_password_confirmation: confirmPassword,
            });

            setMessage('Your password has been reset successfully.');
            console.log('Password reset successful');
            navigate('/login');
        } catch (err) {
            console.error(err);
            setError('Invalid password reset code.');
        }
    };

    return (
        <div className={styles['login-wrapper']}>
            <div className={styles.wrapper}>
                {!showResetForm ? (
                    <form onSubmit={handleSendCode}>
                        <h1>Reset Password</h1>
                        <div className={styles['input-box']}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <i className='bx bxs-envelope'></i>
                        </div>
                        {message && <p className={styles['success-message']}>{message}</p>}
                        {error && <p className={styles['error-message']}>{error}</p>}
                        <button type="submit" className={styles.btn}>Send Reset Code</button>
                        <div className={styles['register-link']}>
                            <p>Remembered your password? <a href="/login">Login</a></p>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword}>
                        <h1>Create New Password</h1>
                        <div className={styles['input-box']}>
                            <input
                                type="text"
                                placeholder="Enter reset code"
                                value={resetCode}
                                onChange={(e) => setResetCode(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles['input-box']}>
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles['input-box']}>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        {message && <p className={styles['success-message']}>{message}</p>}
                        {error && <p className={styles['error-message']}>{error}</p>}
                        <button type="submit" className={styles.btn}>Reset Password</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;

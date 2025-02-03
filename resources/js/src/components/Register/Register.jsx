import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css'; // Assuming the styling is in ResetPassword.module.css

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value.trim(),
        });
    };

    const validateForm = () => {
        let formErrors = {};

        if (!formData.name) formErrors.name = "Name is required.";
        if (!formData.email) formErrors.email = "Email is required.";
        if (!formData.password) formErrors.password = "Password is required.";
        if (formData.password !== formData.password_confirmation) {
            formErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post('http://localhost:8001/register', formData);
                setSuccess(true);
                setErrorMessage('');
                navigate('/login');
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    password_confirmation: '',
                });
            } catch (error) {
                if (error.response && error.response.data.errors) {
                    setErrorMessage(Object.values(error.response.data.errors).flat().join(', '));
                } else {
                    setErrorMessage(error.response.data.message || 'Registration failed. Please try again.');
                }
                setSuccess(false);
            }
        } else {
            setSuccess(false);
        }
    };

    return (
        <div className={styles['login-wrapper']}>
            <div className={styles.wrapper}>
                <h1>Register</h1>
                {success && <p className={styles['success-message']}>Registration successful!</p>}
                {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div className={styles['input-box']}>
                        <input
                            type="text"
                            placeholder="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        {errors.name && <p className={styles['error-message']}>{errors.name}</p>}
                    </div>

                    <div className={styles['input-box']}>
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && <p className={styles['error-message']}>{errors.email}</p>}
                    </div>

                    <div className={styles['input-box']}>
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && <p className={styles['error-message']}>{errors.password}</p>}
                    </div>

                    <div className={styles['input-box']}>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            required
                        />
                        {errors.confirmPassword && <p className={styles['error-message']}>{errors.confirmPassword}</p>}
                    </div>

                    <button type="submit" className={styles.btn}>Register</button>
                    <div className={styles['register-link']}>
                        <p>Already have an account? <a href="/login">Login</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;

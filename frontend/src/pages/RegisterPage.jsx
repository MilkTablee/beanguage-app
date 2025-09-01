import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isUsernameFocused, setIsUsernameFocused] = useState(false);
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [usernameStatus, setUsernameStatus] = useState({
        loading: false,
        available: null, // null: not checked, true: available, false: taken
        message: '',
    });
    const [emailStatus, setEmailStatus] = useState({
        loading: false,
        available: null,
        message: '',
    });
    const usernameCheckTimeoutRef = useRef(null);
    const emailCheckTimeoutRef = useRef(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:3001/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to register');
            }

            // On successful registration, redirect to the login page
            navigate('/login');

        } catch (err) {
            setError(err.message);
        }
    };

    // Debounce username availability check
    useEffect(() => {
        // Clear any existing timeout
        if (usernameCheckTimeoutRef.current) {
            clearTimeout(usernameCheckTimeoutRef.current);
        }

        // Only check if username is not empty (and trim whitespace)
        if (username.trim().length > 0) {
            setUsernameStatus({ loading: true, available: null, message: 'Checking availability...' });

            usernameCheckTimeoutRef.current = setTimeout(async () => {
                try {
                    const response = await fetch(`http://localhost:3001/api/check-username?username=${username}`);
                    const data = await response.json();

                    if (response.ok) {
                        setUsernameStatus({
                            loading: false,
                            available: data.available,
                            message: data.available ? 'Username is available!' : 'Username is already taken.',
                        });
                    } else {
                        setUsernameStatus({
                            loading: false,
                            available: null, // Indicate an error or unable to check
                            message: data.message || 'Error checking username.',
                        });
                    }
                } catch (err) {
                    setUsernameStatus({
                        loading: false,
                        available: null,
                        message: 'Network error checking username.',
                    });
                }
            }, 500); // Debounce for 500ms
        } else {
            setUsernameStatus({ loading: false, available: null, message: '' });
        }
    }, [username]); // Re-run this effect whenever the username changes

    // Debounce email availability check
    useEffect(() => {
        if (emailCheckTimeoutRef.current) {
            clearTimeout(emailCheckTimeoutRef.current);
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.trim().length > 0) {
            if (!emailRegex.test(email)) {
                setEmailStatus({ loading: false, available: false, message: 'Please enter a valid email.' });
                return;
            }

            setEmailStatus({ loading: true, available: null, message: 'Checking availability...' });

            emailCheckTimeoutRef.current = setTimeout(async () => {
                try {
                    const response = await fetch(`http://localhost:3001/api/check-email?email=${email}`);
                    const data = await response.json();

                    if (response.ok) {
                        setEmailStatus({
                            loading: false,
                            available: data.available,
                            message: data.available ? '' : 'Email is already registered.',
                        });
                    } else {
                        setEmailStatus({ loading: false, available: null, message: data.message || 'Error checking email.' });
                    }
                } catch (err) {
                    setEmailStatus({
                        loading: false,
                        available: null,
                        message: 'Network error checking email.',
                    });
                }
            }, 500);
        } else {
            setEmailStatus({ loading: false, available: null, message: '' });
        }
    }, [email]);

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="p-8 bg-white rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username} // Controlled component
                            onChange={(e) => {
                                setUsername(e.target.value);
                                // Clear previous error messages related to username on change
                                if (error.includes('Username is already taken')) {
                                    setError('');
                                }
                            }}
                            onFocus={() => setIsUsernameFocused(true)}
                            onBlur={() => setIsUsernameFocused(false)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                        {/* This container reserves space to prevent layout shifts */}
                        <div className="h-5 mt-1">
                            {isUsernameFocused && usernameStatus.message && (
                                <p className={`text-sm ${
                                    usernameStatus.loading ? 'text-gray-500' :
                                    usernameStatus.available ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {usernameStatus.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (error.includes('email already exists')) {
                                    setError('');
                                }
                            }}
                            onFocus={() => setIsEmailFocused(true)}
                            onBlur={() => setIsEmailFocused(false)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                        <div className="h-5 mt-1">
                            {isEmailFocused && emailStatus.message && (
                                <p className={`text-sm ${
                                    emailStatus.loading ? 'text-gray-500' :
                                    emailStatus.available ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {emailStatus.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full text-white py-2 rounded-lg transition-colors ${
                            usernameStatus.available === false || usernameStatus.loading ||
                            emailStatus.available === false || emailStatus.loading
                            ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}`}
                        disabled={usernameStatus.available === false || usernameStatus.loading ||
                                  emailStatus.available === false || emailStatus.loading}
                    >Register</button>
                </form>
                <p className="text-center mt-4">
                    Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login here</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
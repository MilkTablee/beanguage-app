import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [usernameAvailable, setUsernameAvailable] = useState(null); // null: not checked, true: available, false: taken
    const [usernameCheckLoading, setUsernameCheckLoading] = useState(false);
    const [usernameCheckMessage, setUsernameCheckMessage] = useState('');
    const usernameCheckTimeoutRef = useRef(null); // Ref to store the timeout ID for debouncing
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

        // Only check if username is not empty
        if (username.length > 0) {
            setUsernameCheckLoading(true);
            //setUsernameCheckMessage('Checking availability...');
            setUsernameAvailable(null); // Reset availability status

            usernameCheckTimeoutRef.current = setTimeout(async () => {
                try {
                    const response = await fetch(`http://localhost:3001/api/check-username?username=${username}`);
                    const data = await response.json();

                    if (response.ok) {
                        setUsernameAvailable(data.available);
                        setUsernameCheckMessage(data.available ? 'Username is available!' : 'Username is already taken.');
                    } else {
                        setUsernameAvailable(null); // Indicate an error or unable to check
                        setUsernameCheckMessage(data.message || 'Error checking username.');
                    }
                } catch (err) {
                    setUsernameAvailable(null);
                    setUsernameCheckMessage('Network error checking username.');
                } finally {
                    setUsernameCheckLoading(false);
                }
            }, 500); // Debounce for 500ms
        } else {
            setUsernameAvailable(null);
            setUsernameCheckLoading(false);
            setUsernameCheckMessage('');
        }
    }, [username]); // Re-run this effect whenever the username changes

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
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
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
                    {usernameCheckLoading && <p className="text-sm text-gray-500 mb-2">Checking username...</p>}
                    {usernameCheckMessage && (
                        <p className={`text-sm mb-2 ${usernameAvailable ? 'text-green-600' : 'text-red-600'}`}>
                            {usernameCheckMessage}
                        </p>
                    )}
                    <button
                        type="submit"
                        className={`w-full text-white py-2 rounded-lg transition-colors ${usernameAvailable === false || usernameCheckLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}`}
                        disabled={usernameAvailable === false || usernameCheckLoading}
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
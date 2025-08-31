import React, { forwardRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// We use `forwardRef` to pass the `ref` from `App.jsx` to the underlying <header> element.
const Header = forwardRef(({ isSticky }, ref) => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Base classes that are always applied
    const baseClasses = "bg-white shadow-md w-full z-10 transition-all duration-300";

    // Conditionally add 'fixed top-0' if the header is sticky
    const stickyClasses = isSticky ? 'fixed top-0' : '';

    return (
        <header ref={ref} className={`${baseClasses} ${stickyClasses}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                    Beanguage
                </Link>
                {isAuthenticated && (
                    <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-colors">
                        Logout
                    </button>
                )}
            </div>
        </header>
    );
});

export default Header;
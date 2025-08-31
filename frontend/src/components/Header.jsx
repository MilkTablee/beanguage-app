import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';

// We use `forwardRef` to pass the `ref` from `App.jsx` to the underlying <header> element.
const Header = forwardRef(({ isSticky }, ref) => {
    // Base classes that are always applied
    const baseClasses = "bg-white shadow-md w-full z-10 transition-all duration-300";

    // Conditionally add 'fixed top-0' if the header is sticky
    const stickyClasses = isSticky ? 'fixed top-0' : '';

    return (
        <header ref={ref} className={`${baseClasses} ${stickyClasses}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                    Beanguage
                </Link>
            </div>
        </header>
    );
});

export default Header;
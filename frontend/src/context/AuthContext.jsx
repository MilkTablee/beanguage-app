import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    // For now, store the authentication state in memory.
    // TODO: Later, enhance this to use localStorage to persist the session
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = () => {
        // TODO: Handle token here
        setIsAuthenticated(true);
    };
    
    const logout = () => {
        // TODO: Clear the token/session data
        setIsAuthenticated(false);
    };

    const value = {
        isAuthenticated,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// A custom hook to make it easier to use the auth context.
export function useAuth() {
    return useContext(AuthContext);
}
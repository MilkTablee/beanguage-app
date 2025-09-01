import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY = 'user_token';

export function AuthProvider({ children }) {
    // Initialise the token state from localStorage.
    // This makes the session persistent across page reloads.
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

    // The login function now accepts a token, saves it to localStorage,
    // and updates the state.
    const login = (newToken) => {
        localStorage.setItem(TOKEN_KEY, newToken);
        setToken(newToken);
    };
    
    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
    };

    // The user is authenticated if a token exists. This is derived state.
    const isAuthenticated = !!token;

    const value = {
        token,
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
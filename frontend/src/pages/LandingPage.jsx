import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-pink-200 to-yellow-200">
      <h1 className="text-5xl font-bold mb-4 text-gray-800">Beanguage</h1>
      <p className="text-lg text-gray-600 mb-8">Learn, save, and quiz your Malay words.</p>
      <div className="space-x-4">
        <Link to="/login" className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors">Login</Link>
        <Link to="/register" className="px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-colors">Sign Up</Link>
      </div>
    </div>
  );
}
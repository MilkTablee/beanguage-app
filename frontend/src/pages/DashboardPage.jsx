import React from 'react';

function DashboardPage() {
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Selamat Datang!</h1>
                <p className="text-xl text-gray-700 mb-8">Welcome to your Malay Vocabulary App.</p>
                
                <div className="text-left bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4">Your Words</h2>
                    <p className="text-gray-500 mb-6">Your saved words will appear here soon...</p>

                    {/* Filler content to demonstrate scrolling */}
                    <div className="space-y-4">
                        {Array.from({ length: 50 }).map((_, i) => (
                            <div key={i} className="p-4 bg-gray-200 rounded-lg animate-pulse">
                                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;

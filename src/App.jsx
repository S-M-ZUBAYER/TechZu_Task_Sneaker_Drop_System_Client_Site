import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import { useAuthStore } from './store/useAuthStore';

function App() {
    const { initAuth } = useAuthStore();

    useEffect(() => {
        // Initialize auth from localStorage on app mount
        initAuth();
    }, [initAuth]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Toast Notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#fff',
                        color: '#363636',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />

            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main>
                <Dashboard />
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center text-gray-600">
                        <p className="text-sm">
                            © 2026 Sneaker Drop System. All rights reserved.
                        </p>
                        <p className="text-xs mt-2 text-gray-500">
                            Real-time inventory • Atomic reservations • 60-second checkout
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
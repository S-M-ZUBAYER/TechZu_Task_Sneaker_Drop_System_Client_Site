import React, { useState } from 'react';
import { ShoppingBag, User, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import AuthModal from './AuthModal';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuthStore();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const handleAuthClick = (mode) => {
        setAuthMode(mode);
        setShowAuthModal(true);
        setShowMobileMenu(false);
    };

    const handleLogout = () => {
        logout();
        setShowMobileMenu(false);
    };

    return (
        <>
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <ShoppingBag className="w-8 h-8 text-primary-600" />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    Sneaker Drop
                                </h1>
                                <p className="text-xs text-gray-500 hidden sm:block">
                                    Limited Edition Releases
                                </p>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-4">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
                                        <User className="w-5 h-5 text-gray-600" />
                                        <div className="text-sm">
                                            <p className="font-medium text-gray-900">{user?.username}</p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="btn btn-secondary flex items-center space-x-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => handleAuthClick('login')}
                                        className="btn btn-secondary"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => handleAuthClick('register')}
                                        className="btn btn-primary"
                                    >
                                        Register
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                        >
                            {showMobileMenu ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {showMobileMenu && (
                    <div className="md:hidden border-t border-gray-200 bg-white">
                        <div className="px-4 py-3 space-y-3">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <User className="w-5 h-5 text-gray-600" />
                                        <div className="text-sm">
                                            <p className="font-medium text-gray-900">{user?.username}</p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full btn btn-secondary flex items-center justify-center space-x-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => handleAuthClick('login')}
                                        className="w-full btn btn-secondary"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => handleAuthClick('register')}
                                        className="w-full btn btn-primary"
                                    >
                                        Register
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Auth Modal */}
            {showAuthModal && (
                <AuthModal
                    mode={authMode}
                    onClose={() => setShowAuthModal(false)}
                    onSwitchMode={(mode) => setAuthMode(mode)}
                />
            )}
        </>
    );
};

export default Navbar;
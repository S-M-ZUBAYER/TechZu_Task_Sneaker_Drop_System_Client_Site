import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const AuthModal = ({ mode: initialMode, onClose, onSwitchMode }) => {
    const [mode, setMode] = useState(initialMode);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const { register, login, isLoading } = useAuthStore();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (mode === 'register') {
            const result = await register(formData);
            if (result.success) {
                onClose();
            }
        } else {
            const result = await login({
                email: formData.email,
                password: formData.password,
            });
            if (result.success) {
                onClose();
            }
        }
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        onSwitchMode(newMode);
        setFormData({ username: '', email: '', password: '' });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {mode === 'register' ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-gray-600 mt-1">
                        {mode === 'register'
                            ? 'Sign up to start reserving exclusive drops'
                            : 'Login to continue shopping'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'register' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="input"
                                placeholder="Enter username"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input"
                            placeholder="Enter email"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input"
                            placeholder="Enter password"
                            required
                            minLength={6}
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn btn-primary flex items-center justify-center space-x-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>{mode === 'register' ? 'Creating Account...' : 'Logging In...'}</span>
                            </>
                        ) : (
                            <span>{mode === 'register' ? 'Create Account' : 'Login'}</span>
                        )}
                    </button>
                </form>

                {/* Switch Mode */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        {mode === 'register' ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button
                            onClick={() => switchMode(mode === 'register' ? 'login' : 'register')}
                            className="text-primary-600 font-medium hover:text-primary-700"
                            disabled={isLoading}
                        >
                            {mode === 'register' ? 'Login' : 'Register'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
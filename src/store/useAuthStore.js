import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            // Register user
            register: async (data) => {
                set({ isLoading: true });
                try {
                    const response = await authAPI.register(data);
                    const { user, token } = response.data.data;

                    localStorage.setItem('token', token);
                    set({ user, token, isAuthenticated: true, isLoading: false });

                    toast.success('Registration successful!');
                    return { success: true };
                } catch (error) {
                    set({ isLoading: false });
                    const message = error.response?.data?.message || 'Registration failed';
                    toast.error(message);
                    return { success: false, error: message };
                }
            },

            // Login user
            login: async (data) => {
                set({ isLoading: true });
                try {
                    const response = await authAPI.login(data);
                    const { user, token } = response.data.data;

                    localStorage.setItem('token', token);
                    set({ user, token, isAuthenticated: true, isLoading: false });

                    toast.success(`Welcome back, ${user.username}!`);
                    return { success: true };
                } catch (error) {
                    set({ isLoading: false });
                    const message = error.response?.data?.message || 'Login failed';
                    toast.error(message);
                    return { success: false, error: message };
                }
            },

            // Logout user
            logout: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                set({ user: null, token: null, isAuthenticated: false });
                toast.success('Logged out successfully');
            },

            // Get user profile
            getProfile: async () => {
                try {
                    const response = await authAPI.getProfile();
                    const user = response.data.data.user;
                    set({ user });
                    return { success: true, user };
                } catch (error) {
                    console.error('Failed to get profile:', error);
                    return { success: false };
                }
            },

            // Initialize auth from localStorage
            initAuth: () => {
                const token = localStorage.getItem('token');
                const userStr = localStorage.getItem('user');

                if (token && userStr) {
                    try {
                        const user = JSON.parse(userStr);
                        set({ token, user, isAuthenticated: true });
                    } catch (error) {
                        console.error('Failed to parse user from localStorage');
                        get().logout();
                    }
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
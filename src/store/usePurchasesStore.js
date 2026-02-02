import { create } from 'zustand';
import { purchasesAPI } from '../services/api';
import toast from 'react-hot-toast';

export const usePurchasesStore = create((set, get) => ({
    purchases: [],
    isLoading: false,
    isPurchasing: false,

    // Complete purchase
    completePurchase: async (reservationId) => {
        set({ isPurchasing: true });
        try {
            const response = await purchasesAPI.complete(reservationId);
            const { purchase } = response.data.data;

            set((state) => ({
                purchases: [purchase, ...state.purchases],
                isPurchasing: false,
            }));

            toast.success('🎉 Purchase completed! Check your purchases.');
            return { success: true, purchase };
        } catch (error) {
            set({ isPurchasing: false });
            const message = error.response?.data?.message || 'Failed to complete purchase';
            toast.error(message);
            return { success: false, error: message };
        }
    },

    // Fetch user purchases
    fetchUserPurchases: async (params = {}) => {
        set({ isLoading: true });
        try {
            const response = await purchasesAPI.getUserPurchases(params);
            const purchases = response.data.data.purchases;
            set({ purchases, isLoading: false });
            return { success: true, purchases };
        } catch (error) {
            set({ isLoading: false });
            const message = error.response?.data?.message || 'Failed to fetch purchases';
            return { success: false, error: message };
        }
    },

    // Add purchase (from socket event)
    addPurchase: (purchase) => {
        set((state) => ({
            purchases: [purchase, ...state.purchases],
        }));
    },
}));
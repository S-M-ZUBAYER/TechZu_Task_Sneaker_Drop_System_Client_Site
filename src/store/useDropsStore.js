import { create } from 'zustand';
import { dropsAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useDropsStore = create((set, get) => ({
    drops: [],
    selectedDrop: null,
    isLoading: false,
    error: null,

    // Fetch all drops
    fetchDrops: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
            const response = await dropsAPI.getAll(params);
            const drops = response.data.data.drops;
            set({ drops, isLoading: false });
            return { success: true, drops };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch drops';
            set({ error: message, isLoading: false });
            return { success: false, error: message };
        }
    },

    // Fetch single drop
    fetchDropById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await dropsAPI.getById(id);
            const drop = response.data.data.drop;
            set({ selectedDrop: drop, isLoading: false });
            return { success: true, drop };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch drop';
            set({ error: message, isLoading: false });
            return { success: false, error: message };
        }
    },

    // Update drop stock (real-time from socket)
    updateDropStock: (dropId, newStock) => {
        set((state) => ({
            drops: state.drops.map((drop) =>
                drop.id === dropId ? { ...drop, stock: newStock } : drop
            ),
            selectedDrop:
                state.selectedDrop?.id === dropId
                    ? { ...state.selectedDrop, stock: newStock }
                    : state.selectedDrop,
        }));
    },

    // Add new drop (real-time from socket)
    addDrop: (newDrop) => {
        set((state) => ({
            drops: [newDrop, ...state.drops],
        }));
    },

    // Update drop in list (real-time from socket)
    updateDrop: (updatedDrop) => {
        set((state) => ({
            drops: state.drops.map((drop) =>
                drop.id === updatedDrop.id ? { ...drop, ...updatedDrop } : drop
            ),
        }));
    },

    // Remove drop from list (real-time from socket)
    removeDrop: (dropId) => {
        set((state) => ({
            drops: state.drops.filter((drop) => drop.id !== dropId),
            selectedDrop: state.selectedDrop?.id === dropId ? null : state.selectedDrop,
        }));
    },

    // Clear selected drop
    clearSelectedDrop: () => {
        set({ selectedDrop: null });
    },

    // Get drop by ID from store (no API call)
    getDropById: (id) => {
        const drop = get().drops.find((d) => d.id === id);
        return drop || null;
    },
}));
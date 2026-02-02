import { create } from 'zustand';
import { reservationsAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useReservationsStore = create((set, get) => ({
    reservations: [],
    activeReservation: null,
    isReserving: false,
    isLoading: false,

    // Reserve an item
    reserveItem: async (dropId) => {
        set({ isReserving: true });
        try {
            const response = await reservationsAPI.reserve(dropId);
            const { reservation } = response.data.data;

            set((state) => ({
                reservations: [reservation, ...state.reservations],
                activeReservation: reservation,
                isReserving: false,
            }));

            toast.success('Item reserved! You have 60 seconds to complete purchase.');
            return { success: true, reservation };
        } catch (error) {
            set({ isReserving: false });
            const message = error.response?.data?.message || 'Failed to reserve item';
            toast.error(message);
            return { success: false, error: message };
        }
    },

    // Fetch user reservations
    fetchUserReservations: async (status = null) => {
        set({ isLoading: true });
        try {
            const response = await reservationsAPI.getUserReservations(status);
            const reservations = response.data.data.reservations;

            // Find active reservation
            const activeReservation = reservations.find(
                (r) => r.status === 'active' && r.is_active
            );

            set({ reservations, activeReservation, isLoading: false });
            return { success: true, reservations };
        } catch (error) {
            set({ isLoading: false });
            const message = error.response?.data?.message || 'Failed to fetch reservations';
            return { success: false, error: message };
        }
    },

    // Cancel reservation
    cancelReservation: async (id) => {
        try {
            await reservationsAPI.cancel(id);

            set((state) => ({
                reservations: state.reservations.filter((r) => r.id !== id),
                activeReservation: state.activeReservation?.id === id ? null : state.activeReservation,
            }));

            toast.success('Reservation cancelled');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to cancel reservation';
            toast.error(message);
            return { success: false, error: message };
        }
    },

    // Update reservation status (from socket or timer)
    updateReservationStatus: (reservationId, status) => {
        set((state) => ({
            reservations: state.reservations.map((r) =>
                r.id === reservationId ? { ...r, status, is_active: status === 'active' } : r
            ),
            activeReservation:
                state.activeReservation?.id === reservationId && status !== 'active'
                    ? null
                    : state.activeReservation,
        }));
    },

    // Mark reservation as expired
    markExpired: (reservationId) => {
        set((state) => ({
            reservations: state.reservations.map((r) =>
                r.id === reservationId ? { ...r, status: 'expired', is_active: false } : r
            ),
            activeReservation: state.activeReservation?.id === reservationId ? null : state.activeReservation,
        }));
    },

    // Clear active reservation
    clearActiveReservation: () => {
        set({ activeReservation: null });
    },

    // Get active reservation for a specific drop
    getActiveReservationForDrop: (dropId) => {
        const reservation = get().reservations.find(
            (r) => r.drop_id === dropId && r.status === 'active' && r.is_active
        );
        return reservation || null;
    },
}));
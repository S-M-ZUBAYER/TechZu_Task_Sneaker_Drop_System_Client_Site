import React, { useState } from 'react';
import { ShoppingCart, Loader2, Lock } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useReservationsStore } from '../store/useReservationsStore';
import AuthModal from './AuthModal';

const ReserveButton = ({ drop, onReserveSuccess }) => {
    const { isAuthenticated } = useAuthStore();
    const { reserveItem, isReserving, getActiveReservationForDrop } = useReservationsStore();
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Check if user already has an active reservation for this drop
    const activeReservation = getActiveReservationForDrop(drop.id);

    const handleReserve = async () => {
        if (!isAuthenticated) {
            setShowAuthModal(true);
            return;
        }

        const result = await reserveItem(drop.id);
        if (result.success && onReserveSuccess) {
            onReserveSuccess(result.reservation);
        }
    };

    // Check if drop is available
    const isAvailable = drop.stock > 0;
    const hasStarted = !drop.drop_start_time || new Date(drop.drop_start_time) <= new Date();

    // If user already has a reservation
    if (activeReservation) {
        return (
            <button disabled className="w-full btn bg-yellow-500 text-white cursor-not-allowed">
                <Lock className="w-4 h-4 mr-2" />
                Already Reserved
            </button>
        );
    }

    // If drop hasn't started
    if (!hasStarted) {
        return (
            <button disabled className="w-full btn btn-secondary cursor-not-allowed">
                <Lock className="w-4 h-4 mr-2" />
                Coming Soon
            </button>
        );
    }

    // If out of stock
    if (!isAvailable) {
        return (
            <button disabled className="w-full btn btn-danger cursor-not-allowed">
                Sold Out
            </button>
        );
    }

    return (
        <>
            <button
                onClick={handleReserve}
                disabled={isReserving}
                className="w-full btn btn-primary flex items-center justify-center space-x-2"
            >
                {isReserving ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Reserving...</span>
                    </>
                ) : (
                    <>
                        <ShoppingCart className="w-5 h-5" />
                        <span>Reserve Now</span>
                    </>
                )}
            </button>

            {/* Auth Modal */}
            {showAuthModal && (
                <AuthModal
                    mode="login"
                    onClose={() => setShowAuthModal(false)}
                    onSwitchMode={() => { }}
                />
            )}
        </>
    );
};

export default ReserveButton;
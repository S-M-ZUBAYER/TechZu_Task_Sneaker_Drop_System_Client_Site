import React, { useState } from 'react';
import { Package, TrendingUp } from 'lucide-react';
import ReserveButton from './ReserveButton';
import PurchaseModal from './PurchaseModal';
import ActivityFeed from './ActivityFeed';
import { useReservationsStore } from '../store/useReservationsStore';

const DropCard = ({ drop }) => {
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [currentReservation, setCurrentReservation] = useState(null);
    const { getActiveReservationForDrop } = useReservationsStore();

    const handleReserveSuccess = (reservation) => {
        setCurrentReservation(reservation);
        setShowPurchaseModal(true);
    };

    const handlePurchaseSuccess = () => {
        setCurrentReservation(null);
        setShowPurchaseModal(false);
    };

    const stockPercentage = (drop.stock / drop.initial_stock) * 100;
    const getStockColor = () => {
        if (stockPercentage <= 20) return 'text-red-600 bg-red-50';
        if (stockPercentage <= 50) return 'text-orange-600 bg-orange-50';
        return 'text-green-600 bg-green-50';
    };

    // Check for active reservation
    const activeReservation = getActiveReservationForDrop(drop.id);

    return (
        <>
            <div className="card group hover:scale-[1.02] transition-transform duration-300">
                {/* Image */}
                <div className="relative overflow-hidden bg-gray-100">
                    <img
                        src={drop.image_url || 'https://via.placeholder.com/400x300?text=Sneaker'}
                        alt={drop.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Stock Badge */}
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full ${getStockColor()}`}>
                        <span className="text-xs font-bold">{drop.stock} left</span>
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg">
                        <p className="text-2xl font-bold text-primary-600">${drop.price}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Title & Description */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                            {drop.name}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                            {drop.description}
                        </p>
                    </div>

                    {/* Stock Progress Bar */}
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Stock Availability</span>
                            <span className="font-medium text-gray-900">
                                {drop.stock}/{drop.initial_stock}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${stockPercentage <= 20
                                        ? 'bg-red-600'
                                        : stockPercentage <= 50
                                            ? 'bg-orange-600'
                                            : 'bg-green-600'
                                    }`}
                                style={{ width: `${stockPercentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Activity Feed */}
                    {drop.purchases && drop.purchases.length > 0 && (
                        <div className="border-t border-gray-100 pt-4">
                            <ActivityFeed purchases={drop.purchases} />
                        </div>
                    )}

                    {/* Reserve Button */}
                    <div className="pt-2">
                        <ReserveButton drop={drop} onReserveSuccess={handleReserveSuccess} />
                    </div>

                    {/* Active Reservation Notice */}
                    {activeReservation && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-xs text-yellow-800 text-center">
                                You have an active reservation for this item
                            </p>
                            <button
                                onClick={() => {
                                    setCurrentReservation(activeReservation);
                                    setShowPurchaseModal(true);
                                }}
                                className="text-xs text-yellow-600 font-medium hover:text-yellow-700 underline mt-1 w-full"
                            >
                                Complete Purchase
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Purchase Modal */}
            {showPurchaseModal && (currentReservation || activeReservation) && (
                <PurchaseModal
                    reservation={currentReservation || activeReservation}
                    drop={drop}
                    onClose={() => setShowPurchaseModal(false)}
                    onPurchaseSuccess={handlePurchaseSuccess}
                />
            )}
        </>
    );
};

export default DropCard;
import React from 'react';
import { X, Check, Loader2, Package } from 'lucide-react';
import { usePurchasesStore } from '../store/usePurchasesStore';
import { useReservationsStore } from '../store/useReservationsStore';
import Timer from './Timer';

const PurchaseModal = ({ reservation, drop, onClose, onPurchaseSuccess }) => {
    const { completePurchase, isPurchasing } = usePurchasesStore();
    const { clearActiveReservation, markExpired } = useReservationsStore();

    const handlePurchase = async () => {
        const result = await completePurchase(reservation.id);
        if (result.success) {
            clearActiveReservation();
            if (onPurchaseSuccess) onPurchaseSuccess(result.purchase);
            setTimeout(() => onClose(), 2000);
        }
    };

    const handleExpire = () => {
        markExpired(reservation.id);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    disabled={isPurchasing}
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Header */}
                <div className="mb-6">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 text-center">
                        Complete Purchase
                    </h2>
                    <p className="text-gray-600 mt-2 text-center">
                        Your reservation is active. Complete your purchase before time runs out!
                    </p>
                </div>

                {/* Timer */}
                <div className="mb-6">
                    <Timer expiresAt={reservation.expires_at} onExpire={handleExpire} />
                </div>

                {/* Product Details */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex items-start space-x-4">
                        {drop.image_url && (
                            <img
                                src={drop.image_url}
                                alt={drop.name}
                                className="w-20 h-20 object-cover rounded-lg"
                            />
                        )}
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{drop.name}</h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {drop.description}
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-2xl font-bold text-primary-600">
                                    ${drop.price}
                                </span>
                                <span className="text-sm text-gray-500">
                                    Stock: {drop.stock} left
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Purchase Summary */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">${drop.price}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">$0.00</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                        <span>Total</span>
                        <span className="text-primary-600">${drop.price}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={handlePurchase}
                        disabled={isPurchasing}
                        className="w-full btn btn-success flex items-center justify-center space-x-2"
                    >
                        {isPurchasing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <Check className="w-5 h-5" />
                                <span>Confirm Purchase - ${drop.price}</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={onClose}
                        disabled={isPurchasing}
                        className="w-full btn btn-secondary"
                    >
                        Cancel
                    </button>
                </div>

                {/* Note */}
                <p className="text-xs text-gray-500 text-center mt-4">
                    By completing this purchase, you agree to our terms and conditions.
                </p>
            </div>
        </div>
    );
};

export default PurchaseModal;
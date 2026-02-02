import React, { useEffect, useState } from 'react';
import { Package, RefreshCw } from 'lucide-react';
import { useDropsStore } from '../store/useDropsStore';
import { useReservationsStore } from '../store/useReservationsStore';
import { useAuthStore } from '../store/useAuthStore';
import DropCard from '../components/DropCard';
import LoadingSpinner from '../components/LoadingSpinner';
import socketService from '../services/socket';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { drops, fetchDrops, updateDropStock, isLoading } = useDropsStore();
    const { fetchUserReservations } = useReservationsStore();
    const { isAuthenticated } = useAuthStore();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        // Initial data fetch
        const loadInitialData = async () => {
            await fetchDrops();
            if (isAuthenticated) {
                await fetchUserReservations();
            }
            setInitialLoad(false);
        };

        loadInitialData();

        // Connect to socket ONCE
        socketService.connect();

        // Listen to stock updates
        socketService.onStockUpdate((data) => {
            console.log('Stock updated:', data);
            updateDropStock(data.dropId, data.newStock);

            if (data.reason === 'reservation_expired') {
                toast.success(`Stock recovered for drop #${data.dropId}!`, {
                    icon: '🔄',
                });
            }
        });

        // Listen to new drops
        socketService.onNewDrop((data) => {
            console.log('New drop added:', data);
            toast.success('New drop available!', { icon: '🎉' });
            fetchDrops(); // Refresh drops list
        });

        // Listen to purchase completed
        socketService.onPurchaseCompleted((data) => {
            console.log('Purchase completed:', data);
            fetchDrops(); // Refresh to get updated purchases
        });

        // Cleanup on unmount
        return () => {
            socketService.removeAllListeners();
            // Don't disconnect socket - keep it alive
        };
    }, []); // Empty dependency array - run ONCE on mount

    // Separate effect for auth-dependent fetches
    useEffect(() => {
        if (isAuthenticated && !initialLoad) {
            fetchUserReservations();
        }
    }, [isAuthenticated]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchDrops();
        if (isAuthenticated) {
            await fetchUserReservations();
        }
        setIsRefreshing(false);
        toast.success('Refreshed!');
    };

    if (isLoading && drops.length === 0) {
        return <LoadingSpinner size="lg" text="Loading exclusive drops..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Limited Edition Drops</h1>
                            <p className="text-blue-100 text-lg">
                                Exclusive sneakers with real-time inventory
                            </p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="btn bg-white text-blue-600 hover:bg-gray-100 flex items-center space-x-2"
                        >
                            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">Refresh</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Drops Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {drops.length === 0 ? (
                    <div className="text-center py-20">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No Drops Available
                        </h3>
                        <p className="text-gray-600">
                            Check back soon for exclusive releases!
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Available Now ({drops.length})
                            </h2>
                            <p className="text-gray-600 mt-1">
                                Reserve your favorite drops before they sell out
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {drops.map((drop) => (
                                <DropCard key={drop.id} drop={drop} />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Real-time Indicator */}
            <div className="fixed bottom-4 right-4 z-40">
                {socketService.isConnected() ? (
                    <div className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span className="text-sm font-medium">Live Updates Active</span>
                    </div>
                ) : (
                    <div className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
                        <div className="w-2 h-2 bg-white rounded-full" />
                        <span className="text-sm font-medium">Connecting...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
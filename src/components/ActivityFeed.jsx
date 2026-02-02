import React from 'react';
import { Users, TrendingUp } from 'lucide-react';

const ActivityFeed = ({ purchases = [] }) => {
    if (!purchases || purchases.length === 0) {
        return (
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Users className="w-4 h-4" />
                <span>No purchases yet</span>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">Recent Buyers:</span>
            </div>

            <div className="space-y-1.5">
                {purchases.slice(0, 3).map((purchase, index) => (
                    <div
                        key={purchase.id || index}
                        className="flex items-center space-x-2 text-sm"
                    >
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                            {purchase.user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-900 font-medium">
                                {purchase.user?.username || 'Anonymous'}
                            </p>
                            {purchase.purchased_at && (
                                <p className="text-xs text-gray-500">
                                    {getTimeAgo(purchase.purchased_at)}
                                </p>
                            )}
                        </div>
                        {index === 0 && (
                            <span className="badge badge-success text-xs">Latest</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// Helper function to format time ago
const getTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
};

export default ActivityFeed;
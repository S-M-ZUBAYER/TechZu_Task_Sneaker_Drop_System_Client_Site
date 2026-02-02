import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const Timer = ({ expiresAt, onExpire }) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const expiry = new Date(expiresAt).getTime();
            const diff = Math.max(0, Math.floor((expiry - now) / 1000));
            return diff;
        };

        // Initial calculation
        setTimeLeft(calculateTimeLeft());

        // Update every second
        const interval = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);

            if (remaining === 0) {
                clearInterval(interval);
                if (onExpire) onExpire();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt, onExpire]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getColorClass = () => {
        if (timeLeft <= 10) return 'text-red-600 bg-red-50';
        if (timeLeft <= 30) return 'text-orange-600 bg-orange-50';
        return 'text-green-600 bg-green-50';
    };

    const getProgressPercentage = () => {
        const totalTime = 60; // 60 seconds
        return (timeLeft / totalTime) * 100;
    };

    if (timeLeft === 0) {
        return (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                <Clock className="w-4 h-4" />
                <span className="font-semibold text-sm">Expired</span>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${getColorClass()}`}>
                <Clock className="w-4 h-4" />
                <span className="font-bold text-lg font-mono">{formatTime(timeLeft)}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div
                    className={`h-full transition-all duration-1000 ${timeLeft <= 10 ? 'bg-red-600' : timeLeft <= 30 ? 'bg-orange-600' : 'bg-green-600'
                        }`}
                    style={{ width: `${getProgressPercentage()}%` }}
                />
            </div>
        </div>
    );
};

export default Timer;
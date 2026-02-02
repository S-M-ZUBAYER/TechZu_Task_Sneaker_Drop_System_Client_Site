/**
 * Format currency
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

/**
 * Format date to readable string
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
};

/**
 * Get time ago string
 * @param {string|Date} timestamp
 * @returns {string}
 */
export const getTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffSecs > 0) return `${diffSecs} second${diffSecs > 1 ? 's' : ''} ago`;
    return 'Just now';
};

/**
 * Calculate remaining time in seconds
 * @param {string|Date} expiresAt
 * @returns {number}
 */
export const getRemainingSeconds = (expiresAt) => {
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const diff = Math.max(0, Math.floor((expiry - now) / 1000));
    return diff;
};

/**
 * Check if reservation is expired
 * @param {string|Date} expiresAt
 * @returns {boolean}
 */
export const isExpired = (expiresAt) => {
    return new Date() > new Date(expiresAt);
};

/**
 * Format stock percentage
 * @param {number} current
 * @param {number} total
 * @returns {number}
 */
export const getStockPercentage = (current, total) => {
    if (total === 0) return 0;
    return Math.round((current / total) * 100);
};

/**
 * Get stock status color
 * @param {number} percentage
 * @returns {string}
 */
export const getStockStatusColor = (percentage) => {
    if (percentage <= 20) return 'red';
    if (percentage <= 50) return 'yellow';
    return 'green';
};

/**
 * Truncate text
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Debounce function
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
export const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Generate random ID
 * @returns {string}
 */
export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Validate email
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

/**
 * Get initials from name
 * @param {string} name
 * @returns {string}
 */
export const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

/**
 * Sleep/delay function
 * @param {number} ms
 * @returns {Promise}
 */
export const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
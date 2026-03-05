/**
 * Common formatting utilities for the application.
 */

/** Formats a number as Naira (NGN) currency */
export const formatNaira = (amount: number | string) => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Number(amount));
};

/** Formats a number as USD currency */
export const formatUSD = (amount: number | string) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(Number(amount));
};

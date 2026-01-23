import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

/**
 * Get Stripe instance (lazy initialization)
 * This prevents build-time errors when STRIPE_SECRET_KEY is not available
 */
function getStripe(): Stripe {
    if (!stripeInstance) {
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeSecretKey) {
            throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
        }
        stripeInstance = new Stripe(stripeSecretKey, {
            apiVersion: '2025-12-15.clover',
            typescript: true,
        });
    }
    return stripeInstance;
}

/**
 * Stripe instance for server-side operations
 * Use this exported instance in your code
 */
export const stripe = new Proxy({} as Stripe, {
    get: (target, prop) => {
        const instance = getStripe();
        const value = instance[prop as keyof Stripe];
        return typeof value === 'function' ? value.bind(instance) : value;
    }
});

/**
 * Get platform fee percentage from environment
 * Safe to call at build time - returns default if env var not set
 */
export function getPlatformFeePercentage(): number {
    const platformFeePercentage = process.env.PLATFORM_FEE_PERCENTAGE;
    const fee = parseInt(platformFeePercentage || '10', 10);
    return Math.min(Math.max(fee, 0), 100); // Clamp between 0-100
}

/**
 * Calculate platform fee and provider amount
 */
export function calculateFees(totalAmount: number): {
    platformFee: number;
    providerAmount: number;
} {
    const feePercentage = getPlatformFeePercentage();
    const platformFee = Math.round((totalAmount * feePercentage) / 100);
    const providerAmount = totalAmount - platformFee;

    return {
        platformFee,
        providerAmount,
    };
}

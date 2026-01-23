import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const platformFeePercentage = process.env.PLATFORM_FEE_PERCENTAGE;
if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

/**
 * Stripe instance for server-side operations
 */
export const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-12-15.clover',
    typescript: true,
});

/**
 * Get platform fee percentage from environment
 */
export function getPlatformFeePercentage(): number {
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

"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { X, CreditCard, Calendar, MapPin, DollarSign } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentModalProps {
    bookingId: string;
    bookingDetails: {
        providerName: string;
        startDate: string;
        endDate: string;
        location?: string;
        price: number;
        type: string;
    };
    onClose: () => void;
    onSuccess: () => void;
}

/**
 * Payment form component with Stripe Elements
 */
function PaymentForm({ bookingId, bookingDetails, onClose, onSuccess }: PaymentModalProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Create PaymentIntent
            const response = await fetch("/api/payments/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to create payment intent");
            }

            const { clientSecret, paymentId } = data;

            // Confirm the payment with Stripe
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                throw new Error("Card element not found");
            }

            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: cardElement,
                    },
                }
            );

            if (stripeError) {
                throw new Error(stripeError.message);
            }

            if (paymentIntent?.status === "requires_capture") {
                // Update payment status to authorized
                await fetch("/api/payments/update-status", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ paymentId, status: "authorized" }),
                }).catch(console.error);

                alert("Payment authorized successfully! Waiting for provider confirmation.");
                onSuccess();
            } else {
                throw new Error("Payment authorization failed");
            }
        } catch (err: any) {
            console.error("Payment error:", err);
            setError(err.message || "Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Booking Details */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <User className="text-blue-600" size={16} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs">Provider</p>
                            <p className="font-semibold text-gray-900">{bookingDetails.providerName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Calendar className="text-purple-600" size={16} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs">Dates</p>
                            <p className="font-semibold text-gray-900">
                                {new Date(bookingDetails.startDate).toLocaleDateString()} -{" "}
                                {new Date(bookingDetails.endDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    {bookingDetails.location && (
                        <div className="flex items-center gap-3 text-sm">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <MapPin className="text-green-600" size={16} />
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Location</p>
                                <p className="font-semibold text-gray-900">{bookingDetails.location}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex items-center gap-3 text-sm pt-3 border-t border-blue-200">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <DollarSign className="text-orange-600" size={16} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs">Total Amount</p>
                            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Rs {bookingDetails.price.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Input */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <CreditCard size={18} className="text-blue-600" />
                    Card Details
                </label>
                <div className="p-4 border-2 border-gray-200 rounded-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: "16px",
                                    color: "#1f2937",
                                    "::placeholder": {
                                        color: "#9ca3af",
                                    },
                                },
                                invalid: {
                                    color: "#ef4444",
                                },
                            },
                        }}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    <CreditCard size={16} className="text-blue-600" /> Test card: 4242 4242 4242 4242 | Any future date | Any CVC | Any ZIP (12345)
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Info Message */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-700">
                    ℹ️ Your card will be authorized but not charged yet. Payment will be captured when the provider confirms your booking.
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 px-6 py-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Processing..." : `Pay Rs ${bookingDetails.price.toLocaleString()}`}
                </button>
            </div>
        </form>
    );
}

/**
 * Payment modal with Stripe Elements provider
 */
export default function PaymentModal(props: PaymentModalProps) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
            <div
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Complete Payment
                        </h2>
                        <button
                            onClick={props.onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={24} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <Elements stripe={stripePromise}>
                        <PaymentForm {...props} />
                    </Elements>
                </div>
            </div>
        </div>
    );
}

// Missing import
import { User } from "lucide-react";

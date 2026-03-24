"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "danger" | "warning" | "info" | "success";
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "danger"
}: ConfirmationModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => setIsVisible(true));
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error("Confirmation action failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getVariantStyles = () => {
        switch (variant) {
            case "danger":
                return {
                    button: "bg-red-600 hover:bg-red-700 text-white",
                    iconBg: "bg-red-100",
                    iconColor: "text-red-600"
                };
            case "warning":
                return {
                    button: "bg-amber-500 hover:bg-amber-600 text-white",
                    iconBg: "bg-amber-100",
                    iconColor: "text-amber-600"
                };
            case "success":
                return {
                    button: "bg-emerald-600 hover:bg-emerald-700 text-white",
                    iconBg: "bg-emerald-100",
                    iconColor: "text-emerald-600"
                };
            default:
                return {
                    button: "bg-blue-600 hover:bg-blue-700 text-white",
                    iconBg: "bg-blue-100",
                    iconColor: "text-blue-600"
                };
        }
    };

    const styles = getVariantStyles();

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 transition-opacity duration-200 ${
                    isVisible ? "opacity-100" : "opacity-0"
                }`}
                onClick={onClose}
            />

            {/* Modal container */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className={`relative w-full max-w-md bg-white rounded-lg shadow-xl transition-all duration-200 ${
                        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }`}
                >
                    {/* Content */}
                    <div className="p-6">
                        {/* Icon */}
                        <div className={`mx-auto w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center mb-4`}>
                            {variant === "danger" && (
                                <svg className={`w-6 h-6 ${styles.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                            )}
                            {variant === "warning" && (
                                <svg className={`w-6 h-6 ${styles.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                </svg>
                            )}
                            {variant === "success" && (
                                <svg className={`w-6 h-6 ${styles.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            {variant === "info" && (
                                <svg className={`w-6 h-6 ${styles.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                </svg>
                            )}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                            {title}
                        </h3>

                        {/* Message */}
                        <p className="text-sm text-gray-600 text-center mb-6">
                            {message}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50 transition-colors"
                            >
                                {cancelLabel}
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={isLoading}
                                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 ${styles.button}`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    confirmLabel
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

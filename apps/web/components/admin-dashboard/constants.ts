// Admin Dashboard Constants

export const CHART_COLORS = {
    primary: "rgba(99, 102, 241, 1)", // indigo-500
    primaryLight: "rgba(99, 102, 241, 0.2)",
    secondary: "rgba(147, 51, 234, 1)", // purple-600
    secondaryLight: "rgba(147, 51, 234, 0.2)",
    success: "rgba(16, 185, 129, 1)", // emerald-500
    successLight: "rgba(16, 185, 129, 0.2)",
    warning: "rgba(245, 158, 11, 1)", // amber-500
    warningLight: "rgba(245, 158, 11, 0.2)",
    danger: "rgba(239, 68, 68, 1)", // red-500
    dangerLight: "rgba(239, 68, 68, 0.2)",
    info: "rgba(6, 182, 212, 1)", // cyan-500
    infoLight: "rgba(6, 182, 212, 0.2)",
};

export const TIME_PERIODS = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
];

export const USER_ROLE_LABELS: Record<string, string> = {
    tourist: "Tourist",
    guide: "Guide",
    accommodation_provider: "Provider",
    admin: "Admin",
};

export const USER_ROLE_COLORS: Record<string, string> = {
    tourist: "bg-blue-100 text-blue-700",
    guide: "bg-green-100 text-green-700",
    accommodation_provider: "bg-purple-100 text-purple-700",
    admin: "bg-red-100 text-red-700",
};

export const BOOKING_STATUS_LABELS: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
};

export const BOOKING_STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

export const BOOKING_TYPE_LABELS: Record<string, string> = {
    accommodation: "Accommodation",
    guide: "Guide",
};

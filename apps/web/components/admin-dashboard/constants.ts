// Admin Dashboard Constants

export const CHART_COLORS = {
    primary: "rgba(102, 126, 234, 1)",
    primaryLight: "rgba(102, 126, 234, 0.2)",
    secondary: "rgba(118, 75, 162, 1)",
    secondaryLight: "rgba(118, 75, 162, 0.2)",
    success: "rgba(34, 197, 94, 1)",
    successLight: "rgba(34, 197, 94, 0.2)",
    warning: "rgba(251, 146, 60, 1)",
    warningLight: "rgba(251, 146, 60, 0.2)",
    danger: "rgba(239, 68, 68, 1)",
    dangerLight: "rgba(239, 68, 68, 0.2)",
    info: "rgba(59, 130, 246, 1)",
    infoLight: "rgba(59, 130, 246, 0.2)",
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

export default function ProviderDashboard() {
    /**
     * Renders the Accommodation Provider Dashboard.
     * This page is accessible only to users with the 'accommodation_provider' role.
     */
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Provider Dashboard</h1>
            <p>Welcome to your provider dashboard. Manage your accommodations and bookings here.</p>
        </div>
    );
}

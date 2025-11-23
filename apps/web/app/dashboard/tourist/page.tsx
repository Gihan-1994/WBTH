export default function TouristDashboard() {
    /**
     * Renders the Tourist Dashboard.
     * This page is accessible only to users with the 'tourist' role.
     */
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Tourist Dashboard</h1>
            <p>Welcome to your tourist dashboard. Here you can manage your bookings and profile.</p>
        </div>
    );
}

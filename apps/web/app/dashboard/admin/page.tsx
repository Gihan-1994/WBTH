export default function AdminDashboard() {
    /**
     * Renders the Admin Dashboard.
     * This page is accessible only to users with the 'admin' role.
     */
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <p>Welcome to the admin dashboard. Manage users and system settings here.</p>
        </div>
    );
}

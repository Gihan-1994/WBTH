import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth-options";

export default async function DashboardPage() {
  /**
   * Main Dashboard Entry Point.
   * Redirects users to their specific dashboard based on their role.
   */
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // @ts-ignore
  const role = session.user.role;

  switch (role) {
    case "tourist":
      redirect("/dashboard/tourist");
    case "guide":
      redirect("/dashboard/guide");
    case "accommodation_provider":
      redirect("/dashboard/provider");
    case "admin":
      redirect("/dashboard/admin");
    default:
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p>Unknown user role: {role}</p>
        </div>
      );
  }
}

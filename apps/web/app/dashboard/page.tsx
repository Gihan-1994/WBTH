import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "@/app/lib/auth";

export default function DashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = verifySessionToken(token);
  if (!payload) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-bold">Dashboard (Protected)</h1>
    </main>
  );
}

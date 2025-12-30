"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  MapPin,
  User,
  Calendar,
  MessageSquare,
  Hotel,
  Compass,
  LogOut,
  CalendarCheck,
} from "lucide-react";

export default function Home() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const getProfileLink = () => {
    if (!session?.user) return "/login";
    // @ts-ignore
    const role = session.user.role;
    if (role === "tourist") return "/dashboard/tourist";
    if (role === "guide") return "/dashboard/guide";
    if (role === "accommodation_provider") return "/dashboard/provider";
    return "/dashboard";
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20 px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">Tourism Hub</h1>
        <p className="text-xl mb-8">
          Your one-stop destination for all tourism needs
        </p>
        {session ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-lg">
              Welcome back, <span className="font-semibold">{session.user?.name}</span>!
            </p>
            <div className="flex items-center gap-4">
              {session.user?.role !== "tourist" && (
                <Link
                  href="/dashboard/tourist"
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2"
                >
                  <CalendarCheck size={20} />
                  View Bookings
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition flex items-center gap-2"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="space-x-4">
            <Link
              href="/login"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              Register
            </Link>
          </div>
        )}
      </section>

      {/* Sections Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Personal Recommendations */}
        <Link
          href="/recommendations"
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition group"
        >
          <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition">
            <Compass className="text-purple-600" size={24} />
          </div>
          <h2 className="text-xl font-bold mb-2">For You</h2>
          <p className="text-gray-600">
            Personalized recommendations based on your interests.
          </p>
        </Link>

        {/* Accommodations */}
        <Link
          href="/accommodations"
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition group"
        >
          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition">
            <Hotel className="text-blue-600" size={24} />
          </div>
          <h2 className="text-xl font-bold mb-2">Accommodations</h2>
          <p className="text-gray-600">
            Find the perfect place to stay for your trip.
          </p>
        </Link>

        {/* Guides */}
        <Link
          href="/guides"
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition group"
        >
          <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition">
            <User className="text-green-600" size={24} />
          </div>
          <h2 className="text-xl font-bold mb-2">Guides</h2>
          <p className="text-gray-600">
            Connect with local experts for an unforgettable experience.
          </p>
        </Link>

        {/* Upcoming Events */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Calendar className="text-orange-600" size={24} />
          </div>
          <h2 className="text-xl font-bold mb-2">Upcoming Events</h2>
          <p className="text-gray-600 mb-4">
            Discover events happening around you.
          </p>
          <span className="text-sm text-orange-600 font-medium">
            Coming Soon
          </span>
        </div>

        {/* Chat Bot */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <div className="bg-teal-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="text-teal-600" size={24} />
          </div>
          <h2 className="text-xl font-bold mb-2">AI Assistant</h2>
          <p className="text-gray-600 mb-4">
            Chat with our AI to plan your perfect trip.
          </p>
          <span className="text-sm text-teal-600 font-medium">
            Coming Soon
          </span>
        </div>

        {/* My Profile */}
        <Link
          href={getProfileLink()}
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition group"
        >
          <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:bg-gray-200 transition">
            <User className="text-gray-600" size={24} />
          </div>
          <h2 className="text-xl font-bold mb-2">My Profile</h2>
          <p className="text-gray-600">
            Manage your bookings, profile, and settings.
          </p>
        </Link>
      </div>
    </main>
  );
}

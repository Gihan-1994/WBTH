"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  MapPin,
  User,
  Calendar,
  MessageSquare,
  Hotel,
  Compass,
  LogOut,
  CalendarCheck,
  ArrowRight,
  Shield,
  UserCog,
} from "lucide-react";
import Chatbot from "@/components/Chatbot";
import EventCalendar from "@/components/homepage/EventCalendar";

export default function Home() {
  const { data: session } = useSession();
  const [adminExists, setAdminExists] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    checkAdminExistence();
  }, []);

  const checkAdminExistence = async () => {
    try {
      const response = await fetch("/api/admin/check-exists");
      if (response.ok) {
        const data = await response.json();
        setAdminExists(data.exists);
      }
    } catch (error) {
      console.error("Error checking admin existence:", error);
    } finally {
      setCheckingAdmin(false);
    }
  };

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
    if (role === "admin") return "/dashboard/admin";
    return "/dashboard";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Hero Section */}
      <section
        className="relative text-white py-20 px-4 text-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/hero-bg.png')",
          minHeight: "500px",
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40"></div>

        {/* Admin Area Button (top right) */}
        {!checkingAdmin && adminExists && (
          <div className="absolute top-6 right-6 z-20">
            <Link
              href="/login"
              className="bg-white/10 backdrop-blur-sm border-2 border-white/50 text-white px-4 py-2 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 flex items-center gap-2 hover:scale-105"
            >
              <Shield size={20} />
              Admin Area
            </Link>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-2xl bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            Tourism Hub
          </h1>
          <p className="text-xl md:text-2xl mb-8 drop-shadow-lg font-light">
            Your one-stop destination for all tourism needs
          </p>
          {session ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-lg md:text-xl backdrop-blur-sm bg-white/10 px-6 py-2 rounded-full border border-white/20">
                Welcome back, <span className="font-semibold">{session.user?.name}</span>!
              </p>
              <div className="flex items-center gap-4">
                {session.user?.role !== "tourist" && (
                  <Link
                    href="/dashboard/tourist"
                    className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <CalendarCheck size={20} />
                    View Bookings
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/50 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 flex items-center gap-2 hover:scale-105"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/login"
                className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 group"
              >
                Login
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 border-2 border-white/50 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 group"
              >
                Register
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              {!checkingAdmin && !adminExists && (
                <Link
                  href="/admin/register"
                  className="bg-gradient-to-r from-red-600 to-pink-600 border-2 border-white/50 text-white px-8 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 group"
                >
                  <Shield size={20} />
                  Admin Registration
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Sections Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Personal Recommendations */}
        <Link
          href="/recommendations"
          className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 group hover:scale-[1.02] border border-purple-100/50"
        >
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
            <Compass className="text-purple-600" size={26} />
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-purple-600 transition-colors">
            For You
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Personalized recommendations based on your interests.
          </p>
        </Link>

        {/* Accommodations */}
        <Link
          href="/accommodations"
          className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 group hover:scale-[1.02] border border-blue-100/50"
        >
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
            <Hotel className="text-blue-600" size={26} />
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
            Accommodations
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Find the perfect place to stay for your trip.
          </p>
        </Link>

        {/* Guides */}
        <Link
          href="/guides"
          className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 group hover:scale-[1.02] border border-green-100/50"
        >
          <div className="bg-gradient-to-br from-green-100 to-green-200 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
            <User className="text-green-600" size={26} />
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-green-600 transition-colors">
            Guides
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Connect with local experts for an unforgettable experience.
          </p>
        </Link>

        {/* Upcoming Events */}
        <Link
          href="/events"
          className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 group hover:scale-[1.02] border border-orange-100/50"
        >
          <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
            <Calendar className="text-orange-600" size={26} />
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-orange-600 transition-colors">
            Upcoming Events
          </h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Discover exciting events happening around you.
          </p>
          <div className="inline-flex items-center gap-2 text-orange-600 font-semibold group-hover:translate-x-1 transition-transform">
            View Events <ArrowRight size={18} />
          </div>
        </Link>

        {/* Chat Bot */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 group hover:scale-[1.02] border border-teal-100/50">
          <div className="bg-gradient-to-br from-teal-100 to-teal-200 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
            <MessageSquare className="text-teal-600" size={26} />
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">AI Assistant</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Chat with our AI to plan your perfect trip.
          </p>
          <Chatbot inline={true} />
        </div>

        {/* My Profile */}
        <Link
          href={getProfileLink()}
          className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 group hover:scale-[1.02] border border-gray-100"
        >
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
            <User className="text-gray-600" size={26} />
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-gray-700 transition-colors">
            My Profile
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Manage your bookings, profile, and settings.
          </p>
        </Link>
      </div>

    </main>
  );
}

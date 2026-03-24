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
  ChevronRight,
  Shield,
  Star,
  Users,
  Phone,
  Mail,
  Menu,
  X,
  ChevronDown,
  Waves,
  Heart,
  Linkedin,
  Youtube,
  Globe,
} from "lucide-react";
import Chatbot from "@/components/Chatbot";

// Navigation Component
function Navigation({
  session,
  onLogout,
  adminExists,
  checkingAdmin,
}: {
  session: any;
  onLogout: () => void;
  adminExists: boolean;
  checkingAdmin: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <Waves className="text-white" size={24} />
            </div>
            <span
              className={`text-2xl font-bold transition-colors ${
                scrolled ? "text-gray-900" : "text-white"
              }`}
            >
              Tourism Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {[
              { name: "Explore", href: "#explore" },
              { name: "Accommodations", href: "/accommodations" },
              { name: "Guides", href: "/guides" },
              { name: "Events", href: "/events" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-base font-medium uppercase tracking-wide transition-colors ${
                  scrolled
                    ? "text-gray-600 hover:text-indigo-600"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className={`font-medium transition-colors ${
                    scrolled ? "text-gray-600" : "text-white"
                  }`}
                >
                  Hi, {session.user?.name?.split(" ")[0]}
                </Link>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-5 py-2.5 rounded-full font-medium hover:bg-white/20 transition-all"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`font-medium transition-colors ${
                    scrolled
                      ? "text-gray-600 hover:text-indigo-600"
                      : "text-white hover:text-white/80"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-indigo-700 transition-all"
                >
                  Get Started
                  <ChevronRight size={18} />
                </Link>
              </>
            )}
            {!checkingAdmin && adminExists && (
              <Link
                href="/admin"
                className={`p-2.5 rounded-full transition-colors ${
                  scrolled
                    ? "text-gray-600 hover:bg-gray-100"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Shield size={20} />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 ${scrolled ? "text-gray-900" : "text-white"}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 bg-white rounded-2xl shadow-xl mb-4">
            {[
              { name: "Explore", href: "#explore" },
              { name: "Accommodations", href: "/accommodations" },
              { name: "Guides", href: "/guides" },
              { name: "Events", href: "/events" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-3 px-4 text-gray-600 hover:text-indigo-600 font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t mt-2 pt-4 px-4 space-y-3">
              {session ? (
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-medium"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block text-center py-3 text-gray-600 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block text-center bg-indigo-600 text-white px-6 py-3 rounded-full font-medium"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Hero Section
function HeroSection({
  session,
  adminExists,
  checkingAdmin,
}: {
  session: any;
  adminExists: boolean;
  checkingAdmin: boolean;
}) {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/60 to-black/70" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        <p className="font-handwriting text-2xl md:text-3xl text-indigo-300 mb-4 uppercase tracking-wider">
          Discover Your Next Adventure
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight mb-6 leading-tight">
          Explore The
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            World Beyond
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto font-light">
          Your one-stop destination for unforgettable travel experiences,
          expert guides, and perfect accommodations
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {session ? (
            <>
              <Link
                href="/recommendations"
                className="inline-flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold uppercase tracking-wide hover:bg-indigo-700 transition-all hover:scale-105 shadow-lg shadow-indigo-500/30"
              >
                <Compass size={24} />
                Get Recommendations
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold uppercase tracking-wide hover:bg-white/20 transition-all hover:scale-105"
              >
                <User size={24} />
                My Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="inline-flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold uppercase tracking-wide hover:bg-indigo-700 transition-all hover:scale-105 shadow-lg shadow-indigo-500/30"
              >
                Start Your Journey
                <ChevronRight size={24} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold uppercase tracking-wide hover:bg-white/20 transition-all hover:scale-105"
              >
                Sign In
              </Link>
              {!checkingAdmin && !adminExists && (
                <Link
                  href="/admin/register"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold uppercase tracking-wide hover:from-red-600 hover:to-pink-600 transition-all hover:scale-105 shadow-lg"
                >
                  <Shield size={24} />
                  Admin Setup
                </Link>
              )}
            </>
          )}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
          {[
            { value: "500+", label: "Destinations" },
            { value: "50+", label: "Expert Guides" },
            { value: "10K+", label: "Happy Travelers" },
            { value: "4.9", label: "Rating" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">
                {stat.value}
              </p>
              <p className="text-white/60 text-sm uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#explore">
          <ChevronDown size={32} className="text-white/60" />
        </a>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection({ session }: { session: any }) {
  const features = [
    {
      icon: Compass,
      title: "For You",
      description: "Personalized recommendations based on your unique interests and travel style",
      href: "/recommendations",
      gradient: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Hotel,
      title: "Accommodations",
      description: "Find the perfect place to stay, from luxury resorts to cozy homestays",
      href: "/accommodations",
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Users,
      title: "Local Guides",
      description: "Connect with expert local guides for authentic, unforgettable experiences",
      href: "/guides",
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
    },
    {
      icon: Calendar,
      title: "Events",
      description: "Discover exciting local events, festivals, and activities happening nearby",
      href: "/events",
      gradient: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50",
    },
    {
      icon: MessageSquare,
      title: "AI Assistant",
      description: "Get instant help planning your perfect trip with our smart AI chatbot",
      href: "#chat",
      gradient: "from-teal-500 to-cyan-500",
      bgColor: "bg-teal-50",
      isChat: true,
    },
    {
      icon: User,
      title: "My Profile",
      description: "Manage your bookings, preferences, and travel history in one place",
      href: session ? "/dashboard" : "/login",
      gradient: "from-gray-500 to-slate-600",
      bgColor: "bg-gray-50",
    },
  ];

  return (
    <section id="explore" className="py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-handwriting text-indigo-600 text-xl uppercase tracking-wider mb-4">
            Explore
          </p>
          <h2 className="text-4xl md:text-6xl font-bold uppercase text-gray-900 mb-6">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From personalized recommendations to expert guides, we've got your
            entire journey covered
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.href}
              className={`group relative ${feature.bgColor} p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden`}
            >
              {/* Gradient Overlay on Hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              {/* Content */}
              <div className="relative z-10">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <feature.icon className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white mb-3 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 group-hover:text-white/90 transition-colors leading-relaxed">
                  {feature.description}
                </p>

                {feature.isChat ? (
                  <div className="mt-6">
                    <Chatbot inline={true} />
                  </div>
                ) : (
                  <div className="mt-6 flex items-center gap-2 text-indigo-600 group-hover:text-white font-semibold">
                    Explore
                    <ChevronRight
                      size={20}
                      className="group-hover:translate-x-2 transition-transform"
                    />
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Destinations Preview Section
function DestinationsSection() {
  const destinations = [
    {
      image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      name: "Tropical Paradise",
      location: "Beach Destinations",
    },
    {
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      name: "Mountain Escapes",
      location: "Hill Country",
    },
    {
      image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      name: "Cultural Heritage",
      location: "Historic Sites",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-handwriting text-indigo-600 text-xl uppercase tracking-wider mb-4">
            Popular Destinations
          </p>
          <h2 className="text-4xl md:text-6xl font-bold uppercase text-gray-900">
            Where to Next?
          </h2>
        </div>

        {/* Destinations Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {destinations.map((dest, index) => (
            <div
              key={index}
              className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-indigo-300 text-sm uppercase tracking-wider mb-2">
                  {dest.location}
                </p>
                <h3 className="text-3xl font-bold text-white">{dest.name}</h3>
              </div>
              <div className="absolute top-6 right-6">
                <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white hover:text-indigo-600 transition-all">
                  <Heart size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/accommodations"
            className="inline-flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold uppercase tracking-wide hover:bg-indigo-700 transition-all hover:scale-105"
          >
            View All Destinations
            <ChevronRight size={24} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "This platform made planning my entire trip so effortless. The personalized recommendations were spot on!",
      name: "Sarah Johnson",
      role: "Adventure Traveler",
      image: "https://i.pravatar.cc/100?img=1",
    },
    {
      quote: "Found the most amazing local guide through this platform. Truly authentic experiences!",
      name: "Michael Chen",
      role: "Cultural Explorer",
      image: "https://i.pravatar.cc/100?img=3",
    },
    {
      quote: "The AI assistant helped me plan a perfect family vacation. Highly recommended!",
      name: "Emily Davis",
      role: "Family Traveler",
      image: "https://i.pravatar.cc/100?img=5",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-handwriting text-indigo-300 text-xl uppercase tracking-wider mb-4">
            Testimonials
          </p>
          <h2 className="text-4xl md:text-6xl font-bold uppercase">
            What Travelers Say
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/20 transition-all"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={20}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <blockquote className="text-lg text-white/90 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-white">{testimonial.name}</p>
                  <p className="text-white/60 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection({ session }: { session: any }) {
  return (
    <section
      className="relative py-32"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-indigo-900/80" />
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <p className="font-handwriting text-indigo-300 text-xl uppercase tracking-wider mb-4">
          Ready to Explore?
        </p>
        <h2 className="text-4xl md:text-6xl font-bold uppercase mb-8 leading-tight">
          Start Your Journey
          <br />
          Today
        </h2>
        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          Join thousands of travelers who have discovered their perfect
          adventures with us
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {session ? (
            <Link
              href="/recommendations"
              className="inline-flex items-center gap-3 bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold uppercase tracking-wide hover:bg-indigo-50 transition-all hover:scale-105"
            >
              Get Personalized Picks
              <ChevronRight size={24} />
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="inline-flex items-center gap-3 bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold uppercase tracking-wide hover:bg-indigo-50 transition-all hover:scale-105"
              >
                Create Free Account
                <ChevronRight size={24} />
              </Link>
              <Link
                href="/accommodations"
                className="inline-flex items-center gap-3 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold uppercase tracking-wide hover:bg-white/10 transition-all hover:scale-105"
              >
                Browse First
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo & Description */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <Waves className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold">Tourism Hub</span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Your one-stop destination for all tourism needs. Discover,
              explore, and create unforgettable memories.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Accommodations", href: "/accommodations" },
                { name: "Guides", href: "/guides" },
                { name: "Events", href: "/events" },
                { name: "Recommendations", href: "/recommendations" },
                { name: "My Dashboard", href: "/dashboard" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span className="w-2 h-2 bg-indigo-600 rounded-full" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400">
                <Phone size={18} className="text-indigo-500" />
                +94 11 234 5678
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail size={18} className="text-indigo-500" />
                info@tourismhub.com
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin size={18} className="text-indigo-500 mt-1" />
                Colombo, Sri Lanka
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-6">Follow Us</h3>
            <div className="flex gap-3">
              {[Globe, Linkedin, Youtube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white hover:bg-indigo-600 transition-colors"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Tourism Hub. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Main Page Component
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

  return (
    <main className="font-sans">
      <Navigation
        session={session}
        onLogout={handleLogout}
        adminExists={adminExists}
        checkingAdmin={checkingAdmin}
      />
      <HeroSection
        session={session}
        adminExists={adminExists}
        checkingAdmin={checkingAdmin}
      />
      <FeaturesSection session={session} />
      <DestinationsSection />
      <TestimonialsSection />
      <CTASection session={session} />
      <Footer />
    </main>
  );
}

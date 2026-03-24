"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ChevronRight,
  Star,
  Users,
  Award,
  ThumbsUp,
  Facebook,
  Twitter,
  Instagram,
  Menu,
  X,
} from "lucide-react";

// Navigation Component
function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navItems = [
    { name: "Home", href: "#hero", active: true },
    { name: "About Us", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Activities", href: "#activities" },
    { name: "Team", href: "#team" },
    { name: "Contact Us", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/landing" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">ES</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              Extreme Surfing
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-base font-medium uppercase tracking-wide transition-colors ${
                  item.active
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Phone CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+0123456789"
              className="flex items-center gap-3 bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors"
            >
              <Phone size={20} />
              <span>+0123456789</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block py-3 text-base font-medium text-gray-600 hover:text-indigo-600"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <a
              href="tel:+0123456789"
              className="mt-4 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold"
            >
              <Phone size={20} />
              <span>+0123456789</span>
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-20"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <p className="text-2xl md:text-3xl font-handwriting mb-4 uppercase tracking-wider">
          Come and fun with
        </p>
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tight mb-8">
          Extreme Surfing
        </h1>
        <a
          href="#contact"
          className="inline-flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold uppercase tracking-wide hover:bg-indigo-700 transition-all hover:scale-105"
        >
          Get Started
          <ChevronRight size={24} />
        </a>

        {/* Social Links */}
        <div className="mt-12 flex items-center justify-center gap-6">
          <span className="text-sm uppercase tracking-widest">Follow us:</span>
          <div className="flex gap-4">
            {[Facebook, Twitter, Instagram].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 hover:bg-indigo-100 transition-colors"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown size={32} className="text-white" />
      </div>
    </section>
  );
}

// About Section
function AboutSection() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Images Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-64 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1455264745730-cb3b76250ae8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Surfing"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-48 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Surfing"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-48 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Surfing"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-64 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1516370873344-fb769e0fce1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Surfing"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-indigo-600 font-handwriting text-xl uppercase tracking-wider mb-4">
              About Us
            </p>
            <h2 className="text-5xl md:text-6xl font-bold uppercase text-gray-900 mb-6 leading-tight">
              Get TOP SURF
              <br />
              LESSONS With Us
            </h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              Quis autem vel eum iure reprehenderit qui in ea voluptate velit
              esse quam nihil molestiae consequatur, vel illum qui dolorem eum
              fugiat quo voluptas nulla pariatur
            </p>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Reiciendis voluptatibus maiores alias consequatur aut perferendis
              doloribus asperiores repellat
            </p>
            <a
              href="#services"
              className="inline-flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold uppercase tracking-wide hover:bg-indigo-700 transition-all hover:scale-105"
            >
              Learn More
              <ChevronRight size={24} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// Services Section
function ServicesSection() {
  const services = [
    {
      icon: "🏄",
      title: "Surf Lessons",
      description:
        "Molestiae non recusandae itaque earum rerum hic tenetur a sapiente delectus aut reiciendis...",
    },
    {
      icon: "🪁",
      title: "Kite Surfing",
      description:
        "Rolestiae non recusandae itaque earum rerum hic tenetur a sapiente delectus aut reiciendis...",
    },
    {
      icon: "👨‍🏫",
      title: "Professional Coach",
      description:
        "Qolestiae non recusandae itaque earum rerum hic tenetur a sapiente delectus aut reiciendis...",
    },
  ];

  return (
    <section id="services" className="py-24 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-indigo-600 font-handwriting text-xl uppercase tracking-wider mb-4">
            Our Services
          </p>
          <h2 className="text-5xl md:text-6xl font-bold uppercase text-gray-900">
            What We Offer
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 text-center group"
            >
              <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold uppercase text-gray-900 mb-4">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-indigo-600 font-semibold uppercase hover:gap-4 transition-all"
              >
                Learn More
                <ChevronRight size={20} />
              </a>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-3 mt-12">
          <div className="w-4 h-4 bg-indigo-600 rounded-full" />
          <div className="w-4 h-4 bg-gray-300 rounded-full" />
          <div className="w-4 h-4 bg-gray-300 rounded-full" />
        </div>
      </div>
    </section>
  );
}

// Activities Section
function ActivitiesSection() {
  const activities = [
    {
      image:
        "https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Ocean Surfing",
    },
    {
      image:
        "https://images.unsplash.com/photo-1455264745730-cb3b76250ae8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Surfing Roe Sea",
      description:
        "Recusandae itaque earum rerum tenetur a sapiente delectus reiciendis...",
      featured: true,
    },
    {
      image:
        "https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      title: "Beach Waves",
    },
  ];

  return (
    <section id="activities" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-indigo-600 font-handwriting text-xl uppercase tracking-wider mb-4">
            Our Activities
          </p>
          <h2 className="text-5xl md:text-6xl font-bold uppercase text-gray-900">
            Explore the excitement
          </h2>
        </div>

        {/* Activities Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {activities.map((activity, index) => (
            <div
              key={index}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer ${
                activity.featured ? "md:row-span-1" : ""
              }`}
            >
              <img
                src={activity.image}
                alt={activity.title}
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold uppercase mb-2">
                  {activity.title}
                </h3>
                {activity.description && (
                  <p className="text-white/80">{activity.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-3 mt-12">
          <div className="w-4 h-4 bg-gray-300 rounded-full" />
          <div className="w-4 h-4 bg-indigo-600 rounded-full" />
          <div className="w-4 h-4 bg-gray-300 rounded-full" />
        </div>
      </div>
    </section>
  );
}

// Statistics Section
function StatisticsSection() {
  const stats = [
    { icon: ThumbsUp, value: "100%", label: "Happy Clients" },
    { icon: Users, value: "50+", label: "Expert Instructors" },
    { icon: Star, value: "1278+", label: "Positive Reviews" },
    { icon: Award, value: "40+", label: "Awards Won" },
  ];

  return (
    <section className="py-24 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-indigo-600 font-handwriting text-xl uppercase tracking-wider mb-4">
            Statistics
          </p>
          <h2 className="text-5xl md:text-6xl font-bold uppercase text-gray-900">
            Our Achievements
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all hover:-translate-y-2"
            >
              <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <stat.icon size={32} className="text-white" />
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-2">
                {stat.value}
              </p>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section
      className="relative py-32"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <p className="text-indigo-400 font-handwriting text-xl uppercase tracking-wider mb-4">
          Join Us
        </p>
        <h2 className="text-4xl md:text-6xl font-bold uppercase mb-8 leading-tight">
          Come and Have Fun With Our
          <br />
          Surfing Lessons
        </h2>
        <a
          href="#contact"
          className="inline-flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold uppercase tracking-wide hover:bg-indigo-700 transition-all hover:scale-105"
        >
          Get Started
          <ChevronRight size={24} />
        </a>
      </div>
    </section>
  );
}

// Team Section
function TeamSection() {
  const team = [
    {
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      name: "Marvin Joner",
      role: "Instructor",
    },
    {
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      name: "Patricia Woodrum",
      role: "Assistant",
    },
    {
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      name: "Hannaz Stone",
      role: "Surf Coach",
    },
  ];

  return (
    <section id="team" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-indigo-600 font-handwriting text-xl uppercase tracking-wider mb-4">
            Our Team
          </p>
          <h2 className="text-5xl md:text-6xl font-bold uppercase text-gray-900">
            Meet Our Coaches
          </h2>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div key={index} className="text-center group">
              <div className="relative w-64 h-64 mx-auto mb-6">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h3 className="text-2xl font-bold uppercase text-gray-900 mb-2">
                {member.name}
              </h3>
              <p className="text-gray-600 mb-4">{member.role}</p>
              <div className="flex justify-center gap-3">
                {[Facebook, Twitter, Instagram].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-11 h-11 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 transition-colors"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Quia voluptas aspernatur aurodit aut fugit, beatae vitae dicta sunt explicabo nemo enim ipsam voluptatem sed neatae vitae dicta ripiscing elit, sed do euismod tempor incidunt labore are dolore magna aliqua ut enim a minim adipiscing elit.",
      name: "Katrina Parker",
      role: "Happy Client",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    },
  ];

  return (
    <section className="py-24 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-indigo-600 font-handwriting text-xl uppercase tracking-wider mb-4">
            Reviews
          </p>
          <h2 className="text-5xl md:text-6xl font-bold uppercase text-gray-900">
            Clients Testimonials
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="flex gap-8 items-start">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Testimonial"
                className="hidden md:block w-48 h-64 object-cover rounded-2xl"
              />
              <div>
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={24}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <blockquote className="text-xl text-gray-700 mb-8 leading-relaxed italic">
                  "{testimonials[0].quote}"
                </blockquote>
                <div>
                  <p className="text-xl font-bold uppercase text-gray-900">
                    {testimonials[0].name}
                  </p>
                  <p className="text-gray-600">{testimonials[0].role}</p>
                </div>
              </div>
            </div>

            {/* Client Avatars */}
            <div className="flex justify-center gap-4 mt-8 pt-8 border-t">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/60?img=${i + 10}`}
                  alt="Client"
                  className={`w-14 h-14 rounded-full object-cover ${
                    i === 1 ? "ring-2 ring-indigo-600 ring-offset-2" : ""
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What should I bring to my surf lesson?",
      answer:
        "We provide all the necessary equipment including surfboards and wetsuits. Just bring sunscreen, a towel, and your enthusiasm!",
    },
    {
      question: "Are the instructors certified?",
      answer:
        "Yes, all our instructors are certified by international surfing associations and have years of experience teaching beginners to advanced surfers.",
    },
    {
      question: "Do I need to have prior surfing experience?",
      answer:
        "No prior experience is needed! We have programs for complete beginners as well as advanced surfers looking to improve their skills.",
    },
    {
      question: "What should I wear to the Surfing course?",
      answer:
        "Wear comfortable swimwear. We provide wetsuits appropriate for the water temperature. Rash guards are also recommended.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* FAQ Content */}
          <div>
            <p className="text-indigo-600 font-handwriting text-xl uppercase tracking-wider mb-4">
              FAQ's
            </p>
            <h2 className="text-5xl md:text-6xl font-bold uppercase text-gray-900 mb-12 leading-tight">
              Frequently Asked
              <br />
              Questions
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <button
                    className="w-full px-6 py-5 flex items-center justify-between text-left"
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                  >
                    <span className="text-lg font-bold uppercase text-gray-900">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={24}
                      className={`text-gray-600 transition-transform ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-5">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-4 bg-indigo-600 rounded-full opacity-20 blur-3xl" />
            <img
              src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Surfer"
              className="relative rounded-2xl w-full h-[600px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// Contact Form Section
function ContactSection() {
  return (
    <section
      id="contact"
      className="relative py-24"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1455264745730-cb3b76250ae8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-indigo-900/90" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="text-white">
            <p className="text-indigo-300 font-handwriting text-xl uppercase tracking-wider mb-4">
              Register Now
            </p>
            <h2 className="text-5xl md:text-6xl font-bold uppercase mb-8 leading-tight">
              Book Your Surfing
              <br />
              Lesson Now!
            </h2>
          </div>

          {/* Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <form className="space-y-6">
              <input
                type="text"
                placeholder="Name"
                className="w-full px-6 py-4 bg-white rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="tel"
                placeholder="Phone"
                className="w-full px-6 py-4 bg-white rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-6 py-4 bg-white rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select className="w-full px-6 py-4 bg-white rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select Service</option>
                <option value="surf">Surf Lessons</option>
                <option value="kite">Kite Surfing</option>
                <option value="coach">Professional Coach</option>
              </select>
              <textarea
                placeholder="Message"
                rows={4}
                className="w-full px-6 py-4 bg-white rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold uppercase tracking-wide hover:bg-indigo-700 transition-all hover:scale-105"
              >
                Submit Now
                <ChevronRight size={24} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer Section
function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo & Description */}
          <div>
            <Link href="/landing" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">ES</span>
              </div>
              <span className="text-2xl font-bold">Extreme Surfing</span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Duis aute irure dolor in reprehenderit in voluptate velit cillum
              dolore eu fugiat nulla pariatur.
            </p>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-6">Useful Links</h3>
            <ul className="space-y-3">
              {["Home", "About", "Services", "Blog", "Contact Us"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <span className="w-2 h-2 bg-indigo-600 rounded-full" />
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400">
                <Phone size={18} className="text-indigo-500" />
                +5689 2589 6325
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail size={18} className="text-indigo-500" />
                Info@seaquest.com
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin size={18} className="text-indigo-500 mt-1" />
                21 King Street Melbourne, 3000, Australia
              </li>
            </ul>
          </div>

          {/* Social Networks */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-6">
              Social Networks
            </h3>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram].map((Icon, index) => (
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
            Copyright 2024, seaquest.com All Rights Reserved.
          </p>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <a
        href="#hero"
        className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-indigo-700 transition-colors"
      >
        <ChevronDown size={24} className="rotate-180" />
      </a>
    </footer>
  );
}

// Main Landing Page Component
export default function LandingPage() {
  return (
    <main className="font-sans">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ActivitiesSection />
      <StatisticsSection />
      <CTASection />
      <TeamSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </main>
  );
}

"use client";

import { useState } from "react";
import { TemplateProps } from "../types";
import NavigationBar from "../shared/NavigationBar";
import BookingDrawer from "../shared/BookingDrawer";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import AmenitiesSection from "./AmenitiesSection";
import FacilitiesSection from "./FacilitiesSection";
import TestimonialsSection from "./TestimonialsSection";
import ContactSection from "./ContactSection";
import Footer from "@/components/Footer";

export default function LuxuryTemplate({ accommodation, onBook }: TemplateProps) {
    const [showBooking, setShowBooking] = useState(false);
    const themeColor = accommodation.theme_color || "#4F46E5";

    const handleBook = () => {
        setShowBooking(true);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <NavigationBar
                name={accommodation.name}
                themeColor={themeColor}
                variant="transparent"
                contactNo={accommodation.provider.user.contact_no}
                onBook={handleBook}
            />

            {/* Hero Section */}
            <HeroSection
                accommodation={accommodation}
                themeColor={themeColor}
                onBook={handleBook}
            />

            {/* About Section */}
            <AboutSection
                accommodation={accommodation}
                themeColor={themeColor}
            />

            {/* Amenities Section */}
            <AmenitiesSection
                accommodation={accommodation}
                themeColor={themeColor}
            />

            {/* Facilities Section */}
            <FacilitiesSection
                accommodation={accommodation}
                themeColor={themeColor}
            />

            {/* Testimonials Section */}
            <TestimonialsSection
                accommodation={accommodation}
                themeColor={themeColor}
            />

            {/* Contact Section */}
            <ContactSection
                accommodation={accommodation}
                themeColor={themeColor}
                onBook={handleBook}
            />

            {/* Footer */}
            <Footer />

            {/* Booking Drawer */}
            <BookingDrawer
                accommodation={accommodation}
                isOpen={showBooking}
                onClose={() => setShowBooking(false)}
                themeColor={themeColor}
            />
        </div>
    );
}

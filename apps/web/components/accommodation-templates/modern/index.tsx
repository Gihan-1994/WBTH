"use client";

import { useState } from "react";
import { TemplateProps } from "../types";
import NavigationBar from "../shared/NavigationBar";
import BookingDrawer from "../shared/BookingDrawer";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import AmenitiesSection from "./AmenitiesSection";
import GallerySection from "./GallerySection";
import ContactSection from "./ContactSection";
import Footer from "@/components/Footer";

export default function ModernTemplate({ accommodation, onBook }: TemplateProps) {
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
                variant="light"
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

            {/* Gallery Section */}
            <GallerySection
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

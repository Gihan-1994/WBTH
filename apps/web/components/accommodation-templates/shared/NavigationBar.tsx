"use client";

import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";

interface NavigationBarProps {
    name: string;
    themeColor: string;
    variant: "light" | "dark" | "transparent";
    contactNo?: string | null;
    onBook: () => void;
}

const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "amenities", label: "Amenities" },
    { id: "facilities", label: "Facilities" },
    { id: "contact", label: "Contact" },
];

export default function NavigationBar({
    name,
    themeColor,
    variant,
    contactNo,
    onBook,
}: NavigationBarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
        setIsOpen(false);
    };

    const bgClass =
        variant === "transparent"
            ? isScrolled
                ? "bg-white shadow-md"
                : "bg-transparent"
            : variant === "dark"
                ? "bg-gray-900"
                : "bg-white shadow-sm";

    const textClass =
        variant === "transparent"
            ? isScrolled
                ? "text-gray-900"
                : "text-white"
            : variant === "dark"
                ? "text-white"
                : "text-gray-900";

    const textMutedClass =
        variant === "transparent"
            ? isScrolled
                ? "text-gray-600"
                : "text-white/80"
            : variant === "dark"
                ? "text-gray-300"
                : "text-gray-600";

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo/Name */}
                    <button
                        onClick={() => scrollToSection("home")}
                        className={`text-lg md:text-xl font-bold ${textClass} truncate max-w-[200px]`}
                    >
                        {name}
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`text-sm font-medium ${textMutedClass} hover:${textClass} transition-colors`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {contactNo && (
                            <a
                                href={`tel:${contactNo}`}
                                className={`flex items-center gap-2 text-sm ${textMutedClass} hover:${textClass} transition-colors`}
                            >
                                <Phone size={16} />
                                {contactNo}
                            </a>
                        )}
                        <button
                            onClick={onBook}
                            className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors"
                            style={{ backgroundColor: themeColor }}
                        >
                            Book Now
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`md:hidden p-2 ${textClass}`}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100">
                    <div className="px-4 py-4 space-y-2">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                {item.label}
                            </button>
                        ))}
                        <button
                            onClick={onBook}
                            className="w-full mt-4 px-4 py-3 text-white font-semibold rounded-lg transition-colors"
                            style={{ backgroundColor: themeColor }}
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}

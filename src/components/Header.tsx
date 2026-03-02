"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface HeaderProps {
    onEnquire: () => void;
}

export default function Header({ onEnquire }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {/* Top Bar - Hidden on scroll for a cleaner look */}
            <div className={`bg-primary-navy text-white py-2 px-4 text-center text-sm font-medium transition-all duration-300 ${isScrolled ? "-translate-y-full opacity-0 h-0 p-0" : "translate-y-0 opacity-100"
                }`}>
                Book a 15-Minute or 40-Minute Migration Consultation Today
            </div>

            {/* Main Header */}
            <header
                className={`fixed w-full z-50 transition-all duration-500 ${isScrolled
                    ? "top-0 bg-white shadow-lg py-3"
                    : "top-10 bg-transparent py-6"
                    }`}
            >
                <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
                    <Link href="/" className="relative w-48 h-12 transition-all duration-300">
                        <Image
                            src="/logo.png"
                            alt="Forte Migration Logo"
                            fill
                            className="object-contain transition-all duration-300"
                            priority
                        />
                    </Link>

                    <nav className={`hidden lg:flex items-center space-x-10 transition-colors duration-300 ${isScrolled ? "text-primary-navy" : "text-white"
                        }`}>
                        <Link href="/" className="font-bold hover:text-accent-green transition-colors">Home</Link>
                        <Link href="#services" className="font-bold hover:text-accent-green transition-colors">Services</Link>
                        <Link href="#about" className="font-bold hover:text-accent-green transition-colors">About Us</Link>
                        <Link href="#contact" className="font-bold hover:text-accent-green transition-colors">Contact</Link>
                        <button
                            onClick={onEnquire}
                            className={`px-8 py-3 rounded-xl font-bold transition-all ${isScrolled
                                ? "bg-primary-navy text-white hover:bg-green-600"
                                : "bg-white text-primary-navy hover:bg-green-600 hover:text-white"
                                }`}>
                            Enquire Now
                        </button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button className={`lg:hidden transition-colors ${isScrolled ? "text-primary-navy" : "text-white"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-9 h-9">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>
            </header>
        </>
    );
}

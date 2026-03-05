"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ChevronDown, Menu as MenuIcon, X, Plus, ChevronRight } from "lucide-react";

interface HeaderProps {
    onEnquire: () => void;
    forceSolid?: boolean;
}

export default function Header({ onEnquire, forceSolid = false }: HeaderProps) {
    const pathname = usePathname();
    const isHomePage = pathname === "/";
    const supabase = createClient();
    const [isScrolled, setIsScrolled] = useState(false);
    const effectiveIsScrolled = isScrolled || forceSolid;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
    const menuItems = [
        { id: '1', label: 'Home', href: '/' },
        { id: '2', label: 'Services', href: '/#services' },
        { id: '3', label: 'About Us', href: '/about' },
        { id: '4', label: 'Resources', href: '/resources' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const renderNavItems = (isMobile: boolean = false) => {
        return menuItems.map(item => (
            <Link
                key={item.id}
                href={item.href}
                onClick={() => isMobile && setIsMobileMenuOpen(false)}
                className={isMobile ? "block font-bold text-xl text-primary-navy py-1" : "font-bold hover:text-accent-green transition-colors"}
            >
                {item.label}
            </Link>
        ));
    };

    return (
        <>
            {/* Top Bar - Only visible on inside pages */}
            {!isHomePage && (
                <div
                    onClick={() => onEnquire()}
                    className={`bg-primary-navy hover:bg-accent-green cursor-pointer text-white py-2 px-4 text-center text-sm font-bold transition-all duration-300 ${effectiveIsScrolled ? "-translate-y-full opacity-0 h-0 p-0 overflow-hidden" : "translate-y-0 opacity-100"
                        }`}>
                    Book a 15-Minute or 40-Minute Migration Consultation Today
                </div>
            )}

            {/* Main Header */}
            <header
                className={`fixed w-full z-50 transition-all duration-500 ${effectiveIsScrolled
                    ? "top-0 bg-white shadow-lg py-3"
                    : `${isHomePage ? "top-0" : "top-10"} bg-transparent py-6`
                    }`}
            >
                <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
                    <Link href="/" className="relative w-64 h-16 transition-all duration-300">
                        <Image
                            src="/logo.png"
                            alt="Forte Migration Logo"
                            fill
                            className={`object-contain transition-all duration-300 ${effectiveIsScrolled ? "" : "brightness-0 invert"}`}
                            priority
                        />
                    </Link>

                    <nav className={`hidden lg:flex items-center space-x-10 transition-colors duration-300 ${effectiveIsScrolled ? "text-primary-navy" : "text-white"}`}>
                        {renderNavItems(false)}
                        <Link
                            href="/consult"
                            className={`px-8 py-3 rounded-xl font-bold transition-all ${effectiveIsScrolled
                                ? "bg-primary-navy text-white hover:bg-accent-green shadow-lg"
                                : "bg-white text-primary-navy hover:bg-accent-green hover:text-white"
                                }`}>
                            Consult Now
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className={`lg:hidden transition-colors ${effectiveIsScrolled ? "text-primary-navy" : "text-white"}`}>
                        <MenuIcon className="w-9 h-9" />
                    </button>
                </div>

                {/* Mobile Drawer */}
                <div className={`fixed inset-0 z-[100] lg:hidden transition-all duration-500 ${isMobileMenuOpen ? "visible" : "invisible"}`}>
                    <div
                        className={`absolute inset-0 bg-primary-navy/40 backdrop-blur-md transition-opacity duration-500 ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    <div className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 transform ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
                        <div className="flex flex-col h-full">
                            <div className="p-6 flex items-center justify-between border-b border-gray-100">
                                <Image src="/logo.png" alt="Logo" width={180} height={45} className="object-contain" />
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X className="w-8 h-8 text-primary-navy" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <nav className="space-y-4">
                                    {renderNavItems(true)}
                                </nav>
                            </div>

                            <div className="p-6 border-t border-gray-100">
                                <Link
                                    href="/consult"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full bg-primary-navy text-white py-4 rounded-2xl font-bold text-center text-lg hover:bg-accent-green transition-all shadow-xl block"
                                >
                                    Consult Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

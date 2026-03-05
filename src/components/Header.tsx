"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { ChevronDown, Menu as MenuIcon, X, Plus, ChevronRight } from "lucide-react";

interface HeaderProps {
    onEnquire: () => void;
}

export default function Header({ onEnquire }: HeaderProps) {
    const supabase = createClient();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [menuItems, setMenuItems] = useState<{ id: string; label: string; href: string; parent_id?: string | null }[]>([]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const fetchMenu = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('menu_items')
                    .select('*')
                    .order('order_index', { ascending: true });

                if (!error && data) {
                    setMenuItems(data);
                }
            } catch (err) {
                console.error('Error fetching menu:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    const renderNavItems = (isMobile: boolean = false) => {
        if (loading) return null;

        if (menuItems.length === 0) {
            // Fallbacks if no menu items found in DB
            const fallbacks = [
                { id: '1', label: 'Home', href: '/' },
                { id: '2', label: 'Services', href: '#services' },
                { id: '3', label: 'About Us', href: '#about' },
                { id: '4', label: 'Contact', href: '#contact' },
            ];
            return fallbacks.map(item => (
                <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => isMobile && setIsMobileMenuOpen(false)}
                    className={isMobile ? "block font-bold text-xl text-primary-navy py-2" : "font-bold hover:text-accent-green transition-colors"}
                >
                    {item.label}
                </Link>
            ));
        }

        return menuItems.filter(item => !item.parent_id).map((parent) => {
            const children = menuItems.filter(child => child.parent_id === parent.id);

            if (children.length > 0) {
                if (isMobile) {
                    const isExpanded = expandedMobileItem === parent.id;
                    return (
                        <div key={parent.id} className="space-y-2">
                            <button
                                onClick={() => setExpandedMobileItem(isExpanded ? null : parent.id)}
                                className="flex items-center justify-between w-full font-bold text-xl text-primary-navy py-2 text-left"
                            >
                                {parent.label}
                                <Plus className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-45" : ""}`} />
                            </button>
                            <div className={`pl-4 space-y-2 overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                                {children.map(child => (
                                    <Link
                                        key={child.id}
                                        href={child.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-2 py-2 text-gray-500 font-bold hover:text-accent-green"
                                    >
                                        <ChevronRight className="w-3 h-3 text-accent-green" />
                                        {child.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div key={parent.id} className="relative group/menu">
                            <button className="flex items-center gap-1 font-bold hover:text-accent-green transition-colors py-2">
                                {parent.label}
                                <ChevronDown className="w-4 h-4 transition-transform group-hover/menu:rotate-180" />
                            </button>
                            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 opacity-0 translate-y-2 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:translate-y-0 group-hover/menu:pointer-events-auto transition-all duration-300 z-[100]">
                                {children.map(child => (
                                    <Link
                                        key={child.id}
                                        href={child.href}
                                        className="block px-6 py-2.5 text-sm font-bold text-primary-navy hover:text-accent-green hover:bg-gray-50 transition-colors"
                                    >
                                        {child.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                }
            }

            return (
                <Link
                    key={parent.id}
                    href={parent.href}
                    onClick={() => isMobile && setIsMobileMenuOpen(false)}
                    className={isMobile ? "block font-bold text-xl text-primary-navy py-2" : "font-bold hover:text-accent-green transition-colors"}
                >
                    {parent.label}
                </Link>
            );
        });
    };

    return (
        <>
            {/* Top Bar */}
            <div className={`bg-primary-navy text-white py-2 px-4 text-center text-sm font-medium transition-all duration-300 ${isScrolled ? "-translate-y-full opacity-0 h-0 p-0 overflow-hidden" : "translate-y-0 opacity-100"
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
                            className={`object-contain transition-all duration-300 ${isScrolled ? "" : "brightness-0 invert"}`}
                            priority
                        />
                    </Link>

                    <nav className={`hidden lg:flex items-center space-x-10 transition-colors duration-300 ${isScrolled ? "text-primary-navy" : "text-white"}`}>
                        {renderNavItems(false)}
                        <button
                            onClick={onEnquire}
                            className={`px-8 py-3 rounded-xl font-bold transition-all ${isScrolled
                                ? "bg-primary-navy text-white hover:bg-accent-green shadow-lg"
                                : "bg-white text-primary-navy hover:bg-accent-green hover:text-white"
                                }`}>
                            Enquire Now
                        </button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className={`lg:hidden transition-colors ${isScrolled ? "text-primary-navy" : "text-white"}`}>
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
                                <Image src="/logo.png" alt="Logo" width={120} height={30} className="object-contain" />
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
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        onEnquire();
                                    }}
                                    className="w-full bg-primary-navy text-white py-4 rounded-2xl font-bold text-lg hover:bg-accent-green transition-all shadow-xl"
                                >
                                    Enquire Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu as MenuIcon, X, Mail } from "lucide-react";

interface HeaderProps {
    onEnquire: () => void;
    forceSolid?: boolean;
}

export default function Header({ onEnquire, forceSolid = false }: HeaderProps) {
    const pathname = usePathname();
    const isHomePage = pathname === "/";
    const [isScrolled, setIsScrolled] = useState(false);
    const effectiveIsScrolled = isScrolled || forceSolid;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>(null);

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

    // Track active section on homepage via IntersectionObserver
    useEffect(() => {
        if (!isHomePage) { setActiveSection(null); return; }
        const section = document.getElementById('services');
        if (!section) return;
        const observer = new IntersectionObserver(
            ([entry]) => setActiveSection(entry.isIntersecting ? 'services' : null),
            { rootMargin: '-30% 0px -30% 0px', threshold: 0 }
        );
        observer.observe(section);
        return () => observer.disconnect();
    }, [isHomePage]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; }
    }, [isMobileMenuOpen]);

    return (
        <>
            {/* Top Bar - Only visible on inside pages */}
            {!isHomePage && (
                <div
                    onClick={() => onEnquire()}
                    className={`fixed top-0 left-0 right-0 z-[60] bg-primary-navy hover:bg-accent-green cursor-pointer text-white py-2 px-4 text-center text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${effectiveIsScrolled ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
                        }`}>
                    Book a 15-Minute or 40-Minute Migration Consultation Today
                </div>
            )}

            {/* Main Header Container */}
            <header
                className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-in-out px-4 md:px-8 w-full max-w-7xl pt-6 ${effectiveIsScrolled ? "top-0" : `${isHomePage ? "top-0" : "top-10"}`
                    }`}
            >
                <div
                    className={`container mx-auto transition-all duration-500 flex items-center justify-between rounded-[2.5rem] px-6 lg:px-8 py-4 ${effectiveIsScrolled
                        ? "bg-white/85 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/40 mt-2"
                        : "bg-transparent border border-transparent"
                        }`}
                >
                    {/* Logo Section */}
                    <Link
                        href="/"
                        className={`relative transition-all duration-500 block ${effectiveIsScrolled
                            ? "w-48 lg:w-60 h-12 lg:h-14 -ml-2 lg:ml-1"
                            : "w-56 lg:w-80 h-14 lg:h-20 -ml-4 lg:-ml-3"
                            }`}
                    >
                        <Image
                            src="/logo.png"
                            alt="Forte Migration Logo"
                            fill
                            className={`object-contain object-left transition-all duration-500 ${effectiveIsScrolled ? "" : "brightness-0 invert"
                                }`}
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className={`hidden lg:flex items-center space-x-10 transition-colors duration-500 ${effectiveIsScrolled ? "text-primary-navy" : "text-white"
                        }`}>
                        <div className="flex items-center space-x-8">
                            {menuItems.map(item => {
                                const isActive =
                                    item.href === '/#services'
                                        ? activeSection === 'services'
                                        : item.href === '/'
                                            ? pathname === '/' && activeSection !== 'services'
                                            : pathname.startsWith(item.href.split('#')[0]) && item.href.split('#')[0] !== '/';
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className={`font-bold text-base hover:text-accent-green transition-colors uppercase tracking-widest relative group ${isActive ? 'text-accent-green' : ''}`}
                                    >
                                        {item.label}
                                        <span className={`absolute -bottom-2 left-0 h-0.5 bg-accent-green transition-all ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                                    </Link>
                                );
                            })}
                        </div>
                        <div className="h-4 w-[1px] bg-gray-300/30"></div>
                        <Link
                            href="/consult"
                            className={`px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 transform hover:-translate-y-1 block ${effectiveIsScrolled
                                ? "bg-primary-navy text-white hover:bg-accent-green shadow-xl shadow-primary-navy/20"
                                : "bg-white text-primary-navy hover:bg-accent-green hover:text-white shadow-xl shadow-black/10"
                                }`}
                        >
                            Consult Now
                        </Link>
                    </nav>

                    {/* Mobile Menu Button - Sleek toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className={`lg:hidden p-3 rounded-2xl transition-all ${effectiveIsScrolled
                            ? "text-primary-navy bg-gray-100/80 hover:bg-gray-200"
                            : "text-white bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20"
                            }`}
                        aria-label="Open Menu"
                    >
                        <MenuIcon className="w-6 h-6" />
                    </button>
                </div>
            </header>

            {/* Mobile Drawer - MOVED OUTSIDE HEADER TO PREVENT CSS TRANSFORM CONTAINMENT ISSUES */}
            <div className={`fixed inset-0 z-[9999] lg:hidden transition-all duration-500 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                {/* Backdrop Overlay - Deep blur */}
                <div
                    className={`absolute inset-0 bg-primary-navy/90 backdrop-blur-xl transition-opacity duration-500 ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Drawer Menu Panel */}
                <div className={`absolute top-0 right-0 h-full w-[90%] max-w-[400px] bg-white shadow-[-30px_0_60px_rgba(0,0,0,0.3)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>

                    {/* Drawer Header Elements */}
                    <div className="flex items-center justify-between p-6 px-8 border-b border-gray-100/50">
                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="relative w-36 h-10 block">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                fill
                                className="object-contain object-left"
                            />
                        </Link>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-full transition-all group active:scale-95"
                        >
                            <X className="w-6 h-6 text-primary-navy group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>

                    {/* Navigation Container */}
                    <div className="flex-1 overflow-y-auto px-8 py-10 flex flex-col bg-slate-50/50">
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8">Navigation</p>

                        <nav className="flex flex-col space-y-4">
                            {menuItems.map((item, i) => {
                                const isActive =
                                    item.href === '/#services'
                                        ? activeSection === 'services'
                                        : item.href === '/'
                                            ? pathname === '/' && activeSection !== 'services'
                                            : pathname.startsWith(item.href.split('#')[0]) && item.href.split('#')[0] !== '/';
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="group flex flex-col py-2"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={`text-3xl font-black transition-colors duration-300 ${isActive ? 'text-accent-green' : 'text-primary-navy group-hover:text-accent-green'}`}>
                                                {item.label}
                                            </span>
                                            <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 group-hover:border-accent-green group-hover:bg-accent-green/5">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-accent-green">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className={`h-[2px] bg-accent-green mt-2 transition-all duration-500 max-w-[40px] ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></div>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Support Info Block */}
                        <div className="mt-auto pt-16">
                            <div className="bg-primary-navy rounded-3xl p-6 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-green/20 rounded-full blur-2xl -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                                <Mail className="w-6 h-6 text-accent-green mb-4 relative z-10" />
                                <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-1 relative z-10">Direct Support</p>
                                <p className="text-sm font-bold truncate relative z-10">support@fortemigration.com.au</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
                        <Link
                            href="/consult"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="w-full bg-accent-green hover:bg-primary-navy text-white h-16 rounded-[1rem] font-black text-lg transition-all duration-300 shadow-xl shadow-accent-green/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            Book Consultation
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    </div>

                </div>
            </div>
        </>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled up to given distance
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set the top cordinate to 0
    // make scrolling smooth
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className={`fixed bottom-8 right-8 z-[90] transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-50 pointer-events-none'}`}>
            <button
                onClick={scrollToTop}
                className="group relative w-12 h-12 md:w-14 md:h-14 bg-primary-navy/80 hover:bg-accent-green backdrop-blur-md text-white rounded-2xl shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 border border-white/20"
                aria-label="Scroll to top"
            >
                <ChevronUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />

                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-accent-green/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
        </div>
    );
}

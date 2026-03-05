'use client';

import React, { createContext, useContext, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import BookingModal from './BookingModal';
import ScrollToTop from './ScrollToTop';

interface BookingContextType {
    openBooking: (duration?: 15 | 40 | null) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) throw new Error('useBooking must be used within a PageLayout');
    return context;
};

interface PageLayoutProps {
    children: React.ReactNode;
    forceSolidHeader?: boolean;
}

export default function PageLayout({ children, forceSolidHeader = false }: PageLayoutProps) {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState<15 | 40 | null>(null);

    const openBooking = (duration: 15 | 40 | null = null) => {
        setSelectedDuration(duration);
        setIsBookingOpen(true);
    };

    return (
        <BookingContext.Provider value={{ openBooking }}>
            <div className="min-h-screen flex flex-col">
                <Header onEnquire={() => openBooking()} forceSolid={forceSolidHeader} />

                <main className="flex-1">
                    {children}
                </main>

                <Footer />

                <BookingModal
                    isOpen={isBookingOpen}
                    onClose={() => setIsBookingOpen(false)}
                    initialDuration={selectedDuration}
                />

                <ScrollToTop />
            </div>
        </BookingContext.Provider>
    );
}

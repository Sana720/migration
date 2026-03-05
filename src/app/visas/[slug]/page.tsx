"use client";

import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";
import BookingModal from "@/components/BookingModal";
import { useState, use } from "react";

export default function VisaPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState<15 | 40 | null>(null);

    const openBooking = (duration: 15 | 40 | null = null) => {
        setSelectedDuration(duration);
        setIsBookingOpen(true);
    };

    // Mock data based on the slug
    const visaData = {
        title: "Temporary Graduate visa",
        subclass: "Subclass 485",
        description: "This visa is for international students who have recently graduated with skills and qualifications that are relevant to specific occupations in Australia. It lets you live, study and work in Australia temporarily.",
        overview: [
            { label: "Stay", value: "Usually between 2 and 4 years, depending on your qualification." },
            { label: "Cost", value: "From AUD 1,895" },
            { label: "Processing times", value: "Varies" },
        ],
        sections: [
            {
                title: "Overview",
                content: "The Temporary Graduate visa (subclass 485) lets international students live, study and work in Australia after they have finished their studies. There are two streams: the Graduate Work stream and the Post-Study Work stream. You must be in Australia when you apply for this visa and when we decide your application."
            },
            {
                title: "Eligibility",
                content: "You must be under 50 years of age, hold an eligible visa, and have a recent qualification in a CRICOS-registered course. You also need to meet specific English language requirements and have adequate health insurance."
            },
            {
                title: "With this visa you can",
                content: "Work in Australia, bring your immediate family with you, and travel in and out of Australia as many times as you want while the visa is valid."
            }
        ]
    };

    return (
        <main className="min-h-screen bg-gray-50/50">
            <Header onEnquire={() => openBooking()} />

            {/* Breadcrumbs */}
            <nav className="bg-white border-b border-gray-200 pt-32 pb-4">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-primary-navy">Home</Link>
                        <span>/</span>
                        <Link href="#services" className="hover:text-primary-navy">Visas</Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">{visaData.title}</span>
                    </div>
                </div>
            </nav>

            {/* Hero Header Area */}
            <section className="bg-white border-b border-gray-200 py-12">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="max-w-4xl">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-primary-navy mb-4">
                            {visaData.title} <span className="text-gray-400 font-light">({visaData.subclass})</span>
                        </h1>
                        <p className="text-xl text-gray-700 leading-relaxed mb-8">
                            {visaData.description}
                        </p>

                        {/* Quick Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {visaData.overview.map((item, i) => (
                                <div key={i} className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                                    <div className="text-sm font-bold text-secondary-blue uppercase tracking-wider mb-2">{item.label}</div>
                                    <div className="text-lg font-bold text-primary-navy">{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="py-12">
                <div className="container mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-12">

                    {/* Left Column - Detailed Info */}
                    <div className="flex-1 space-y-12">
                        {visaData.sections.map((section, i) => (
                            <div key={i} className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl md:text-3xl font-bold text-primary-navy mb-6 pb-2 border-b-4 border-accent-green inline-block">
                                    {section.title}
                                </h2>
                                <div className="prose prose-lg text-gray-600 max-w-none">
                                    <p>{section.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column - Sidebar Actions */}
                    <div className="lg:w-80 space-y-6">
                        <div className="bg-primary-navy text-white p-8 rounded-2xl shadow-xl">
                            <h3 className="text-xl font-bold mb-6 italic border-b border-white/20 pb-4">Interested in this visa?</h3>
                            <p className="text-white/80 mb-8">
                                Our experts can help you with the assessment and application process.
                            </p>
                            <button onClick={() => openBooking()} className="w-full bg-accent-green text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg transform active:scale-95">
                                Check Eligibility
                            </button>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-primary-navy mb-4">Related Visas</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="#" className="flex items-center gap-2 text-secondary-blue hover:text-primary-navy font-medium group transition-all">
                                        <span className="text-accent-green group-hover:translate-x-1 transition-transform">→</span>
                                        Skilled Independent (189)
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="flex items-center gap-2 text-secondary-blue hover:text-primary-navy font-medium group transition-all">
                                        <span className="text-accent-green group-hover:translate-x-1 transition-transform">→</span>
                                        Student Visa (500)
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Support Box */}
                        <div className="bg-blue-600 p-8 rounded-2xl shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full transform group-hover:scale-110 transition-transform"></div>
                            <h3 className="text-white font-bold text-xl mb-4 relative z-10">Need Help?</h3>
                            <p className="text-white/90 relative z-10 text-sm mb-6">
                                Talk to our migration agent about your specific situation.
                            </p>
                            <Link href="/contact" className="inline-block bg-white text-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-all relative z-10">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Branding Overlay */}
            <footer className="bg-primary-navy text-white py-12 mt-12 border-t border-white/10">
                <div className="container mx-auto px-4 md:px-8 text-center text-white/50 text-sm">
                    <p>© {new Date().getFullYear()} Forte Migration. Formal government support and advisory.</p>
                </div>
            </footer>

            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                initialDuration={selectedDuration}
            />
        </main>
    );
}

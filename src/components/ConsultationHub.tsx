'use client';

import React from 'react';
import { useBooking } from './PageLayout';

export default function ConsultationHub() {
    const { openBooking } = useBooking();

    return (
        <section className="pt-8 pb-20 bg-bg-cream/30 md:pt-12">
            <div className="container mx-auto px-4 md:px-8 text-center">
                <h2 className="text-3xl md:text-5xl mb-6 font-bold text-primary-navy tracking-tight">Ready to Start?</h2>
                <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                    Book a professional consultation with our migration experts today.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-sm md:text-base items-stretch">
                    {/* Strategy Session Card */}
                    <div
                        onClick={() => openBooking(15)}
                        className="group relative bg-primary-navy p-10 rounded-[3.5rem] shadow-xl cursor-pointer transition-all duration-700 ease-in-out hover:-translate-y-3 hover:bg-accent-green hover:shadow-[0_40px_80px_rgba(32,178,170,0.3)] flex flex-col items-center"
                    >
                        <div className="text-white/80 font-bold text-lg mb-2 uppercase tracking-widest">Initial Assessment</div>
                        <div className="text-white font-black text-3xl mb-4 text-center">Strategy Session</div>

                        <div className="text-6xl font-black mb-6 text-white flex items-baseline gap-2">
                            15 <span className="text-2xl font-medium text-white/60">min</span>
                        </div>

                        <ul className="text-left space-y-4 mb-10 text-white/90 w-full max-w-[240px] mx-auto border-t border-white/10 pt-8 mt-4">
                            <li className="flex items-center gap-3">
                                <span className="bg-white/10 p-1 rounded-full text-white">✓</span>
                                Initial eligibility assessment
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="bg-white/10 p-1 rounded-full text-white">✓</span>
                                Quick visa query resolution
                            </li>
                        </ul>

                        <button className="w-full bg-white text-primary-navy py-4 rounded-2xl font-black text-lg transition-all duration-500 group-hover:text-accent-green group-hover:scale-[1.05] shadow-lg">
                            Book 15 Min Chat
                        </button>
                    </div>

                    {/* End-to-End Planning Card */}
                    <div
                        onClick={() => openBooking(40)}
                        className="group relative bg-accent-green p-10 rounded-[3.5rem] shadow-xl cursor-pointer transition-all duration-700 ease-in-out hover:-translate-y-3 hover:bg-primary-navy hover:shadow-[0_40px_80px_rgba(0,32,91,0.3)] flex flex-col items-center z-10"
                    >
                        <div className="text-white/80 font-bold text-lg mb-2 uppercase tracking-widest">Comprehensive Review</div>
                        <div className="text-white font-black text-3xl mb-4 text-center">Deep Dive Session</div>

                        <div className="text-6xl font-black mb-6 text-white flex items-baseline gap-2">
                            40 <span className="text-2xl font-medium text-white/60">min</span>
                        </div>

                        <ul className="text-left space-y-4 mb-10 text-white/90 w-full max-w-[240px] mx-auto border-t border-white/10 pt-8 mt-4">
                            <li className="flex items-center gap-3">
                                <span className="bg-white/10 p-1 rounded-full text-white">★</span>
                                Detailed path mapping
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="bg-white/10 p-1 rounded-full text-white">✓</span>
                                Comprehensive document review
                            </li>
                        </ul>

                        <button className="w-full bg-white text-accent-green py-4 rounded-2xl font-black text-lg transition-all duration-500 group-hover:text-primary-navy group-hover:scale-[1.05] shadow-lg">
                            Book 40 Min Session
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

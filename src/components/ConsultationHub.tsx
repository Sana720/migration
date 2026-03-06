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
                        className="group bg-white p-10 rounded-[3.5rem] shadow-xl border-t-8 border-primary-navy cursor-pointer transform hover:scale-[1.02] hover:border-[#20B2AA] hover:shadow-[0_40px_80px_rgba(32,178,170,0.2)] transition-all duration-500 flex flex-col items-center"
                    >
                        <div className="text-primary-navy font-black text-2xl mb-4 group-hover:text-[#20B2AA] transition-colors">Strategy Session</div>
                        <div className="text-5xl font-black mb-4 text-primary-navy group-hover:text-[#20B2AA] transition-colors">15 <span className="text-2xl font-normal text-gray-400 group-hover:text-[#20B2AA] transition-colors">min</span></div>
                        <p className="text-xs text-accent-green mb-8 font-black uppercase tracking-widest text-center group-hover:text-[#20B2AA] transition-colors">Initial Assessment</p>

                        <ul className="text-left space-y-4 mb-10 text-gray-600 w-full max-w-[240px] mx-auto">
                            <li className="flex items-center gap-3 font-bold group-hover:text-primary-navy transition-all">
                                <span className="text-accent-green group-hover:text-[#20B2AA]">✓</span>
                                Initial eligibility assessment
                            </li>
                            <li className="flex items-center gap-3 font-bold group-hover:text-primary-navy transition-all">
                                <span className="text-accent-green group-hover:text-[#20B2AA]">✓</span>
                                Quick visa query resolution
                            </li>
                        </ul>

                        <button className="w-full bg-primary-navy text-white py-4 rounded-2xl font-black text-lg group-hover:bg-[#20B2AA] transition-all shadow-lg">
                            Book 15 Min Chat
                        </button>
                    </div>

                    {/* End-to-End Planning Card */}
                    <div
                        onClick={() => openBooking(40)}
                        className="group bg-white p-10 rounded-[3.5rem] shadow-2xl border-t-8 border-primary-navy scale-105 cursor-pointer transform hover:scale-[1.07] hover:border-[#20B2AA] hover:shadow-[0_40px_80px_rgba(32,178,170,0.3)] transition-all duration-500 flex flex-col items-center z-10"
                    >
                        <div className="text-primary-navy font-black text-2xl mb-4 group-hover:text-[#20B2AA] transition-colors">Deep Dive Session</div>
                        <div className="text-5xl font-black mb-4 text-primary-navy group-hover:text-[#20B2AA] transition-colors">40 <span className="text-2xl font-normal text-gray-400 group-hover:text-[#20B2AA] transition-colors">min</span></div>
                        <p className="text-xs text-primary-navy mb-8 font-black uppercase tracking-widest text-center group-hover:text-[#20B2AA] transition-colors">Comprehensive Review</p>

                        <ul className="text-left space-y-4 mb-10 text-gray-600 w-full max-w-[240px] mx-auto">
                            <li className="flex items-center gap-3 font-bold group-hover:text-primary-navy transition-all">
                                <span className="text-accent-green group-hover:text-[#20B2AA]">★</span>
                                Detailed path mapping
                            </li>
                            <li className="flex items-center gap-3 font-bold group-hover:text-primary-navy transition-all">
                                <span className="text-accent-green group-hover:text-[#20B2AA]">✓</span>
                                Comprehensive document review
                            </li>
                        </ul>

                        <button className="w-full bg-primary-navy text-white py-4 rounded-2xl font-black text-lg group-hover:bg-[#20B2AA] transition-all shadow-lg">
                            Book 40 Min Session
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

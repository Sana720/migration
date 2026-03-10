'use client';

import React from 'react';
import { useBooking } from './PageLayout';

export default function ConsultationHub() {
    const { openBooking } = useBooking();

    return (
        <section className="py-20 bg-bg-cream/30">
            <div className="container mx-auto px-4 md:px-8 text-center">
                <h2 className="text-3xl md:text-5xl mb-6 font-bold text-primary-navy">Ready to Start?</h2>
                <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                    Book a professional consultation with our migration experts today.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-sm md:text-base items-stretch">
                    <div className="group bg-white p-10 rounded-[3.5rem] shadow-xl border-t-8 border-primary-navy hover:border-accent-green transform hover:scale-[1.02] transition-all flex flex-col h-full">
                        <div className="text-primary-navy font-bold text-2xl mb-4">Strategy Session</div>
                        <div className="text-5xl font-extrabold mb-4 text-primary-navy group-hover:text-accent-green transition-colors">15 <span className="text-2xl font-normal text-gray-400 group-hover:text-accent-green transition-colors">min</span></div>
                        <p className="text-xs text-primary-navy mb-8 font-bold uppercase tracking-widest text-center">Initial Assessment</p>
                        <ul className="text-left space-y-4 mb-10 text-gray-600 flex-grow">
                            <li className="flex items-center gap-3 font-bold text-primary-navy">
                                <span className="text-primary-navy">★</span>
                                Initial eligibility assessment
                            </li>
                            <li className="flex items-center gap-3 font-bold text-primary-navy">
                                <span className="text-primary-navy">★</span>
                                Quick visa query resolution
                            </li>
                        </ul>
                        <button
                            onClick={() => openBooking(15)}
                            className="w-full mt-auto bg-primary-navy text-white py-4 rounded-2xl font-bold text-lg hover:bg-accent-green group-hover:bg-accent-green transition-all shadow-lg">
                            Book 15 minutes session
                        </button>
                    </div>

                    <div className="group bg-white p-10 rounded-[3.5rem] shadow-xl border-t-8 border-primary-navy hover:border-accent-green transform hover:scale-[1.05] transition-all z-10 flex flex-col h-full">
                        <div className="text-primary-navy font-bold text-2xl mb-4">Deep Dive Session</div>
                        <div className="text-5xl font-extrabold mb-4 text-primary-navy group-hover:text-accent-green transition-colors">40 <span className="text-2xl font-normal text-gray-400 group-hover:text-accent-green transition-colors">min</span></div>
                        <p className="text-xs text-primary-navy mb-8 font-bold uppercase tracking-widest text-center">Comprehensive Review</p>
                        <ul className="text-left space-y-4 mb-10 text-gray-600 flex-grow">
                            <li className="flex items-center gap-3 font-bold text-primary-navy">
                                <span className="text-primary-navy">★</span>
                                Detailed Path way
                            </li>
                            <li className="flex items-center gap-3 font-bold text-primary-navy">
                                <span className="text-primary-navy">★</span>
                                Comprehensive document review
                            </li>
                        </ul>
                        <button
                            onClick={() => openBooking(40)}
                            className="w-full mt-auto bg-primary-navy text-white py-4 rounded-2xl font-bold text-lg hover:bg-accent-green group-hover:bg-accent-green transition-all shadow-lg">
                            Book 40 minutes session
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

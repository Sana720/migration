'use client';

import React from 'react';
import Image from 'next/image';
import { useBooking } from './PageLayout';
import { Calendar, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ConsultationFeatured() {
    const { openBooking } = useBooking();

    return (
        <section className="relative py-24 md:py-32 overflow-hidden bg-primary-navy">
            {/* Immersive Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/aboriginal-bg.png"
                    alt="Background Pattern"
                    fill
                    className="object-cover opacity-20 scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-navy via-primary-navy/90 to-transparent z-10"></div>
            </div>

            <div className="container mx-auto px-4 md:px-8 relative z-20">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left: Content & Hook */}
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full text-accent-green font-black text-[10px] mb-8 border border-white/10 uppercase tracking-[0.3em] shadow-2xl">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green"></span>
                            </span>
                            Start Your Journey Today
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-8">
                            Ready to <span className="text-accent-green">Succeed</span> in Australia?
                        </h2>
                        <p className="text-xl text-white/70 mb-12 max-w-xl leading-relaxed font-medium">
                            Don't leave your future to chance. Get a definitive strategy mapped out by our expert MARN agents in a one-on-one session.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start mb-12">
                            <div className="flex items-center gap-3 text-white/80 font-bold">
                                <ShieldCheck className="w-5 h-5 text-accent-green" />
                                100% Confidential
                            </div>
                            <div className="flex items-center gap-3 text-white/80 font-bold">
                                <Clock className="w-5 h-5 text-accent-green" />
                                Instant Booking
                            </div>
                        </div>
                    </div>

                    {/* Right: Glassmorphic Cards Spread */}
                    <div className="lg:w-1/2 w-full grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                        {/* Decorative Glow */}
                        <div className="absolute -top-12 -right-12 w-64 h-64 bg-accent-green/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
                        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-secondary-blue/20 rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>

                        {/* Card 1: 15 Min */}
                        <div
                            onClick={() => openBooking(15)}
                            className="group bg-white/10 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] hover:bg-accent-green transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex flex-col items-center text-center"
                        >
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:bg-white group-hover:scale-110 transition-all">
                                <Clock className="w-8 h-8 text-accent-green group-hover:text-accent-green transition-colors" />
                            </div>
                            <h3 className="text-white font-black text-2xl mb-2 group-hover:text-primary-navy">Strategy Session</h3>
                            <p className="text-accent-green font-black text-sm mb-6 group-hover:text-white uppercase tracking-wider">15 Minutes</p>
                            <div className="mt-auto w-full">
                                <div className="text-white/60 text-sm mb-6 group-hover:text-white/90">Perfect for brief queries and eligibility checks.</div>
                                <button className="w-full bg-white/10 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 group-hover:bg-primary-navy group-hover:text-white transition-all">
                                    Book Now <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Card 2: 40 Min */}
                        <div
                            onClick={() => openBooking(40)}
                            className="group bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-[2.5rem] hover:bg-white transition-all duration-500 cursor-pointer transform lg:-translate-y-8 hover:scale-105 hover:shadow-[0_40px_80px_rgba(32,178,170,0.3)] flex flex-col items-center text-center border-t-8 border-t-accent-green"
                        >
                            <div className="w-16 h-16 bg-accent-green rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
                                <Calendar className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-white font-black text-2xl mb-2 group-hover:text-primary-navy transition-colors">Deep Dive Session</h3>
                            <p className="text-accent-green font-black text-sm mb-6 uppercase tracking-wider">40 Minutes</p>
                            <div className="mt-auto w-full">
                                <div className="text-white/60 text-sm mb-6 group-hover:text-gray-500 transition-colors">Comprehensive document review & full pathway mapping.</div>
                                <button className="w-full bg-accent-green text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 group-hover:bg-primary-navy transition-all shadow-xl">
                                    Secure Slot <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

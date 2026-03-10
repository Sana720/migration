'use client';

import PageLayout, { useBooking } from "@/components/PageLayout";
import Image from "next/image";

function AboutCTA() {
    const { openBooking } = useBooking();
    return (
        <section className="py-24 bg-bg-cream/30">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-5xl font-black text-primary-navy mb-8">Ready to start?</h2>
                <button
                    onClick={() => openBooking()}
                    className="bg-primary-navy text-white px-12 py-5 rounded-3xl font-black text-xl hover:bg-accent-green transition-all shadow-xl hover:shadow-2xl">
                    Book Consultation
                </button>
            </div>
        </section>
    );
}

export default function AboutPage() {
    return (
        <PageLayout>
            <div className="bg-white min-h-screen">
                {/* Hero Section - About Us */}
                <section className="relative pt-40 pb-24 px-4 bg-primary-navy text-white overflow-hidden">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/aboriginal-bg.png"
                            alt="Background"
                            fill
                            className="object-cover scale-105 opacity-20"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-navy via-primary-navy/90 to-transparent z-10"></div>
                    </div>

                    <div className="max-w-4xl mx-auto relative z-20 text-center">
                        <div className="flex flex-col items-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full text-accent-green font-bold text-[10px] mb-8 border border-white/10 uppercase tracking-[0.3em] shadow-2xl">
                                Authorised Experts • Registered Migration Agents
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
                                About <span className="text-accent-green italic">Us</span>
                            </h1>
                            <p className="text-xl text-white/70 font-medium leading-relaxed mb-8 max-w-2xl mx-auto">
                                Guiding your Australian journey with specialized expertise and a commitment to transparent results.
                            </p>
                            <div className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-accent-green">
                                <span className="w-12 h-[2px] bg-accent-green"></span>
                                Forte Migration Team
                            </div>
                        </div>
                    </div>
                </section>

                {/* Principle Migration Agents Section */}
                <section className="py-32 px-4 bg-bg-cream/30">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-20">
                            <div className="text-accent-green font-black text-xs uppercase tracking-[0.4em] mb-4">Leadership</div>
                            <h2 className="text-3xl md:text-5xl text-primary-navy font-black leading-tight">
                                Principal Migration Agent
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-16 items-center">
                            <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-gray-100 flex flex-col md:flex-row gap-12 items-center">
                                <div className="md:w-1/3">
                                    <div className="relative rounded-3xl overflow-hidden aspect-square border-4 border-bg-cream">
                                        <Image
                                            src="/Aditi.jpeg"
                                            alt="Aditi Mohan - Founder of Forte Migration"
                                            width={600}
                                            height={800}
                                            className="object-cover object-[center_top]"
                                        />
                                    </div>
                                </div>
                                <div className="md:w-2/3">
                                    <h3 className="text-3xl font-black text-primary-navy mb-2">Aditi Mohan</h3>
                                    <div className="inline-block bg-accent-green/10 text-accent-green px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-accent-green/20">
                                        MARN 2619201
                                    </div>
                                    <div className="space-y-6 text-lg text-gray-500 font-medium leading-relaxed">
                                        <p>
                                            With specialized expertise in Australian migration law, Aditi Mohan has successfully guided families and professionals through one of the world's most complex immigration systems.
                                        </p>
                                        <p className="border-l-4 border-accent-green pl-8 py-2 italic text-primary-navy font-bold text-xl">
                                            "I don't believe in just processing papers. I believe in securing your legacy in Australia with honesty and precision."
                                        </p>
                                    </div>
                                    <div className="mt-8 flex flex-wrap gap-3">
                                        {['Analytical Approach', 'Strategic Planning', 'Client-Centric'].map(tag => (
                                            <span key={tag} className="px-4 py-2 bg-bg-cream rounded-full text-primary-navy font-bold text-[10px] uppercase tracking-widest">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Detailed Bio Section */}
                <section className="py-32 px-4 relative overflow-hidden">
                    <div className="max-w-4xl mx-auto">
                        <div className="space-y-12 text-xl text-gray-500 font-medium leading-relaxed">
                            <p>
                                Our team focuses on high-complexity cases, appeals, and strategic long-term residency planning. Our approach combines deep professional knowledge with a personal understanding of the migration journey.
                            </p>

                            <p>
                                As authorised Registered Migration Agents, we operate with the highest standards of integrity and transparency, ensuring every client has a clear pathway to success in Australia.
                            </p>
                        </div>
                    </div>
                </section>

                <AboutCTA />
            </div>
        </PageLayout>
    );
}

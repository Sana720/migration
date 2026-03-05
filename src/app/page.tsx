"use client";

import ServiceNavigator from "@/components/ServiceNavigator";
import PageLayout, { useBooking } from "@/components/PageLayout";
import Image from "next/image";
import { useState } from "react";

function HomeContent() {
  const { openBooking } = useBooking();

  return (
    <>
      {/* Hero Section - Refined with Glassmorphism */}
      <section className="relative min-h-[85vh] flex items-center pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/aboriginal-bg.png"
            alt="Australian Aboriginal Design"
            fill
            className="object-cover scale-105 animate-pulse-slow"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-navy via-primary-navy/80 to-transparent z-10"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-20">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full text-accent-green font-bold text-[10px] mb-8 border border-white/10 uppercase tracking-[0.3em] shadow-2xl">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green"></span>
                </span>
                Forte Migration • Trusted RMA Experts
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-8 drop-shadow-2xl">
                <span className="text-accent-green brightness-125">YOU</span> & <span className="text-accent-green brightness-125">YOUR</span> <br />
                Australian <span className="underline decoration-accent-green/30 decoration-8 underline-offset-8">Future</span>.
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl leading-relaxed font-medium">
                Expert immigration guidance built on honesty and transparent results. We don't just process visas; we build futures.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-8 justify-center lg:justify-start">
                <button
                  onClick={() => openBooking()}
                  className="group relative bg-accent-green text-white px-8 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-[0_0_30px_rgba(32,178,170,0.4)] flex items-center gap-3">
                  Book Strategy Call
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-2 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
                <div className="flex items-center gap-6 glass p-3 rounded-2xl border-white/10">
                  <div className="flex -space-x-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-primary-navy bg-white/20 backdrop-blur-sm overflow-hidden ring-2 ring-accent-green/20">
                        <Image src={`/logo.png`} alt="User" width={48} height={48} className="object-cover grayscale brightness-150" />
                      </div>
                    ))}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-sm tracking-tight text-glow">99% Success Rate</p>
                    <p className="text-white/50 text-[10px] uppercase font-black tracking-widest leading-none">Verified Results</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Service Hub */}
            <div className="lg:w-[45%] w-full flex justify-center lg:justify-end animate-float">
              <ServiceNavigator />
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist Booking Section - High Conversion */}
      <section className="py-24 bg-white relative overflow-hidden ring-1 ring-primary-navy/5">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 bg-bg-cream/40 p-12 md:p-16 rounded-[4rem] border border-primary-navy/10 shadow-xl relative group hover:shadow-2xl transition-all duration-700">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-green/5 rounded-full blur-3xl -z-10 group-hover:bg-accent-green/10 transition-colors"></div>

            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="text-accent-green font-black text-[10px] uppercase tracking-[0.5em] mb-4">Start Your Journey</div>
              <h2 className="text-3xl md:text-5xl font-black text-primary-navy mb-6 leading-tight">
                Ready to Discuss Your <br /> <span className="text-accent-green">Success Strategy</span>?
              </h2>
              <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                Book a professional consultation with our migration experts today. Choose the session that fits your needs.
              </p>
            </div>

            <div className="lg:w-[40%] flex flex-col sm:flex-row gap-4 w-full">
              <button
                onClick={() => openBooking(15)}
                className="flex-1 bg-white border-2 border-primary-navy/5 text-primary-navy px-8 py-6 rounded-3xl font-black text-lg hover:border-primary-navy hover:scale-105 transition-all shadow-sm">
                15 Min <br /><span className="text-xs font-bold text-gray-400">Strategy Chat</span>
              </button>
              <button
                onClick={() => openBooking(40)}
                className="flex-1 bg-primary-navy text-white px-8 py-6 rounded-3xl font-black text-lg hover:bg-accent-green hover:scale-105 transition-all shadow-xl shadow-primary-navy/20">
                40 Min <br /><span className="text-xs font-bold text-white/50">Full Planning</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - High Conversion */}
      <section className="py-24 bg-primary-navy relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-accent-green rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-secondary-blue rounded-full blur-[120px]"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: "Visas Granted", val: "10,000+", sub: "Across all categories" },
              { label: "Success Rate", val: "99%", sub: "High-complexity focus" },
              { label: "Years Experience", val: "12+", sub: "Authorised RMAs" },
              { label: "Happy Families", val: "5,000+", sub: "Partner & Child Visas" }
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-4xl md:text-6xl font-black text-white mb-2 group-hover:text-accent-green transition-colors duration-500">{stat.val}</div>
                <div className="text-accent-green font-bold text-xs uppercase tracking-[0.2em] mb-3">{stat.label}</div>
                <div className="text-white/30 text-[10px] font-medium">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Migration Paths (Visa Categories) */}
      <section id="services" className="py-32 bg-bg-cream/50 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-24 gap-16">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="text-accent-green font-black text-xs uppercase tracking-[0.4em] mb-4">Visa Categories</div>
              <h2 className="text-3xl md:text-5xl text-primary-navy font-black leading-tight mb-8">
                Comprehensive Solutions for <br /> Every Migration Goal.
              </h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto lg:mx-0 font-medium leading-relaxed">
                We specialise in complex cases, refusals, and long-term residency strategies for Australia. Our experts guide you through every step of the legal process.
              </p>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative aspect-[16/10] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
                <Image
                  src="/authorised-bg.png"
                  alt="Australian Architecture"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-navy/40 to-transparent"></div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent-green/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary-blue/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "General Skilled Migration",
                code: "Subclass 189/190/491",
                desc: "For professionals seeking permanent residency based on their points-tested skilled occupation.",
                icon: "⚡"
              },
              {
                title: "Partner & Family Visas",
                code: "Subclass 820/801/309/100",
                desc: "Reuniting families and partners with tailored evidence-based application strategies.",
                icon: "♥"
              },
              {
                title: "Employer Sponsorship",
                code: "Subclass 482/186/494",
                desc: "Work visas for skilled workers under Australian business sponsorship and nomination.",
                icon: "🏢"
              },
              {
                title: "Business & Investment",
                code: "Subclass 188/888",
                desc: "For high-net-worth individuals and business owners looking to invest in Australia.",
                icon: "📈"
              },
              {
                title: "Student & Training",
                code: "Subclass 500/407",
                desc: "Navigating GTE requirements and study pathways for international students.",
                icon: "🎓"
              },
              {
                title: "AAT Appeals & Refusals",
                code: "Tribunal & Judicial Review",
                desc: "Expert representation for visa refusals, cancellations, and complex legal challenges.",
                icon: "⚖"
              }
            ].map((visa, i) => (
              <div key={i} className="group bg-white p-10 rounded-[3rem] border border-primary-navy/5 hover:border-accent-green hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative overflow-hidden shadow-sm">
                <div className="absolute top-[-20%] right-[-10%] text-9xl opacity-[0.03] group-hover:opacity-[0.07] transition-all rotate-12">{visa.icon}</div>
                <div className="text-accent-green font-black text-xs mb-4 flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-accent-green"></span>
                  {visa.code}
                </div>
                <h3 className="text-2xl font-black text-primary-navy mb-4 group-hover:text-accent-green transition-colors">{visa.title}</h3>
                <p className="text-gray-500 mb-10 text-sm font-medium leading-[1.6]">{visa.desc}</p>
                <div className="mt-auto">
                  <button
                    onClick={() => openBooking()}
                    className="text-xs font-black uppercase tracking-[0.2em] text-primary-navy flex items-center gap-3 group-hover:gap-5 transition-all">
                    Discover Eligibility <span className="text-accent-green text-lg">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Spotlight - Personal Trust */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 relative">
              <div className="absolute top-0 left-0 w-full h-full bg-accent-green/10 rounded-[4rem] rotate-3 -z-10 animate-pulse"></div>
              <div className="relative rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white">
                <Image
                  src="/founder-aditi.png"
                  alt="Aditi"
                  width={600}
                  height={800}
                  className="object-cover hover:scale-105 transition-all duration-1000"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-primary-navy p-8 rounded-[2rem] shadow-2xl border border-white/10 hidden md:block">
                <div className="text-accent-green font-black text-4xl mb-1">12+</div>
                <div className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">Years of Migration<br />Excellence</div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="text-accent-green font-black text-xs uppercase tracking-[0.4em] mb-6">The Founder</div>
              <h2 className="text-3xl md:text-4xl text-primary-navy font-black leading-tight mb-8">
                Aditi <span className="text-gray-300 text-2xl font-medium block mt-1">(RMA 0850235)</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-500 font-medium leading-relaxed">
                <p>
                  With over a decade of specialized experience in Australian migration law, Aditi has successfully guided thousands of families and professionals through one of the world's most complex immigration systems.
                </p>
                <p className="border-l-4 border-accent-green pl-8 py-2 italic text-primary-navy font-bold text-xl">
                  "I don't believe in just processing papers. I believe in securing your legacy in Australia with honesty and precision."
                </p>
                <p>
                  As an authorised Registered Migration Agent, Aditi focuses on high-complexity cases, appeals, and strategic long-term residency planning.
                </p>
              </div>
              <div className="mt-12 flex flex-wrap gap-4">
                {['Authorised RMA', 'MIA Member', 'Legal Expert', 'Strategy Specialist'].map(tag => (
                  <span key={tag} className="px-4 py-2 bg-bg-cream rounded-full text-primary-navy font-bold text-xs uppercase tracking-widest border border-gray-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Pricing Section */}
      <section className="py-20 bg-bg-cream/30">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-5xl mb-6 font-bold text-primary-navy">Ready to Start?</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Book a professional consultation with our migration experts today.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-sm md:text-base">
            <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border-t-8 border-primary-navy transform hover:scale-[1.02] transition-all">
              <div className="text-primary-navy font-bold text-2xl mb-4">Strategy Session</div>
              <div className="text-5xl font-extrabold mb-4 text-primary-navy">15 <span className="text-2xl font-normal text-gray-400">min</span></div>
              <p className="text-xs text-accent-green mb-8 font-bold uppercase tracking-widest text-center">Initial Assessment</p>
              <ul className="text-left space-y-4 mb-10 text-gray-600">
                <li className="flex items-center gap-3">
                  <span className="text-accent-green">✓</span>
                  Initial eligibility assessment
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-accent-green">✓</span>
                  Quick visa query resolution
                </li>
              </ul>
              <button
                onClick={() => openBooking(15)}
                className="w-full bg-primary-navy text-white py-4 rounded-2xl font-bold text-lg hover:bg-accent-green transition-all shadow-lg">
                Book 15 Min Chat
              </button>
            </div>

            <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border-t-8 border-accent-green ring-4 ring-accent-green/5 scale-105 transform hover:scale-[1.07] transition-all z-10">
              <div className="text-accent-green font-bold text-2xl mb-4">End-to-End Planning</div>
              <div className="text-5xl font-extrabold mb-4 text-primary-navy">40 <span className="text-2xl font-normal text-gray-400">min</span></div>
              <p className="text-xs text-primary-navy mb-8 font-bold uppercase tracking-widest text-center">Comprehensive Review</p>
              <ul className="text-left space-y-4 mb-10 text-gray-600">
                <li className="flex items-center gap-3 font-bold text-primary-navy">
                  <span className="text-accent-green">★</span>
                  Detailed path mapping
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-accent-green">✓</span>
                  Comprehensive document review
                </li>
              </ul>
              <button
                onClick={() => openBooking(40)}
                className="w-full bg-accent-green text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary-navy transition-all shadow-lg">
                Book 40 Min Session
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function Home() {
  return (
    <PageLayout>
      <HomeContent />
    </PageLayout>
  );
}

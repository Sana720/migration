"use client";

import ServiceNavigator from "@/components/ServiceNavigator";
import PageLayout, { useBooking } from "@/components/PageLayout";
import ConsultationFeatured from "@/components/ConsultationFeatured";
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
                  className="group relative bg-accent-green text-white px-12 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-[0_0_30px_rgba(32,178,170,0.4)] flex items-center gap-3 whitespace-nowrap">
                  Book Strategy Call
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-2 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Content - Service Hub */}
            <div className="lg:w-[45%] w-full flex justify-center lg:justify-end animate-float">
              <ServiceNavigator />
            </div>
          </div>
        </div>
      </section>

      {/* Founder Spotlight - Personal Trust */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-[40%] relative w-full max-w-md mx-auto lg:mx-0">
              <div className="absolute top-0 left-0 w-full h-full bg-accent-green/10 rounded-[4rem] rotate-3 -z-10 animate-pulse"></div>
              <div className="relative rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white">
                <Image
                  src="/Aditi.jpeg"
                  alt="Aditi Mohan"
                  width={600}
                  height={800}
                  className="object-cover hover:scale-105 transition-all duration-1000"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-primary-navy p-8 rounded-[2rem] shadow-2xl border border-white/10 hidden md:block">
                <div className="text-accent-green font-black text-2xl mb-1 uppercase tracking-tighter">MARN</div>
                <div className="text-white font-black text-xl tracking-[0.1em]">Registered</div>
              </div>
            </div>
            <div className="lg:w-[60%]">
              <div className="text-accent-green font-black text-xs uppercase tracking-[0.4em] mb-6">The Founder</div>
              <h2 className="text-3xl md:text-4xl text-primary-navy font-black leading-tight mb-8">
                Aditi Mohan <span className="text-gray-300 text-2xl font-medium block mt-1">(MARN 2619201)</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-500 font-medium leading-relaxed">
                <p>
                  With specialized expertise in Australian migration law, Aditi Mohan has successfully guided families and professionals through one of the world's most complex immigration systems.
                </p>
                <p className="border-l-4 border-accent-green pl-8 py-2 italic text-primary-navy font-bold text-xl">
                  "I don't believe in just processing papers. I believe in securing your legacy in Australia with honesty and precision."
                </p>
                <p>
                  As an authorised Registered Migration Agent, Aditi Mohan focuses on high-complexity cases, appeals, and strategic long-term residency planning.
                </p>
              </div>
              <div className="mt-12 flex flex-wrap gap-4">
                {['Strategic Vision', 'Honest Guidance', 'Personalized Pathways'].map(tag => (
                  <span key={tag} className="px-4 py-2 bg-bg-cream rounded-full text-primary-navy font-bold text-xs uppercase tracking-widest border border-gray-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ConsultationFeatured />

      {/* Stats Section Hidden - Focused on Quality */}
      <div className="hidden">
        <section className="py-24 bg-primary-navy relative overflow-hidden">
          {/* ... (stats content hidden) ... */}
        </section>
      </div>

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
                title: "Skilled Migration",
                code: "Subclass 189/190/491",
                desc: "For professionals seeking permanent residency based on their points-tested skilled occupation.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                )
              },
              {
                title: "Partner & Relationship",
                code: "Subclass 820/801, 309/100",
                desc: "Advice for de facto or married partners of Australians, including the 300 Prospective Marriage visa.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                )
              },
              {
                title: "Employer Sponsored",
                code: "Subclass 482, 186, 494",
                desc: "Work visas for skilled workers under Australian business sponsorship and nomination pathways.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                  </svg>
                )
              },
              {
                title: "Business & Investment",
                code: "Subclass 188/888",
                desc: "For high-net-worth individuals and business owners looking to invest in Australia's economy.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l.43.43a.75.75 0 001.06 0l4.5-4.5.43.43a.75.75 0 001.06 0L21.75 3m-3.75 0h3.75v3.75m-3.75-3.75l3.75 3.75" />
                  </svg>
                )
              },
              {
                title: "Student & Graduate",
                code: "Subclass 500/485",
                desc: "Guidance on study pathways and postgraduate work visas for international students and graduates.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5Zm0 0v-3.675A56.756 56.756 0 0112 8.25c2.474 0 4.862.158 7.203.465V15m-14.453 0H6.75m10.5 0h1.703" />
                  </svg>
                )
              },
              {
                title: "Parent & Child",
                code: "Subclass 143/804/101",
                desc: "Reuniting families with tailored strategies for parent, child, and biological relative visas.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                )
              },
              {
                title: "Visitor & Holiday",
                code: "Subclass 600/417/462",
                desc: "Short-stay options for tourism, family visits, business travel, or working holiday makers.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                )
              },
              {
                title: "Resident & PR Return",
                code: "155/157 & Naturalisation",
                desc: "Secure your legacy with resident return visas and support for Australian citizenship applications.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                )
              },
              {
                title: "Urgent Visa Lodgment",
                code: "Time-Critical Support",
                desc: "Fast-track representation for immediate visa deadlines and urgent expiration issues.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                )
              },
              {
                title: "RFI & Section 56/57",
                code: "Immigration Responses",
                desc: "Expert support for Requests for Further Information (RFI) and Natural Justice letter responses.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3h9m-9 3h9m-6.75-12.75h3.75a2.25 2.25 0 012.25 2.25v13.5a2.25 2.25 0 01-2.25 2.25h-3.75a2.25 2.25 0 01-2.25-2.25V5.25a2.25 2.25 0 012.25-2.25z" />
                  </svg>
                )
              },
              {
                title: "Refusal & Cancellation",
                code: "Status Protection",
                desc: "Strategic guidance for visa refusals and cancellations to protect your status in Australia.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                )
              },
              {
                title: "Ministerial Intervention",
                code: "Section 351/417/501J",
                desc: "High-level representation for unique, compelling cases requiring Ministerial discretion.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                  </svg>
                )
              }
            ]
              .map((visa, i) => (
                <div key={i} className="group bg-white p-10 rounded-[3rem] border border-primary-navy/5 hover:border-accent-green hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative overflow-hidden shadow-sm">
                  <div className="absolute top-[-5%] right-[-5%] text-7xl opacity-[0.03] group-hover:opacity-[0.07] transition-all rotate-12">{visa.icon}</div>
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
      {/* Consultation Pricing Section - Restored before footer */}
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

"use client";

import Header from "@/components/Header";
import ServiceNavigator from "@/components/ServiceNavigator";
import BookingModal from "@/components/BookingModal";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<15 | 40 | null>(null);

  const openBooking = (duration: 15 | 40 | null = null) => {
    setSelectedDuration(duration);
    setIsBookingOpen(true);
  };

  return (
    <main className="min-h-screen">
      <Header onEnquire={() => openBooking()} />

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
              <ServiceNavigator onStartAssessment={() => openBooking()} />
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist Booking Section - High Conversion */}
      <section className="py-24 bg-white relative overflow-hidden ring-1 ring-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 bg-bg-cream/40 p-12 md:p-16 rounded-[4rem] border border-gray-100 shadow-xl relative group hover:shadow-2xl transition-all duration-700">
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
              <div key={i} className="group bg-white p-10 rounded-[3rem] border border-gray-100 hover:border-accent-green hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative overflow-hidden shadow-sm">
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

      {/* Values Section - Refined Visuals */}
      <section className="py-32 bg-bg-cream/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center text-center mb-24">
            <div className="text-accent-green font-black text-xs uppercase tracking-[0.4em] mb-4">Our DNA</div>
            <h2 className="text-3xl md:text-4xl text-primary-navy font-black">Built on Core Principles.</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {[
              {
                title: "Personalised Solutions",
                desc: "We don't believe in a one-size-fits-all approach. Every client receives a strategy tailored to their specific circumstances and long-term goals.",
                icon: (
                  <svg className="w-12 h-12 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                title: "Honest and Transparent",
                desc: "We provide clear, straightforward advice. You will always have a realistic understanding of your options, costs, and timelines without hidden surprises.",
                icon: (
                  <svg className="w-12 h-12 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                title: "Solution Mindset",
                desc: "We focus on finding the most effective way forward. By anticipating potential hurdles, we transform complex legal challenges into clear paths.",
                icon: (
                  <svg className="w-12 h-12 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              }
            ].map((val, i) => (
              <div key={i} className="group relative p-12 rounded-[3.5rem] bg-white overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="mb-8 group-hover:scale-110 transition-transform duration-500">{val.icon}</div>
                <h3 className="text-xl mb-6 font-black text-primary-navy leading-tight">{val.title}</h3>
                <p className="text-gray-500 font-medium leading-[1.7] text-sm">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Social Proof */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12">
            <div className="max-w-2xl">
              <div className="text-accent-green font-black text-xs uppercase tracking-[0.4em] mb-4">Success Stories</div>
              <h2 className="text-3xl md:text-5xl text-primary-navy font-black leading-tight">
                Trusted by 10k+ <br /> Clients Worldwide.
              </h2>
            </div>
            <div className="flex gap-4">
              {/* Static Desktop Controls Decoration */}
              <div className="w-16 h-16 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 group cursor-pointer hover:border-accent-green hover:text-accent-green transition-all">←</div>
              <div className="w-16 h-16 rounded-full bg-primary-navy flex items-center justify-center text-white cursor-pointer hover:bg-accent-green transition-all shadow-xl">→</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 overflow-visible">
            {[
              {
                name: "Sarah Jenkins",
                pos: "Software Engineer",
                text: "Forte Migration turned my complex PR application into a stress-free experience. Aditi's attention to detail is unmatched in the industry.",
                img: "/testimonial-sarah.png"
              },
              {
                name: "Marco Rossi",
                pos: "Business Owner",
                text: "The 188 visa process was daunting until we met the team at Forte. Their strategic approach to our investment profile was exceptional.",
                img: "/testimonial-marco.png"
              },
              {
                name: "Priya Sharma",
                pos: "Registered Nurse",
                text: "Honest advice from day one. They told me what I needed to hear, not what I wanted to hear. Now I'm a permanent resident!",
                img: "/testimonial-priya.png"
              }
            ].map((t, i) => (
              <div key={i} className="bg-bg-cream/30 p-10 rounded-[3rem] border border-gray-100 relative group hover:bg-white hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-accent-green/30">
                    <Image src={t.img} alt={t.name} width={64} height={64} className="object-cover" />
                  </div>
                  <div>
                    <div className="font-black text-primary-navy">{t.name}</div>
                    <div className="text-[10px] font-black text-accent-green uppercase tracking-widest">{t.pos}</div>
                  </div>
                </div>
                <p className="text-gray-600 font-medium italic leading-relaxed text-sm">"{t.text}"</p>
                <div className="mt-8 flex text-accent-green gap-1">
                  {[1, 2, 3, 4, 5].map(s => <span key={s}>★</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Conversion Booster */}
      <section className="py-32 bg-primary-navy relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-24">
            <div className="text-accent-green font-black text-xs uppercase tracking-[0.4em] mb-4">Common Questions</div>
            <h2 className="text-4xl md:text-5xl text-white font-black mb-6">Expert Answers for You.</h2>
            <p className="text-white/50 font-medium text-lg">Everything you need to know about starting your Australian journey.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: "How long does a PR visa take?", a: "Processing times vary significantly depending on the subclass. Skilled visas can take 6-12 months, while Partner visas may take 12-24 months." },
              { q: "Can I apply if my visa was previously refused?", a: "Yes, but it adds complexity. We specialize in refusal cases and AAT representation to give you the best chance of success." },
              { q: "What is a Registered Migration Agent (RMA)?", a: "An RMA is a professional authorised by the Australian government to provide immigration legal advice. Nilesh Nandan is an experienced RMA." },
              { q: "Do you offer a success guarantee?", a: "While no agent can guarantee a visa outcome, we guarantee 100% honesty in our assessment and professional excellence in our work." }
            ].map((faq, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden group hover:border-accent-green/30 transition-all">
                <div className="p-8 cursor-pointer flex justify-between items-center">
                  <span className="text-white font-bold text-lg">{faq.q}</span>
                  <span className="text-accent-green text-2xl group-hover:rotate-45 transition-transform">+</span>
                </div>
                {/* Simplified open behavior for demo - usually would use state */}
                <div className="px-8 pb-8 text-white/60 font-medium leading-relaxed text-sm hidden group-hover:block transition-all animate-in slide-in-from-top-2">
                  {faq.a}
                </div>
              </div>
            ))}
          </div>

          {/* Large CTA Box */}
          <div className="mt-32 glass-dark p-12 md:p-20 rounded-[4rem] text-center border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-green/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
            <h2 className="text-4xl md:text-6xl text-white font-black mb-8 leading-tight">
              Ready to Discuss <br /> Your <span className="text-accent-green">Success Strategy</span>?
            </h2>
            <button
              onClick={() => openBooking()}
              className="bg-accent-green text-primary-navy px-12 py-6 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl">
              Get Started Now
            </button>
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
              <div className="text-5xl font-extrabold mb-4 text-gray-900">15 <span className="text-2xl font-normal text-gray-400">min</span></div>
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
                className="w-full bg-primary-navy text-white py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-lg">
                Book 15 Min Chat
              </button>
            </div>

            <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border-t-8 border-secondary-blue ring-4 border-secondary-blue/5 scale-105 transform hover:scale-[1.07] transition-all z-10">
              <div className="text-secondary-blue font-bold text-2xl mb-4">End-to-End Planning</div>
              <div className="text-5xl font-extrabold mb-4 text-gray-900">40 <span className="text-2xl font-normal text-gray-400">min</span></div>
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
                className="w-full bg-accent-green text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg">
                Book 40 Min Session
              </button>
            </div>
          </div>
        </div>
      </section>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialDuration={selectedDuration}
      />

      {/* Footer (My Visa 4-Column Structure) */}
      <footer className="bg-primary-navy text-white pt-20 pb-10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 border-b border-white/10 pb-16">
            <div>
              <div className="relative w-40 h-10 mb-8">
                <Image
                  src="/logo.png"
                  alt="Forte Migration"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-white/70 leading-relaxed italic">
                "Your trusted partner for securing your future in Australia."
              </p>
            </div>

            <div>
              <h4 className="text-white text-xl mb-6">Services</h4>
              <ul className="space-y-4 text-white/70">
                <li><Link href="#" className="hover:text-secondary-teal transition-colors">Skilled Migration</Link></li>
                <li><Link href="#" className="hover:text-secondary-teal transition-colors">Student Related Visas</Link></li>
                <li><Link href="#" className="hover:text-secondary-teal transition-colors">Family Migration</Link></li>
                <li><Link href="#" className="hover:text-secondary-teal transition-colors">Corporate Compliance</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-xl mb-6">Quick Links</h4>
              <ul className="space-y-4 text-white/70">
                <li><Link href="#" className="hover:text-secondary-teal transition-colors">About Forte Migration</Link></li>
                <li><Link href="#" className="hover:text-secondary-teal transition-colors">Book Consultation</Link></li>
                <li><Link href="#" className="hover:text-secondary-teal transition-colors">Latest Updates</Link></li>
                <li><Link href="#" className="hover:text-secondary-teal transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-xl mb-6">Working Hours</h4>
              <p className="text-white/70 mb-4">Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p className="text-white/70 mb-8">Weekend: By Appointment</p>
              <div className="flex space-x-4">
                {/* Social Icons Placeholder */}
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent-emerald transition-all cursor-pointer">f</div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent-emerald transition-all cursor-pointer">in</div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent-emerald transition-all cursor-pointer">ig</div>
              </div>
            </div>
          </div>

          <div className="text-center text-white/40 text-sm">
            © {new Date().getFullYear()} Forte Migration. All Rights Reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}

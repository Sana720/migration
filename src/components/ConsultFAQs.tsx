'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
    {
        question: "What should I prepare for my consultation?",
        answer: "To get the most out of your session, please have your current passport, CV/Resume, and any previous visa refusal or grant letters ready. If you have specific academic or professional qualifications, having those details handy is also very helpful."
    },
    {
        question: "Is the consultation fee deductible from service fees?",
        answer: "Yes, in most cases, the fee paid for your initial consultation is credited towards your total professional fees if you choose to proceed with our full visa application services within 30 days of the session."
    },
    {
        question: "Can my partner or family join the session?",
        answer: "Absolutely. We encourage partners and key family members to join, as Australian migration often involves the whole family unit. There is no extra charge for additional family members joining the same session."
    },
    {
        question: "Will I receive a written summary after the session?",
        answer: "For our 'Deep Dive' sessions (40 min), you will receive a high-level written strategy summary outlining the discussed pathways and key requirements. For our 15-minute 'Strategy' sessions, we focus on verbal clarity and quick eligibility checks."
    },
    {
        question: "How do I join the online consultation?",
        answer: "Once booked, you'll receive a confirmation email with a secure video meeting link (Zoom or Google Meet). You can join via your computer or smartphone. No special software installation is usually required."
    }
];

export default function ConsultFAQs() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-green/5 rounded-full text-accent-green font-bold text-[10px] mb-4 border border-accent-green/10 uppercase tracking-[0.3em]">
                            Common Questions
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-primary-navy mb-6">
                            Frequently Asked <span className="text-accent-green">Questions</span>
                        </h2>
                        <p className="text-lg text-gray-500 font-medium">
                            Everything you need to know before booking your strategy session.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`group rounded-[2rem] border transition-all duration-500 overflow-hidden ${openIndex === index
                                    ? 'border-accent-green/30 bg-accent-green/[0.02] shadow-xl shadow-accent-green/5'
                                    : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'
                                    }`}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full p-8 flex items-center justify-between text-left"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-500 ${openIndex === index ? 'bg-accent-green text-white' : 'bg-gray-50 text-gray-400'
                                            }`}>
                                            <HelpCircle className="w-6 h-6" />
                                        </div>
                                        <span className={`text-lg font-bold transition-colors duration-500 ${openIndex === index ? 'text-primary-navy' : 'text-gray-600'
                                            }`}>
                                            {faq.question}
                                        </span>
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-500 ${openIndex === index ? 'rotate-180 text-accent-green' : ''
                                        }`} />
                                </button>

                                <div className={`transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}>
                                    <div className="px-8 pb-8 pl-[5.5rem] pr-12">
                                        <div className="h-[2px] w-12 bg-accent-green/20 mb-6 rounded-full"></div>
                                        <p className="text-gray-500 leading-relaxed font-medium text-lg">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}

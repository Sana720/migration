'use client';

import React from 'react';
import { Mail, ClipboardCheck, FileText, Send, CheckCircle2 } from 'lucide-react';

const steps = [
    {
        number: "01",
        title: "Introduction",
        description: "Initial assessment to define your unique migration landscape.",
        icon: Mail,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
    },
    {
        number: "02",
        title: "Strategy",
        description: "Architecting a robust roadmap for your specific visa pathway.",
        icon: ClipboardCheck,
        color: "text-teal-600",
        bgColor: "bg-teal-50",
    },
    {
        number: "03",
        title: "Compliance",
        description: "Expert guidance through every document for perfect accuracy.",
        icon: FileText,
        color: "text-accent-green",
        bgColor: "bg-bg-cream",
    },
    {
        number: "04",
        title: "Success",
        description: "Seamless submission and tracking until your visa is secured.",
        icon: Send,
        color: "text-primary-navy",
        bgColor: "bg-gray-50",
    }
];

export default function MigrationTimeline() {
    return (
        <section className="py-20 lg:py-40 bg-white relative overflow-hidden border-t border-gray-100">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-bg-cream/10 -skew-x-12 translate-x-1/2 pointer-events-none"></div>

            <div className="container mx-auto px-6 md:px-8 relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-24 gap-8">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2 text-accent-green font-black text-[10px] uppercase tracking-[0.3em] mb-4">
                            <CheckCircle2 size={12} />
                            Our Methodology
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary-navy leading-[1.1] tracking-tight">
                            Your Journey, <br className="md:hidden" />
                            <span className="text-accent-green">Simplified.</span>
                        </h2>
                    </div>
                    {/* <p className="text-gray-500 font-medium text-base lg:text-lg max-w-sm md:text-right leading-relaxed">
                        A streamlined 4-step process designed to take you from inquiry to approval with total clarity.
                    </p> */}
                </div>

                <div className="relative mt-8">
                    {/* Desktop Progress Line - Accurately constrained between first and last marker */}
                    <div className="hidden lg:block absolute top-[32px] left-[12.5%] right-[12.5%] h-[2px] bg-gray-100 z-0 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-green/40 to-primary-navy/20"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-0 relative z-10">
                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col lg:items-center group relative">
                                {/* Mobile Connection Line */}
                                {index !== steps.length - 1 && (
                                    <div className="absolute left-[31px] top-[70px] bottom-[-45px] w-0.5 bg-gray-100 lg:hidden"></div>
                                )}

                                {/* Marker Section */}
                                <div className="flex items-center lg:justify-center mb-8 lg:mb-14 relative w-full">
                                    {/* Subtler Big Number */}
                                    <div className={`text-5xl lg:text-6xl font-black ${step.color} opacity-[0.12] group-hover:opacity-20 transition-all duration-700 absolute -left-4 lg:left-1/2 lg:-translate-x-1/2 -top-8 lg:-top-12 z-0 select-none pointer-events-none tracking-tighter`}>
                                        {step.number}
                                    </div>

                                    {/* Icon Container - Perfectly Centered */}
                                    <div className={`w-16 h-16 rounded-2xl ${step.bgColor} ${step.color} flex items-center justify-center shadow-lg border border-white group-hover:scale-110 group-hover:bg-white transition-all duration-500 z-10 relative bg-white`}>
                                        <step.icon size={24} />
                                    </div>

                                    {/* Mobile Title */}
                                    <div className="ml-6 lg:hidden font-black text-2xl text-primary-navy transition-colors group-hover:text-accent-green relative z-10">
                                        {step.title}
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div className="lg:px-6 lg:text-center pl-[88px] lg:pl-0">
                                    <h3 className="hidden lg:block text-2xl font-black text-primary-navy mb-4 group-hover:text-accent-green transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm lg:text-base leading-relaxed font-medium">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

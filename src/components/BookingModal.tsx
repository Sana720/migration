"use strict";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialDuration?: 15 | 40 | null;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, initialDuration }) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [duration, setDuration] = useState<15 | 40 | null>(initialDuration || null);
    const [selectedDay, setSelectedDay] = useState<number>(0);

    useEffect(() => {
        if (initialDuration) {
            setDuration(initialDuration);
            setStep(2);
        } else {
            setStep(1);
            setDuration(null);
        }
    }, [initialDuration, isOpen]);

    if (!isOpen) return null;

    const days = [
        { name: "Monday", date: "Mar 2" },
        { name: "Tuesday", date: "Mar 3" },
        { name: "Wednesday", date: "Mar 4" },
        { name: "Thursday", date: "Mar 5" },
        { name: "Friday", date: "Mar 6" },
    ];

    const timeSlots = [
        "8:10 AM", "10:30 AM", "10:50 AM", "11:10 AM",
        "3:50 AM", "4:10 AM", "4:30 AM", "4:50 AM",
        "4:10 AM", "4:30 AM", "5:50 AM", "6:10 AM",
        "3:30 AM", "4:30 AM", "6:30 AM", "7:30 AM",
        "3:30 AM", "3:50 AM", "4:10 AM", "4:30 AM",
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-primary-navy/60 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl transition-all duration-500 scale-100 opacity-100 flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-8 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-primary-navy uppercase tracking-widest text-sm">
                        {step === 1 ? "Select Appointment Type" : "Book Appointment"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-8 md:p-12">
                    {step === 1 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* 15 Min Card */}
                            <div
                                onClick={() => { setDuration(15); setStep(2); }}
                                className="group cursor-pointer bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl hover:border-primary-navy hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center"
                            >
                                <div className="text-primary-navy font-bold text-xl mb-2 group-hover:text-accent-green transition-colors">Assessment</div>
                                <div className="text-6xl font-extrabold mb-6 text-gray-900 group-hover:scale-110 transition-transform duration-500">15 <span className="text-2xl font-normal text-gray-400">min</span></div>
                                <p className="text-xs text-accent-green mb-8 font-bold uppercase tracking-widest">Initial Assessment</p>
                                <ul className="text-left space-y-4 mb-10 text-gray-500 text-sm">
                                    <li className="flex items-center gap-3"><span className="text-accent-green">✓</span> Initial eligibility assessment</li>
                                    <li className="flex items-center gap-3"><span className="text-accent-green">✓</span> Quick visa query resolution</li>
                                </ul>
                                <div className="mt-auto w-full bg-primary-navy text-white py-4 rounded-2xl font-bold group-hover:bg-accent-green transition-all shadow-lg">
                                    Select 15 Min Chat
                                </div>
                            </div>

                            {/* 40 Min Card */}
                            <div
                                onClick={() => { setDuration(40); setStep(2); }}
                                className="group cursor-pointer bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl hover:border-secondary-blue hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center ring-4 ring-secondary-blue/5"
                            >
                                <div className="text-secondary-blue font-bold text-xl mb-2 group-hover:text-primary-navy transition-colors">Planning</div>
                                <div className="text-6xl font-extrabold mb-6 text-gray-900 group-hover:scale-110 transition-transform duration-500">40 <span className="text-2xl font-normal text-gray-400">min</span></div>
                                <p className="text-xs text-primary-navy mb-8 font-bold uppercase tracking-widest text-center">Comprehensive Review</p>
                                <ul className="text-left space-y-4 mb-10 text-gray-500 text-sm">
                                    <li className="flex items-center gap-3"><span className="text-accent-green">★</span> Detailed path mapping</li>
                                    <li className="flex items-center gap-3"><span className="text-accent-green">✓</span> Comprehensive document review</li>
                                </ul>
                                <div className="mt-auto w-full bg-accent-green text-white py-4 rounded-2xl font-bold group-hover:bg-secondary-blue transition-all shadow-lg">
                                    Select 40 Min Session
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-12">
                            {/* Expert Info */}
                            <div className="bg-bg-cream/20 rounded-[2.5rem] p-8 border border-gray-100 flex flex-col md:flex-row items-center gap-8">
                                <div className="relative w-40 h-40 rounded-3xl overflow-hidden shadow-xl">
                                    <Image
                                        src="/logo.png"
                                        alt="Aditi"
                                        fill
                                        className="object-cover grayscale brightness-110"
                                    />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                            </svg>
                                            AVAILABLE
                                        </span>
                                        <h3 className="text-xl font-bold text-primary-navy">{duration}-Min-Chat (Video/Phone) with Aditi </h3>
                                    </div>
                                    <p className="text-gray-600 italic text-sm mb-4">"Need a quick chat?"</p>
                                    <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
                                        Perfect for time-sensitive matters requiring a quick chat with an expert with a 100% money back guarantee.
                                        [If no suitable appointment slots are available below, please call us on 1300 558 472]
                                    </p>
                                </div>
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-primary-navy font-bold text-xs uppercase tracking-widest hover:text-accent-green transition-colors flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                    </svg>
                                    Change Duration
                                </button>
                            </div>

                            {/* Calendar Section */}
                            <div className="flex flex-col gap-8">
                                <div className="flex flex-col items-center">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Time Zone: Australia/Sydney (GMT+11:00)</div>

                                    {/* Days Selector */}
                                    <div className="flex overflow-x-auto w-full pb-4 gap-4 justify-between scrollbar-hide">
                                        {days.map((day, i) => (
                                            <div
                                                key={i}
                                                onClick={() => setSelectedDay(i)}
                                                className={`flex flex-col items-center min-w-[120px] p-6 rounded-3xl transition-all cursor-pointer ${selectedDay === i ? 'bg-primary-navy text-white shadow-xl scale-105' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'}`}
                                            >
                                                <span className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">Next Week</span>
                                                <span className="font-bold text-lg">{day.name}</span>
                                                <span className={`text-sm ${selectedDay === i ? 'text-white/70' : 'text-gray-400'}`}>{day.date}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Time Slots Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {timeSlots.map((slot, i) => (
                                        <button
                                            key={i}
                                            className="group relative bg-white border border-gray-100 p-6 rounded-2xl text-center hover:border-accent-green hover:shadow-lg transition-all"
                                        >
                                            <span className="text-primary-navy font-bold group-hover:text-accent-green transition-colors">{slot}</span>
                                            <div className="absolute inset-0 bg-accent-green/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                                        </button>
                                    ))}
                                </div>

                                <p className="text-center text-gray-400 text-xs mt-4">Showing available slots for {days[selectedDay].name}, {days[selectedDay].date}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingModal;

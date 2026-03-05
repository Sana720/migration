"use client";

import { useState } from "react";
import { useBooking } from "./PageLayout";

const services = [
    {
        id: "skilled",
        name: "Skilled Migration",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875c-.621 0-1.125-.504-1.125-1.125v-4.25m16.5 0a2.25 2.25 0 0 0-2.25-2.25H4.875a2.25 2.25 0 0 0-2.25 2.25m16.5 0V7.5A2.25 2.25 0 0 0 18 5.25H6A2.25 2.25 0 0 0 3.75 7.5v6.65m16.5 0h-16.5" />
            </svg>
        ),
        color: "bg-emerald-50 text-emerald-600 border-emerald-100"
    },
    {
        id: "student",
        name: "Student Visas",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A56.756 56.756 0 0 1 12 8.25c2.474 0 4.862.158 7.203.465V15m-14.453 0H6.75m10.5 0h1.703" />
            </svg>
        ),
        color: "bg-blue-50 text-blue-500 border-blue-100"
    },
    {
        id: "family",
        name: "Family & Partner",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
        ),
        color: "bg-rose-50 text-rose-500 border-rose-100"
    },
    {
        id: "corporate",
        name: "Corporate Support",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
            </svg>
        ),
        color: "bg-indigo-50 text-indigo-600 border-indigo-100"
    },
    {
        id: "refusal",
        name: "Refusal Support",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
        ),
        color: "bg-orange-50 text-orange-600 border-orange-100"
    },
    {
        id: "citizenship",
        name: "Citizenship",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
        ),
        color: "bg-cyan-50 text-cyan-600 border-cyan-100"
    }
];

export default function ServiceNavigator() {
    const [active, setActive] = useState<string | null>(null);
    const { openBooking } = useBooking();

    return (
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-2xl border border-gray-100 max-w-lg w-full">
            <h3 className="text-xl font-bold text-primary-navy mb-6 text-center md:text-left">
                How can we <span className="text-accent-green">help you</span>?
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-6">
                {services.map((service) => (
                    <button
                        key={service.id}
                        onClick={() => setActive(service.id)}
                        className={`p-3 rounded-xl border-2 transition-all duration-300 flex flex-col items-center text-center gap-1 group ${active === service.id
                            ? "border-primary-navy bg-primary-navy/5 shadow-inner scale-[0.98]"
                            : "border-gray-50 bg-gray-50 hover:border-gray-200 hover:bg-white hover:shadow-md"
                            }`}
                    >
                        <div className={`p-2 rounded-lg ${service.color} transition-transform group-hover:scale-110`}>
                            {service.icon}
                        </div>
                        <span className="font-semibold text-xs md:text-sm text-gray-700">{service.name}</span>
                    </button>
                ))}
            </div>

            <button
                disabled={!active}
                onClick={() => openBooking()}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all opacity-100 ${active
                    ? "bg-accent-green text-white hover:bg-primary-navy shadow-lg shadow-green-200"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
            >
                Start Assessment
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
            </button>
        </div>
    );
}

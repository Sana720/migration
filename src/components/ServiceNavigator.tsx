"use client";

import { useState } from "react";
import { useBooking } from "./PageLayout";

const services = [
    {
        id: "skilled",
        name: "Skilled Migration",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
        ),
        color: "bg-amber-50 text-amber-600 border-amber-100"
    },
    {
        id: "partner",
        name: "Partner Visa",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        ),
        color: "bg-rose-50 text-rose-600 border-rose-100"
    },
    {
        id: "employer",
        name: "Employer Sponsored Visa",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
            </svg>
        ),
        color: "bg-indigo-50 text-indigo-600 border-indigo-100"
    },
    {
        id: "student",
        name: "Student Visa",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5Zm0 0v-3.675A56.756 56.756 0 0112 8.25c2.474 0 4.862.158 7.203.465V15m-14.453 0H6.75m10.5 0h1.703" />
            </svg>
        ),
        color: "bg-blue-50 text-blue-600 border-blue-100"
    },
    {
        id: "family",
        name: "Family Visa",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
        ),
        color: "bg-purple-50 text-purple-600 border-purple-100"
    },
    {
        id: "visitor",
        name: "Visitor Visa",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
        ),
        color: "bg-orange-50 text-orange-600 border-orange-100"
    },
    {
        id: "citizenship",
        name: "Resident Return Visa",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
        ),
        color: "bg-cyan-50 text-cyan-600 border-cyan-100"
    },
    {
        id: "urgent",
        name: "Urgent Visa Support",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
        ),
        color: "bg-red-50 text-red-600 border-red-100"
    },
    {
        id: "rfi",
        name: "RFI Response",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3h9m-9 3h9m-6.75-12.75h3.75a2.25 2.25 0 012.25 2.25v13.5a2.25 2.25 0 01-2.25 2.25h-3.75a2.25 2.25 0 01-2.25-2.25V5.25a2.25 2.25 0 012.25-2.25z" />
            </svg>
        ),
        color: "bg-teal-50 text-teal-600 border-teal-100"
    },
    {
        id: "refusal",
        name: "Refusal Support",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
        ),
        color: "bg-pink-50 text-pink-600 border-pink-100"
    },
    {
        id: "ministerial",
        name: "Ministerial Intervention",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
        ),
        color: "bg-gray-50 text-gray-600 border-gray-100"
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

            <div className="grid grid-cols-3 gap-2 mb-6">
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
                onClick={() => {
                    const selectedService = services.find(s => s.id === active);
                    openBooking(null, selectedService?.name);
                }}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all opacity-100 ${active
                    ? "bg-accent-green text-white hover:bg-primary-navy shadow-lg shadow-green-200"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
            >
                Book Consultation
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
            </button>
        </div>
    );
}

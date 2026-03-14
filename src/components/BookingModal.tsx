'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { X, Calendar as CalendarIcon, Clock, Check, ChevronRight, Phone, Mail, User, MessageSquare, ArrowLeft, RefreshCw, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialDuration?: 15 | 40 | null;
    initialService?: string | null;
}

interface AvailabilitySlot {
    day_of_week: number;
    start_time: string;
    end_time: string;
    blocked_slots?: string[];
}

interface DayOption {
    name: string;
    date: string;
    dateIso: string;
    dayNum: number; // 1-7
}

export default function BookingModal({ isOpen, onClose, initialDuration, initialService }: BookingModalProps) {
    const supabase = createClient();
    const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
    const [status, setStatus] = useState<{ type: 'error' | 'success' | null, message: string | null }>({ type: null, message: null });
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [duration, setDuration] = useState<15 | 40 | null>(initialDuration || null);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
    const [existingBookings, setExistingBookings] = useState<{ appointment_date: string; appointment_time: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        appointment_time: '',
        // New Fields
        bookingForSelf: 'No',
        relationship: '',
        nearestOffice: '',
        passportCountry: '',
        backgroundInfo: '',
        deadlineUrgency: '',
        local_display_time: '',
        visaType: ''
    });

    // Verification State
    const [otp, setOtp] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);

    const userTimezone = useMemo(() => {
        try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch (e) {
            return 'Australia/Sydney';
        }
    }, []);

    const SYDNEY_TIMEZONE = 'Australia/Sydney';

    // Initialize state and handle opening/closing
    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({ ...prev, visaType: initialService || '' }));
            if (initialDuration) {
                setDuration(initialDuration);
                setStep(2);
            } else {
                setStep(1);
            }
        } else {
            // Delay reset to avoid flicker during closing animation
            setTimeout(() => {
                setStep(1);
                setDuration(null);
                setShowCancelConfirm(false);
                setIsEmailVerified(false);
                setOtp('');
                setFormData({
                    name: '', email: '', phone: '', message: '', appointment_time: '',
                    bookingForSelf: 'No', relationship: '', nearestOffice: '',
                    passportCountry: '', backgroundInfo: '', deadlineUrgency: '',
                    local_display_time: '', visaType: ''
                });
            }, 300);
        }
    }, [isOpen, initialDuration, initialService]);

    // Reactively fetch availability when duration or open state changes
    useEffect(() => {
        if (isOpen && duration) {
            fetchAvailability();
        }
    }, [isOpen, duration]);

    const fetchAvailability = async () => {
        setLoading(true);
        try {
            // Fetch Availability Rules
            const { data: availData, error: availError } = await supabase
                .from('availability')
                .select('*')
                .eq('is_active', true)
                .eq('duration_type', 'hourly');

            if (availError) throw availError;
            setAvailability(availData || []);

            // Fetch Existing Bookings (to prevent double booking)
            const { data: bookingData, error: bookingError } = await supabase
                .from('leads')
                .select('appointment_date, appointment_time')
                .neq('status', 'cancelled'); // Don't count cancelled bookings

            if (bookingError) throw bookingError;
            setExistingBookings(bookingData || []);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Generate next 14 days and filter by availability
    const generateDays = (): DayOption[] => {
        const days: DayOption[] = [];
        const activeDays = availability.map(a => a.day_of_week);

        // Look ahead 14 days to find available slots
        for (let iter = 0; iter < 14; iter++) {
            const d = new Date();
            d.setDate(d.getDate() + iter);
            const dayNum = d.getDay();

            // Only add if this day of the week has active availability
            if (activeDays.includes(dayNum)) {
                days.push({
                    name: d.toLocaleDateString('en-US', { weekday: 'long' }),
                    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    dateIso: d.toISOString().split('T')[0],
                    dayNum: dayNum
                });
            }

            // Limit to next 5 available days to keep UI clean
            if (days.length >= 5) break;
        }
        return days;
    };

    const days = useMemo(() => generateDays(), [availability]);
    const currentDay = days[selectedDayIndex];

    // Generate time slots for the selected day
    const getTimeSlots = () => {
        if (!currentDay || !duration) return [];

        const dayAvailability = availability.find(a => a.day_of_week === currentDay.dayNum);
        if (!dayAvailability) return [];

        const slots: { time: string; isBooked: boolean; localTime: string }[] = [];
        const [startH, startM] = dayAvailability.start_time.split(':').map(Number);
        const [endH, endM] = dayAvailability.end_time.split(':').map(Number);

        // We generate slots in Sydney time first
        const currentSydney = new Date();
        // Construct the base date in Sydney time context
        const [y, m, d] = currentDay.dateIso.split('-').map(Number);

        // Helper to get a Date object at a specific Sydney hour
        const getSydneyDate = (hour: number, minute: number) => {
            // This is tricky without a library, but since we know Sydney is roughly UTC+10/11:
            // We create a UTC date that represents that Sydney time
            const date = new Date(Date.UTC(y, m - 1, d, hour, minute));
            // Adjust for Sydney offset (simplified, ideally use a library or better Intl logic)
            // For now, let's use the native Date with Sydney formatting to find the conversion
            return date;
        };

        let currentHour = startH;
        while (currentHour < endH) {
            // NEW ROBUST TZ CONVERSION:
            // 1. Create a plain date string
            const dateBase = `${currentDay.dateIso}T${currentHour.toString().padStart(2, '0')}:00:00`;

            // 2. Determine Sydney's offset at that specific time
            const tempDate = new Date(dateBase);
            const offsetParts = new Intl.DateTimeFormat('en-US', {
                timeZone: SYDNEY_TIMEZONE,
                timeZoneName: 'longOffset'
            }).formatToParts(tempDate);
            const offsetValue = offsetParts.find(p => p.type === 'timeZoneName')?.value || 'GMT+11:00';
            const cleanOffset = offsetValue.replace('GMT', '').replace('\u2212', '-'); // Handle minus sign

            // 3. Create the ACTUAL date object as it exists in Sydney
            const sydneyDate = new Date(`${dateBase}${cleanOffset}`);

            // Format for display in LOCAL time
            const localTimeStr = sydneyDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: userTimezone
            });

            const sydneyTimeStr = sydneyDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: SYDNEY_TIMEZONE
            });

            // Extract just the hour part for broader blocking (e.g., "10:00 AM" -> "10 AM")
            const currentHourPart = currentHour;

            // Check if ANY booking exists in this same hour window today
            const isAnyBookingInHour = existingBookings.some(booking => {
                const isSameDay = booking.appointment_date === currentDay.dateIso;
                if (!isSameDay) return false;

                // Parse the booking time string (e.g., "10:15 AM")
                if (!booking.appointment_time || !booking.appointment_time.includes(' ')) return false;

                const [time, period] = booking.appointment_time.split(' ');
                if (!time || !period) return false;

                let [h, m] = time.split(':').map(Number);
                if (period === 'PM' && h !== 12) h += 12;
                if (period === 'AM' && h === 12) h = 0;

                return h === currentHourPart;
            });

            // Check if this specific top-of-hour slot is manually blocked
            const isBlockedInAdmin = dayAvailability.blocked_slots?.includes(sydneyTimeStr);

            if (!isBlockedInAdmin) {
                slots.push({
                    time: sydneyTimeStr, // Internal reference
                    localTime: localTimeStr, // Display usage
                    isBooked: isAnyBookingInHour
                });
            }

            currentHour++;
        }
        return slots;
    };

    const timeSlots = getTimeSlots();

    const handleSelectSlot = (slot: { time: string, localTime: string }) => {
        setFormData(prev => ({ ...prev, appointment_time: slot.time, local_display_time: slot.localTime }));
        setStep(3);
    };

    const handleSendOtp = async () => {
        setSendingOtp(true);
        setStatus({ type: null, message: null });
        try {
            // Basic email validation regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                throw new Error('Please enter a valid email address.');
            }

            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });
            if (!res.ok) throw new Error('Failed to send verification code.');
            setStep(4);
        } catch (err: any) {
            setStatus({ type: 'error', message: err.message });
        } finally {
            setSendingOtp(false);
        }
    };

    const handleNext = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        // Handle Step 3 to Step 4 transition (Send OTP)
        if (step === 3 && !isEmailVerified) {
            await handleSendOtp();
            return;
        }

        setStep((step + 1) as any);
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setVerifyingOtp(true);
        setStatus({ type: null, message: null });
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, otp })
            });
            const data = await res.json();
            if (res.ok) {
                setIsEmailVerified(true);
                setStep(5);
            } else {
                setStatus({ type: 'error', message: data.error || 'Invalid code. Please check and try again.' });
            }
        } catch (err: any) {
            setStatus({ type: 'error', message: 'Verification failed: ' + err.message });
        } finally {
            setVerifyingOtp(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus({ type: null, message: null });
        try {
            const combinedMessage = `
**Booking Details**
- Visa Type: ${formData.visaType || 'General Enquiry'}
- Booking for someone else? ${formData.bookingForSelf}
${formData.relationship ? `- Relationship: ${formData.relationship}` : ''}
- Local Time: ${formData.local_display_time} (${userTimezone})
- Passport Country: ${formData.passportCountry}
- Background Info: ${formData.backgroundInfo}
- Deadline/Urgency: ${formData.deadlineUrgency}

**Additional Message:**
${formData.message || 'None provided'}
            `.trim();

            const { error } = await supabase
                .from('leads')
                .insert({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: combinedMessage,
                    type: `${duration}-min`,
                    appointment_date: currentDay.dateIso,
                    appointment_time: formData.appointment_time,
                    status: 'new'
                });

            if (error) throw error;

            // Trigger Confirmation Email (Fire and forget or wait depends on UX, let's wait to ensure it's logged)
            try {
                await fetch('/api/send-confirmation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        message: combinedMessage,
                        type: `${duration}-min`,
                        appointment_date: currentDay.dateIso,
                        appointment_time: formData.appointment_time,
                        local_display_time: formData.local_display_time
                    })
                });
            } catch (emailErr) {
                console.error('Failed to trigger confirmation email:', emailErr);
                // We don't block the success screen for email failure, as the DB record is already saved
            }

            setStep(7); // Show success screen instead of immediate close
        } catch (error: any) {
            console.error('Error submitting lead:', error);
            setStatus({ type: 'error', message: 'Booking failed: ' + error.message });
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-primary-navy/40 backdrop-blur-md transition-opacity duration-300"
                onClick={() => {
                    if (step <= 2) onClose();
                    else setShowCancelConfirm(true);
                }}
            ></div>

            {/* Modal Body */}
            <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col">

                {/* Status Message Helper */}
                {status.message && (
                    <div className={`mx-6 mt-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${status.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span className="text-sm font-bold uppercase tracking-tight">{status.message}</span>
                    </div>
                )}

                {/* Header */}
                <div className="p-6 md:p-8 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1 as any)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-500" />
                            </button>
                        )}
                        <div>
                            <h2 className="text-xl font-bold text-primary-navy">
                                {step === 1 ? 'Select Service' : step === 2 ? 'Choose Time' : step === 3 ? 'Contact Details' : step === 4 ? 'Verify Email' : step === 5 ? 'Tell me more...' : step === 6 ? 'Review & Payment' : 'Booking Confirmed'}
                            </h2>
                            <div className="flex gap-1 mt-1">
                                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                                    <div
                                        key={i}
                                        className={`h-1 w-6 rounded-full transition-all ${i <= step ? 'bg-accent-green' : 'bg-gray-100'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            if (step <= 2 || step === 7) onClose();
                            else setShowCancelConfirm(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-primary-navy"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-10">
                    {/* Step 1: Duration Selection */}
                    {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                            {[
                                {
                                    min: 15,
                                    title: 'Strategy Session',
                                    desc: ['Quick eligibility check', 'Quick visa queries resolution'],
                                    color: 'border-accent-green',
                                    bg: 'bg-accent-green/5'
                                },
                                {
                                    min: 40,
                                    title: 'Deep Dive Session',
                                    desc: ['Detailed pathway ', 'Comprehensive visa strategy'],
                                    color: 'border-secondary-blue',
                                    bg: 'bg-secondary-blue/5'
                                }
                            ].map((opt) => (
                                <button
                                    key={opt.min}
                                    onClick={() => { setDuration(opt.min as 15 | 40); setStep(2); }}
                                    className={`group relative p-8 rounded-[2rem] border-2 text-left transition-all hover:shadow-xl ${opt.color} ${opt.bg}`}
                                >
                                    <div className="text-3xl font-black text-primary-navy mb-2">{opt.min} MIN</div>
                                    <h3 className="text-lg font-bold text-primary-navy mb-3">{opt.title}</h3>
                                    <ul className="space-y-2 mb-6">
                                        {opt.desc.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-500 leading-relaxed">
                                                <span className="text-accent-green mt-1">★</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex items-center text-primary-navy font-bold text-sm">
                                        Select Service <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 2: Calendar & Slots */}
                    {step === 2 && (
                        <div className="space-y-10">
                            {/* Expert Preview */}
                            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                <div className="hidden sm:block relative w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                                    <Image src="/Aditi.jpeg" alt="Aditi Mohan" fill className="object-cover object-top" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Times shown in {userTimezone.replace('_', ' ')}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-primary-navy">
                                        {duration === 15 ? '15 Min Strategy Session' : '40 Min Deep Dive Session'}
                                    </h3>
                                    <p className="text-sm text-gray-500">Video call or phone consultation with Aditi Mohan.</p>
                                </div>
                            </div>

                            {/* Date Selector */}
                            <div className="flex flex-col gap-4">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Appointment Date</span>
                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                    {days.map((day, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedDayIndex(i)}
                                            className={`flex flex-col items-center min-w-[100px] p-5 rounded-2xl border-2 transition-all ${selectedDayIndex === i ? 'border-primary-navy bg-primary-navy text-white shadow-lg scale-105' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                                        >
                                            <span className="text-[10px] font-bold uppercase mb-1 opacity-70">{day.name.slice(0, 3)}</span>
                                            <span className="text-lg font-black">{day.date.split(' ')[1]}</span>
                                            <span className="text-[10px] font-medium">{day.date.split(' ')[0]}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time Slots */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Available Times</span>
                                    <span className="text-[10px] font-bold text-gray-400">All times shown in your local timezone</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {loading ? (
                                        <div className="col-span-full py-10 flex justify-center">
                                            <div className="w-6 h-6 border-2 border-primary-navy border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    ) : timeSlots.length > 0 ? (
                                        timeSlots.map((slot, i) => (
                                            <button
                                                key={i}
                                                disabled={slot.isBooked}
                                                onClick={() => handleSelectSlot(slot)}
                                                className={`p-4 rounded-xl border text-sm font-bold transition-all text-center flex flex-col items-center justify-center gap-1 ${slot.isBooked
                                                    ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                                                    : 'border-gray-100 text-primary-navy hover:border-accent-green hover:bg-accent-green/5'
                                                    }`}
                                            >
                                                <span>{slot.localTime}</span>
                                                {slot.isBooked && (
                                                    <span className="text-[8px] uppercase tracking-widest text-red-300">Booked</span>
                                                )}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                            <p className="text-sm text-gray-400">No slots available for this day.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Lead Form */}
                    {step === 3 && (
                        <form noValidate onSubmit={handleNext} className="max-w-2xl mx-auto space-y-8">
                            {/* Summary Card */}
                            <div className="flex items-center justify-between p-6 bg-accent-green/5 border border-accent-green/20 rounded-3xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-accent-green rounded-2xl flex items-center justify-center text-white">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-primary-navy">{duration} Min Consultation</div>
                                        <div className="text-xs text-gray-500">
                                            {currentDay.name}, {currentDay.date} @ {formData.local_display_time} (Your Time)
                                        </div>
                                        <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-tight">
                                            Equivalent to {formData.appointment_time} Sydney Time
                                        </div>
                                    </div>
                                </div>
                                <Check className="w-6 h-6 text-accent-green" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            required
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-accent-green rounded-2xl transition-all outline-none text-sm"
                                            value={formData.name}
                                            onChange={e => {
                                                setFormData({ ...formData, name: e.target.value });
                                                if (status.type === 'error') setStatus({ type: null, message: null });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            required
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-accent-green rounded-2xl transition-all outline-none text-sm"
                                            value={formData.email}
                                            onChange={e => {
                                                setFormData({ ...formData, email: e.target.value });
                                                if (status.type === 'error') setStatus({ type: null, message: null });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            required
                                            type="tel"
                                            placeholder="+61 400 000 000"
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-accent-green rounded-2xl transition-all outline-none text-sm"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Short Message (Optional)</label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                                        <textarea
                                            placeholder="Briefly describe your case..."
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-accent-green rounded-2xl transition-all outline-none text-sm min-h-[52px] resize-none"
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={sendingOtp}
                                className="w-full bg-primary-navy text-white py-5 rounded-3xl font-bold text-lg hover:bg-accent-green transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                            >
                                {sendingOtp ? (
                                    <>
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                        Sending Code...
                                    </>
                                ) : (
                                    <>
                                        Continue to Verification
                                        <ChevronRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Step 4: Email Verification */}
                    {step === 4 && (
                        <div className="max-w-md mx-auto space-y-8 py-4">
                            <div className="text-center space-y-3">
                                <div className="w-20 h-20 bg-accent-green/10 text-accent-green rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Mail className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-black text-primary-navy">Verify your email</h3>
                                <p className="text-gray-500 text-sm">
                                    We've sent a 6-digit verification code to <br />
                                    <span className="font-bold text-primary-navy">{formData.email}</span>
                                </p>
                            </div>

                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center block">Enter 6-Digit Code</label>
                                    <input
                                        required
                                        type="text"
                                        maxLength={6}
                                        placeholder="000000"
                                        className="w-full text-center text-4xl font-black tracking-[0.5em] py-6 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-accent-green rounded-[2rem] transition-all outline-none"
                                        value={otp}
                                        onChange={e => {
                                            setOtp(e.target.value.replace(/\D/g, ''));
                                            if (status.type === 'error') setStatus({ type: null, message: null });
                                        }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={verifyingOtp || otp.length !== 6}
                                    className="w-full bg-primary-navy text-white py-5 rounded-3xl font-bold text-lg hover:bg-accent-green transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {verifyingOtp ? (
                                        <>
                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            Verify & Continue
                                            <ChevronRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="text-center pt-4">
                                <button
                                    type="button"
                                    disabled={sendingOtp}
                                    onClick={handleSendOtp}
                                    className="text-sm font-bold text-gray-400 hover:text-primary-navy transition-colors underline underline-offset-4 flex items-center justify-center gap-2 mx-auto"
                                >
                                    {sendingOtp && <RefreshCw className="w-3 h-3 animate-spin" />}
                                    {sendingOtp ? 'Resending...' : 'Resend code'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Questionnaire */}
                    {step === 5 && (
                        <form onSubmit={handleNext} className="max-w-2xl mx-auto space-y-10">
                            <div className="space-y-8">
                                {/* Booking for someone else */}
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-primary-navy">Are you booking this appointment for someone else? <span className="text-red-500">*</span></label>
                                    <div className="flex gap-8">
                                        {['Yes', 'No'].map(opt => (
                                            <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.bookingForSelf === opt ? 'border-accent-green bg-accent-green' : 'border-gray-200 group-hover:border-gray-300'}`}>
                                                    {formData.bookingForSelf === opt && <div className="w-2 h-2 bg-white rounded-full" />}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="bookingForSelf"
                                                    value={opt}
                                                    className="hidden"
                                                    onChange={e => setFormData({ ...formData, bookingForSelf: e.target.value })}
                                                />
                                                <span className={`text-sm font-medium ${formData.bookingForSelf === opt ? 'text-primary-navy' : 'text-gray-400'}`}>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Relationship (Conditional) */}
                                {formData.bookingForSelf === 'Yes' && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="text-sm font-bold text-primary-navy">If yes, what is your relationship to the person?</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-accent-green rounded-2xl transition-all outline-none text-sm"
                                            value={formData.relationship}
                                            onChange={e => setFormData({ ...formData, relationship: e.target.value })}
                                        />
                                    </div>
                                )}

                                {/* Nearest Office */}
                                {/* <div className="space-y-3">
                                    <label className="text-sm font-bold text-primary-navy">Nearest MyVisa® Office to you is... <span className="text-red-500">*</span></label>
                                    <select
                                        required
                                        className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-accent-green rounded-2xl transition-all outline-none text-sm appearance-none cursor-pointer"
                                        value={formData.nearestOffice}
                                        onChange={e => setFormData({ ...formData, nearestOffice: e.target.value })}
                                    >
                                        <option value="">Select an office...</option>
                                        <option value="Sydney">Sydney, Australia</option>
                                        <option value="Melbourne">Melbourne, Australia</option>
                                        <option value="Brisbane">Brisbane, Australia</option>
                                        <option value="Perth">Perth, Australia</option>
                                        <option value="International">International / Online</option>
                                    </select>
                                </div> */}

                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-primary-navy">What is your passport country? <span className="text-red-500">*</span></label>
                                    <select
                                        required
                                        className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-accent-green rounded-2xl transition-all outline-none text-sm appearance-none cursor-pointer"
                                        value={formData.passportCountry}
                                        onChange={e => setFormData({ ...formData, passportCountry: e.target.value })}
                                    >
                                        <option value="">Select your country...</option>
                                        <option value="Afghanistan">Afghanistan</option>
                                        <option value="Albania">Albania</option>
                                        <option value="Algeria">Algeria</option>
                                        <option value="Andorra">Andorra</option>
                                        <option value="Angola">Angola</option>
                                        <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                                        <option value="Argentina">Argentina</option>
                                        <option value="Armenia">Armenia</option>
                                        <option value="Australia">Australia</option>
                                        <option value="Austria">Austria</option>
                                        <option value="Azerbaijan">Azerbaijan</option>
                                        <option value="Bahamas">Bahamas</option>
                                        <option value="Bahrain">Bahrain</option>
                                        <option value="Bangladesh">Bangladesh</option>
                                        <option value="Barbados">Barbados</option>
                                        <option value="Belarus">Belarus</option>
                                        <option value="Belgium">Belgium</option>
                                        <option value="Belize">Belize</option>
                                        <option value="Benin">Benin</option>
                                        <option value="Bhutan">Bhutan</option>
                                        <option value="Bolivia">Bolivia</option>
                                        <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                                        <option value="Botswana">Botswana</option>
                                        <option value="Brazil">Brazil</option>
                                        <option value="Brunei">Brunei</option>
                                        <option value="Bulgaria">Bulgaria</option>
                                        <option value="Burkina Faso">Burkina Faso</option>
                                        <option value="Burundi">Burundi</option>
                                        <option value="Cabo Verde">Cabo Verde</option>
                                        <option value="Cambodia">Cambodia</option>
                                        <option value="Cameroon">Cameroon</option>
                                        <option value="Canada">Canada</option>
                                        <option value="Central African Republic">Central African Republic</option>
                                        <option value="Chad">Chad</option>
                                        <option value="Chile">Chile</option>
                                        <option value="China">China</option>
                                        <option value="Colombia">Colombia</option>
                                        <option value="Comoros">Comoros</option>
                                        <option value="Congo, Democratic Republic of the">Congo, Democratic Republic of the</option>
                                        <option value="Congo, Republic of the">Congo, Republic of the</option>
                                        <option value="Costa Rica">Costa Rica</option>
                                        <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                                        <option value="Croatia">Croatia</option>
                                        <option value="Cuba">Cuba</option>
                                        <option value="Cyprus">Cyprus</option>
                                        <option value="Czech Republic">Czech Republic</option>
                                        <option value="Denmark">Denmark</option>
                                        <option value="Djibouti">Djibouti</option>
                                        <option value="Dominica">Dominica</option>
                                        <option value="Dominican Republic">Dominican Republic</option>
                                        <option value="Ecuador">Ecuador</option>
                                        <option value="Egypt">Egypt</option>
                                        <option value="El Salvador">El Salvador</option>
                                        <option value="Equatorial Guinea">Equatorial Guinea</option>
                                        <option value="Eritrea">Eritrea</option>
                                        <option value="Estonia">Estonia</option>
                                        <option value="Eswatini">Eswatini</option>
                                        <option value="Ethiopia">Ethiopia</option>
                                        <option value="Fiji">Fiji</option>
                                        <option value="Finland">Finland</option>
                                        <option value="France">France</option>
                                        <option value="Gabon">Gabon</option>
                                        <option value="Gambia">Gambia</option>
                                        <option value="Georgia">Georgia</option>
                                        <option value="Germany">Germany</option>
                                        <option value="Ghana">Ghana</option>
                                        <option value="Greece">Greece</option>
                                        <option value="Grenada">Grenada</option>
                                        <option value="Guatemala">Guatemala</option>
                                        <option value="Guinea">Guinea</option>
                                        <option value="Guinea-Bissau">Guinea-Bissau</option>
                                        <option value="Guyana">Guyana</option>
                                        <option value="Haiti">Haiti</option>
                                        <option value="Honduras">Honduras</option>
                                        <option value="Hungary">Hungary</option>
                                        <option value="Iceland">Iceland</option>
                                        <option value="India">India</option>
                                        <option value="Indonesia">Indonesia</option>
                                        <option value="Iran">Iran</option>
                                        <option value="Iraq">Iraq</option>
                                        <option value="Ireland">Ireland</option>
                                        <option value="Israel">Israel</option>
                                        <option value="Italy">Italy</option>
                                        <option value="Jamaica">Jamaica</option>
                                        <option value="Japan">Japan</option>
                                        <option value="Jordan">Jordan</option>
                                        <option value="Kazakhstan">Kazakhstan</option>
                                        <option value="Kenya">Kenya</option>
                                        <option value="Kiribati">Kiribati</option>
                                        <option value="Korea, North">Korea, North</option>
                                        <option value="Korea, South">Korea, South</option>
                                        <option value="Kosovo">Kosovo</option>
                                        <option value="Kuwait">Kuwait</option>
                                        <option value="Kyrgyzstan">Kyrgyzstan</option>
                                        <option value="Laos">Laos</option>
                                        <option value="Latvia">Latvia</option>
                                        <option value="Lebanon">Lebanon</option>
                                        <option value="Lesotho">Lesotho</option>
                                        <option value="Liberia">Liberia</option>
                                        <option value="Libya">Libya</option>
                                        <option value="Liechtenstein">Liechtenstein</option>
                                        <option value="Lithuania">Lithuania</option>
                                        <option value="Luxembourg">Luxembourg</option>
                                        <option value="Madagascar">Madagascar</option>
                                        <option value="Malawi">Malawi</option>
                                        <option value="Malaysia">Malaysia</option>
                                        <option value="Maldives">Maldives</option>
                                        <option value="Mali">Mali</option>
                                        <option value="Malta">Malta</option>
                                        <option value="Marshall Islands">Marshall Islands</option>
                                        <option value="Mauritania">Mauritania</option>
                                        <option value="Mauritius">Mauritius</option>
                                        <option value="Mexico">Mexico</option>
                                        <option value="Micronesia">Micronesia</option>
                                        <option value="Moldova">Moldova</option>
                                        <option value="Monaco">Monaco</option>
                                        <option value="Mongolia">Mongolia</option>
                                        <option value="Montenegro">Montenegro</option>
                                        <option value="Morocco">Morocco</option>
                                        <option value="Mozambique">Mozambique</option>
                                        <option value="Myanmar">Myanmar</option>
                                        <option value="Namibia">Namibia</option>
                                        <option value="Nauru">Nauru</option>
                                        <option value="Nepal">Nepal</option>
                                        <option value="Netherlands">Netherlands</option>
                                        <option value="New Zealand">New Zealand</option>
                                        <option value="Nicaragua">Nicaragua</option>
                                        <option value="Niger">Niger</option>
                                        <option value="Nigeria">Nigeria</option>
                                        <option value="North Macedonia">North Macedonia</option>
                                        <option value="Norway">Norway</option>
                                        <option value="Oman">Oman</option>
                                        <option value="Pakistan">Pakistan</option>
                                        <option value="Palau">Palau</option>
                                        <option value="Palestine">Palestine</option>
                                        <option value="Panama">Panama</option>
                                        <option value="Papua New Guinea">Papua New Guinea</option>
                                        <option value="Paraguay">Paraguay</option>
                                        <option value="Peru">Peru</option>
                                        <option value="Philippines">Philippines</option>
                                        <option value="Poland">Poland</option>
                                        <option value="Portugal">Portugal</option>
                                        <option value="Qatar">Qatar</option>
                                        <option value="Romania">Romania</option>
                                        <option value="Russia">Russia</option>
                                        <option value="Rwanda">Rwanda</option>
                                        <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                                        <option value="Saint Lucia">Saint Lucia</option>
                                        <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                                        <option value="Samoa">Samoa</option>
                                        <option value="San Marino">San Marino</option>
                                        <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                                        <option value="Saudi Arabia">Saudi Arabia</option>
                                        <option value="Senegal">Senegal</option>
                                        <option value="Serbia">Serbia</option>
                                        <option value="Seychelles">Seychelles</option>
                                        <option value="Sierra Leone">Sierra Leone</option>
                                        <option value="Singapore">Singapore</option>
                                        <option value="Slovakia">Slovakia</option>
                                        <option value="Slovenia">Slovenia</option>
                                        <option value="Solomon Islands">Solomon Islands</option>
                                        <option value="Somalia">Somalia</option>
                                        <option value="South Africa">South Africa</option>
                                        <option value="South Sudan">South Sudan</option>
                                        <option value="Spain">Spain</option>
                                        <option value="Sri Lanka">Sri Lanka</option>
                                        <option value="Sudan">Sudan</option>
                                        <option value="Suriname">Suriname</option>
                                        <option value="Sweden">Sweden</option>
                                        <option value="Switzerland">Switzerland</option>
                                        <option value="Syria">Syria</option>
                                        <option value="Taiwan">Taiwan</option>
                                        <option value="Tajikistan">Tajikistan</option>
                                        <option value="Tanzania">Tanzania</option>
                                        <option value="Thailand">Thailand</option>
                                        <option value="Timor-Leste">Timor-Leste</option>
                                        <option value="Togo">Togo</option>
                                        <option value="Tonga">Tonga</option>
                                        <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                                        <option value="Tunisia">Tunisia</option>
                                        <option value="Turkey">Turkey</option>
                                        <option value="Turkmenistan">Turkmenistan</option>
                                        <option value="Tuvalu">Tuvalu</option>
                                        <option value="Uganda">Uganda</option>
                                        <option value="Ukraine">Ukraine</option>
                                        <option value="United Arab Emirates">United Arab Emirates</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                        <option value="United States">United States</option>
                                        <option value="Uruguay">Uruguay</option>
                                        <option value="Uzbekistan">Uzbekistan</option>
                                        <option value="Vanuatu">Vanuatu</option>
                                        <option value="Vatican City">Vatican City</option>
                                        <option value="Venezuela">Venezuela</option>
                                        <option value="Vietnam">Vietnam</option>
                                        <option value="Yemen">Yemen</option>
                                        <option value="Zambia">Zambia</option>
                                        <option value="Zimbabwe">Zimbabwe</option>
                                    </select>
                                </div>

                                {/* Background Info */}
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-primary-navy">Give me some background information <span className="text-red-500">*</span></label>
                                    <textarea
                                        required
                                        className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-accent-green rounded-2xl transition-all outline-none text-sm min-h-[120px]"
                                        value={formData.backgroundInfo}
                                        placeholder='What is the most important advice you need ? What are your Future plans'
                                        onChange={e => setFormData({ ...formData, backgroundInfo: e.target.value })}
                                    />
                                </div>

                                {/* Deadline / Urgency */}
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-primary-navy">Is there any deadline/urgency? Any visa expiration? <span className="text-red-500">*</span></label>
                                    <textarea
                                        required
                                        className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-accent-green rounded-2xl transition-all outline-none text-sm min-h-[80px]"
                                        value={formData.deadlineUrgency}
                                        onChange={e => setFormData({ ...formData, deadlineUrgency: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary-navy text-white py-5 rounded-3xl font-bold text-lg hover:bg-accent-green transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                            >
                                Review Your Booking
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </form>
                    )}

                    {/* Step 6: Review & Payment */}
                    {step === 6 && (
                        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300">
                            <div className="bg-gray-50 rounded-[2.5rem] p-8 space-y-6">
                                <h3 className="text-lg font-bold text-primary-navy border-b border-gray-200 pb-4">Booking Summary</h3>

                                <div className="space-y-4 text-sm pb-2">
                                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-gray-100 pb-2 sm:border-0">
                                        <div className="text-gray-400 font-bold uppercase tracking-widest text-[9px] shrink-0">Consultation</div>
                                        <div className="text-primary-navy font-bold sm:text-right">{duration === 15 ? '15min Book Consultation' : '40min Deep Dive Session'}</div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-gray-100 pb-2 sm:border-0">
                                        <div className="text-gray-400 font-bold uppercase tracking-widest text-[9px] shrink-0">Session (Your local time)</div>
                                        <div className="text-primary-navy font-bold sm:text-right">{currentDay.name}, {currentDay.date} @ {formData.local_display_time}</div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-gray-100 pb-2 sm:border-0">
                                        <div className="text-gray-400 font-bold uppercase tracking-widest text-[9px] shrink-0">Client Name</div>
                                        <div className="text-primary-navy font-bold sm:text-right break-words">{formData.name}</div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-gray-100 pb-2 sm:border-0">
                                        <div className="text-gray-400 font-bold uppercase tracking-widest text-[9px] shrink-0">Email</div>
                                        <div className="text-primary-navy font-bold sm:text-right break-all">{formData.email}</div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                        <div className="text-gray-400 font-bold uppercase tracking-widest text-[9px] shrink-0">Country</div>
                                        <div className="text-primary-navy font-bold sm:text-right">{formData.passportCountry}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-accent-green/5 border border-accent-green/20 rounded-3xl p-6 flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] font-black text-accent-green uppercase tracking-[0.2em] mb-1">Total Due Now</div>
                                    <div className="text-3xl font-black text-primary-navy">${duration === 15 ? '75' : '150'} <span className="text-sm font-medium text-gray-400">AUD</span></div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] p-2 bg-accent-green/10 text-accent-green rounded-lg font-bold">Secure Payment</span>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="w-full bg-primary-navy text-white py-6 rounded-[2rem] font-black text-xl hover:bg-black transition-all shadow-2xl shadow-primary-navy/20 active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Pay & Confirm Booking
                                        <Check className="w-6 h-6" />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest max-w-xs mx-auto">
                                Secure checkout by Stripe. Your booking is not confirmed until payment is received.
                            </p>
                        </div>
                    )}

                    {/* Step 7: Success Screen */}
                    {step === 7 && (
                        <div className="max-w-md mx-auto py-12 text-center space-y-8 animate-in zoom-in fade-in duration-500">
                            <div className="relative mx-auto w-32 h-32">
                                <div className="absolute inset-0 bg-accent-green rounded-full animate-ping opacity-20" />
                                <div className="relative w-full h-full bg-white border-8 border-accent-green rounded-full flex items-center justify-center shadow-2xl shadow-accent-green/20">
                                    <CheckCircle2 className="w-16 h-16 text-accent-green" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-3xl font-black text-primary-navy uppercase tracking-tighter">Booking Confirmed!</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">
                                    Thank you, <span className="text-primary-navy font-bold">{formData.name}</span>. Your {duration}-min session on <span className="text-primary-navy font-bold">{currentDay.date}</span> at <span className="text-primary-navy font-bold">{formData.local_display_time}</span> has been scheduled successfully.
                                </p>
                            </div>

                            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-4 text-left">
                                <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-md">
                                    <Image src="/Aditi.jpeg" alt="Aditi Mohan" width={48} height={48} className="object-cover" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expert Consultant</p>
                                    <p className="text-sm font-bold text-primary-navy">Please check your email for the booking confirmation and the link for the video call.</p>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full bg-primary-navy text-white py-5 rounded-3xl font-black text-lg hover:bg-black transition-all shadow-2xl shadow-primary-navy/10 active:scale-95 flex items-center justify-center gap-2"
                            >
                                Done
                                <Check className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Cancel Booking Footer */}
                {step >= 3 && step < 7 && (
                    <div className="p-6 border-t border-gray-100 flex justify-center">
                        <button
                            onClick={() => setShowCancelConfirm(true)}
                            className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors"
                        >
                            Cancel Booking
                        </button>
                    </div>
                )}

                {/* Confirmation Overlay */}
                {showCancelConfirm && (
                    <div className="absolute inset-0 z-[110] bg-white/95 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-300">
                        <div className="text-center max-w-sm">
                            <h3 className="text-2xl font-black text-primary-navy mb-8 uppercase tracking-tight">Are you sure?</h3>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => { onClose(); setShowCancelConfirm(false); }}
                                    className="flex-1 px-8 py-4 rounded-2xl bg-gray-50 text-gray-400 font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => setShowCancelConfirm(false)}
                                    className="flex-1 px-8 py-4 rounded-2xl bg-primary-navy text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-navy/20 hover:scale-105 transition-all"
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

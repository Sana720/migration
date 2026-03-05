'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { X, Calendar as CalendarIcon, Clock, Check, ChevronRight, Phone, Mail, User, MessageSquare, ArrowLeft } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialDuration?: 15 | 40 | null;
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

export default function BookingModal({ isOpen, onClose, initialDuration }: BookingModalProps) {
    const supabase = createClient();
    const [step, setStep] = useState<1 | 2 | 3>(1);
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
        appointment_time: ''
    });

    // Initialize state and handle opening/closing
    useEffect(() => {
        if (isOpen) {
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
                setFormData({ name: '', email: '', phone: '', message: '', appointment_time: '' });
            }, 300);
        }
    }, [isOpen, initialDuration]);

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
                .eq('duration_type', `${duration}-min`);

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

    // Generate next 5 business days
    const generateDays = (): DayOption[] => {
        const days: DayOption[] = [];
        let count = 0;
        let iter = 0;
        while (count < 5 && iter < 14) {
            const d = new Date();
            d.setDate(d.getDate() + iter);
            const dayNum = d.getDay(); // Sunday is 0, matching Admin UI and standard JS

            if (dayNum !== 6 && dayNum !== 7) {
                days.push({
                    name: d.toLocaleDateString('en-US', { weekday: 'long' }),
                    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    dateIso: d.toISOString().split('T')[0],
                    dayNum: dayNum
                });
                count++;
            }
            iter++;
        }
        return days;
    };

    const days = generateDays();
    const currentDay = days[selectedDayIndex];

    // Generate time slots for the selected day
    const getTimeSlots = () => {
        if (!currentDay || !duration) return [];

        const dayAvailability = availability.find(a => a.day_of_week === currentDay.dayNum);
        if (!dayAvailability) return [];

        const slots: { time: string; isBooked: boolean }[] = [];
        const [startH, startM] = dayAvailability.start_time.split(':').map(Number);
        const [endH, endM] = dayAvailability.end_time.split(':').map(Number);

        let current = new Date();
        current.setHours(startH, startM, 0, 0);

        const end = new Date();
        end.setHours(endH, endM, 0, 0);

        while (current < end) {
            const slotStr = current.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            // Check if this slot is already booked for the current date
            const booked = existingBookings.some(
                booking => booking.appointment_date === currentDay.dateIso && booking.appointment_time === slotStr
            );

            // Check if this slot is manually blocked
            const blocked = dayAvailability.blocked_slots?.includes(slotStr);

            if (!blocked) {
                slots.push({ time: slotStr, isBooked: booked });
            }

            current.setMinutes(current.getMinutes() + duration);
        }
        return slots;
    };

    const timeSlots = getTimeSlots();

    const handleSelectSlot = (slot: string) => {
        setFormData(prev => ({ ...prev, appointment_time: slot }));
        setStep(3);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('leads')
                .insert({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: formData.message,
                    type: `${duration}-min`,
                    appointment_date: currentDay.dateIso,
                    appointment_time: formData.appointment_time,
                    status: 'new'
                });

            if (error) throw error;

            alert('Booking request sent successfully! Aditi will contact you soon.');
            onClose();
        } catch (error: any) {
            console.error('Error submitting lead:', error);
            alert('Error: ' + error.message);
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
                onClick={onClose}
            ></div>

            {/* Modal Body */}
            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col">

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
                                {step === 1 ? 'Select Service' : step === 2 ? 'Choose Time' : 'Contact Details'}
                            </h2>
                            <div className="flex gap-1 mt-1">
                                {[1, 2, 3].map(i => (
                                    <div
                                        key={i}
                                        className={`h-1 w-8 rounded-full transition-all ${i <= step ? 'bg-accent-green' : 'bg-gray-100'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-10">
                    {/* Step 1: Duration Selection */}
                    {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                            {[
                                {
                                    min: 15,
                                    title: 'Initial Assessment',
                                    desc: 'Quick eligibility check and brief visa queries.',
                                    color: 'border-accent-green',
                                    bg: 'bg-accent-green/5'
                                },
                                {
                                    min: 40,
                                    title: 'Full Consultation',
                                    desc: 'Comprehensive visa strategy and detailed document review.',
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
                                    <p className="text-sm text-gray-500 leading-relaxed mb-6">{opt.desc}</p>
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
                                    <Image src="/logo.png" alt="Expert" fill className="object-cover" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Available Next Week</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-primary-navy">{duration} Min Professional Session</h3>
                                    <p className="text-sm text-gray-500">Video call or phone consultation with Aditi.</p>
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
                                    <span className="text-[10px] font-bold text-gray-400">Timezone: Sydney (GMT+11)</span>
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
                                                onClick={() => handleSelectSlot(slot.time)}
                                                className={`p-4 rounded-xl border text-sm font-bold transition-all text-center flex flex-col items-center justify-center gap-1 ${slot.isBooked
                                                    ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                                                    : 'border-gray-100 text-primary-navy hover:border-accent-green hover:bg-accent-green/5'
                                                    }`}
                                            >
                                                <span>{slot.time}</span>
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
                        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
                            {/* Summary Card */}
                            <div className="flex items-center justify-between p-6 bg-accent-green/5 border border-accent-green/20 rounded-3xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-accent-green rounded-2xl flex items-center justify-center text-white">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-primary-navy">{duration} Min Consultation</div>
                                        <div className="text-xs text-gray-500">{currentDay.name}, {currentDay.date} @ {formData.appointment_time}</div>
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
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
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
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
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
                                disabled={submitting}
                                type="submit"
                                className="w-full bg-primary-navy text-white py-5 rounded-3xl font-bold text-lg hover:bg-accent-green transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing Request...
                                    </>
                                ) : (
                                    <>
                                        Confirm Booking Request
                                        <ChevronRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest">
                                By submitting, you agree to our terms and conditions.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

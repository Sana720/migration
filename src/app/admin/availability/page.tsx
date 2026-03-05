'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
    Plus,
    Trash2,
    Clock,
    Calendar as CalendarIcon,
    AlertCircle,
    CheckCircle2,
    Save,
    Copy,
    ChevronDown,
    X,
    Filter,
    Settings2,
    RefreshCw
} from 'lucide-react';

interface Availability {
    id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    duration_type: string;
    is_active: boolean;
    blocked_slots?: string[];
}

const days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const durationOptions = [
    { label: 'Standard Hourly Session', value: 'hourly' }
];

const START_HOUR = 8;
const END_HOUR = 21;

export default function AvailabilityManager() {
    const supabase = createClient();
    const [availability, setAvailability] = useState<Availability[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeDuration, setActiveDuration] = useState('hourly');
    const [showBulkModal, setShowBulkModal] = useState(false);

    // Bulk Update State
    const [bulkDays, setBulkDays] = useState<number[]>([]);
    const [bulkStart, setBulkStart] = useState('09:00');
    const [bulkEnd, setBulkEnd] = useState('17:00');
    const [bulkDuration, setBulkDuration] = useState('hourly');

    async function fetchAvailability() {
        setLoading(true);
        const { data, error } = await supabase
            .from('availability')
            .select('*')
            .order('day_of_week', { ascending: true });

        if (error) console.error('Error fetching availability:', error);
        else setAvailability(data || []);
        setLoading(false);
    }

    useEffect(() => {
        // eslint-disable-next-line
        fetchAvailability();
    }, []);

    const toggleActive = async (id: string, current: boolean) => {
        const { error } = await supabase
            .from('availability')
            .update({ is_active: !current })
            .eq('id', id);

        if (error) alert('Error: ' + error.message);
        else fetchAvailability();
    };

    const addSlot = async (day: number) => {
        const { error } = await supabase
            .from('availability')
            .insert({
                day_of_week: day,
                start_time: '09:00:00',
                end_time: '17:00:00',
                duration_type: activeDuration,
                is_active: true
            });

        if (error) alert('Error: ' + error.message);
        else fetchAvailability();
    };

    const deleteSlot = async (id: string) => {
        const { error } = await supabase
            .from('availability')
            .delete()
            .eq('id', id);

        if (error) alert('Error: ' + error.message);
        else fetchAvailability();
    };

    const handleBulkSave = async () => {
        if (bulkDays.length === 0) {
            alert('Please select at least one day.');
            return;
        }

        const newSlots = bulkDays.map(day => ({
            day_of_week: day,
            start_time: `${bulkStart}:00`,
            end_time: `${bulkEnd}:00`,
            duration_type: bulkDuration,
            is_active: true
        }));

        const { error } = await supabase
            .from('availability')
            .insert(newSlots);

        if (error) {
            alert('Error: ' + error.message);
        } else {
            setShowBulkModal(false);
            setBulkDays([]);
            fetchAvailability();
        }
    };

    const toggleBulkDay = (day: number) => {
        setBulkDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const toggleSlotBlock = async (slotId: string, time: string, isBlocked: boolean) => {
        const slot = availability.find(s => s.id === slotId);
        if (!slot) return;

        let newBlockedSlots = [...(slot.blocked_slots || [])];
        if (isBlocked) {
            newBlockedSlots = newBlockedSlots.filter(t => t !== time);
        } else {
            newBlockedSlots.push(time);
        }

        const { error } = await supabase
            .from('availability')
            .update({ blocked_slots: newBlockedSlots })
            .eq('id', slotId);

        if (error) alert('Error: ' + error.message);
        else fetchAvailability();
    };

    const getActiveRangeForTime = (dayIdx: number, hour: number, minute: number) => {
        const timeInMins = hour * 60 + minute;
        return availability.find(slot => {
            if (slot.day_of_week !== dayIdx) return false;
            if (activeDuration !== 'all' && slot.duration_type !== activeDuration) return false;

            const [startH, startM] = slot.start_time.split(':').map(Number);
            const [endH, endM] = slot.end_time.split(':').map(Number);
            const startTotal = startH * 60 + startM;
            const endTotal = endH * 60 + endM;

            // Slot must start within the range
            return timeInMins >= startTotal && timeInMins < endTotal;
        });
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col space-y-6 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-primary-navy tracking-tight uppercase">Availability</h1>
                    <p className="text-gray-500 mt-2 font-medium tracking-tight">Structured grid for session management.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="bg-white p-1.5 rounded-2xl border border-gray-100 flex gap-1 shadow-sm">
                        {durationOptions.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setActiveDuration(opt.value)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeDuration === opt.value
                                    ? 'bg-primary-navy text-white shadow-md'
                                    : 'text-gray-400 hover:text-primary-navy hover:bg-gray-50'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchAvailability}
                            disabled={loading}
                            className={`p-3 bg-white border-2 border-primary-navy/10 rounded-xl text-primary-navy hover:bg-gray-50 transition-all flex items-center justify-center ${loading ? 'opacity-50' : ''}`}
                            title="Sync Latest Data"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            className="bg-accent-green text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-accent-green/20"
                            onClick={() => setShowBulkModal(true)}
                        >
                            <Plus className="w-4 h-4" />
                            Bulk Create
                        </button>
                    </div>
                </div>
            </div>

            {/* Unified Scroll Container */}
            <div className="flex-1 bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden flex flex-col min-h-0">
                <div className="flex-1 overflow-auto scrollbar-hide">
                    <div className="min-w-[1900px] relative">

                        {/* Time Ruler (Hour Headers) */}
                        <div className="flex items-center border-b border-gray-100 bg-gray-50 sticky top-0 z-[60]">
                            <div className="w-[140px] sticky left-0 z-[70] bg-gray-50 border-r border-gray-100 h-16 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-gray-300" />
                            </div>
                            <div className="flex-1 flex overflow-hidden">
                                {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 min-w-[130px] text-center border-l border-gray-200/50 first:border-l-0 h-16 flex items-center justify-center"
                                    >
                                        <span className="text-[12px] font-black text-primary-navy/40 uppercase tracking-widest">
                                            {START_HOUR + i}:00
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Day Rows */}
                        <div className="divide-y divide-gray-100">
                            {days.map((day, dayIdx) => {
                                const daySlots = availability.filter(slot =>
                                    slot.day_of_week === dayIdx &&
                                    (activeDuration === 'all' || slot.duration_type === activeDuration)
                                );

                                return (
                                    <div key={day} className="flex group/row min-h-[120px]">
                                        {/* Day Name (Sticky) */}
                                        <div className="w-[140px] sticky left-0 z-[50] bg-white border-r border-gray-100 p-4 flex flex-col items-center justify-start gap-4 shrink-0 group-hover/row:bg-gray-50 transition-colors overflow-y-auto scrollbar-hide">
                                            <div className="text-center">
                                                <h3 className="font-black text-primary-navy text-sm uppercase tracking-widest">{day.slice(0, 3)}</h3>
                                                <button
                                                    onClick={() => addSlot(dayIdx)}
                                                    className="mt-2 w-8 h-8 bg-white shadow-md border border-gray-100 text-accent-green hover:bg-accent-green hover:text-white rounded-lg transition-all flex items-center justify-center mx-auto active:scale-90"
                                                    title="Add Range"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Range Management List */}
                                            <div className="w-full space-y-2 mt-4">
                                                {daySlots.map(range => (
                                                    <div key={range.id} className="bg-gray-50 border border-gray-100 rounded-xl p-2 group/range relative">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[9px] font-black text-primary-navy/60 uppercase">{range.start_time.slice(0, 5)} - {range.end_time.slice(0, 5)}</span>
                                                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{range.duration_type}</span>
                                                        </div>
                                                        <div className="absolute inset-0 bg-primary-navy/95 text-white flex items-center justify-center gap-1.5 rounded-xl opacity-0 hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => toggleActive(range.id, range.is_active)}
                                                                className={`p-1 rounded-md ${range.is_active ? 'text-accent-green' : 'text-gray-400'}`}
                                                                title={range.is_active ? 'Active' : 'Paused'}
                                                            >
                                                                <Settings2 className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                onClick={() => deleteSlot(range.id)}
                                                                className="p-1 text-red-400 hover:text-red-300"
                                                                title="Delete Range"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Hour Columns Grid */}
                                        <div className="flex-1 flex overflow-hidden">
                                            {Array.from({ length: END_HOUR - START_HOUR }).map((_, hIdx) => {
                                                const hour = START_HOUR + hIdx;
                                                const minsForHour = [0];

                                                return (
                                                    <div key={hIdx} className="flex-1 min-w-[120px] border-l border-gray-50/50 p-2 h-full flex flex-col justify-center">
                                                        <div className="grid grid-cols-1 gap-1 w-full h-full">
                                                            {minsForHour.map(min => {
                                                                const range = getActiveRangeForTime(dayIdx, hour, min);
                                                                const duration = 60;

                                                                // Calculate End Time
                                                                const startMins = hour * 60 + min;
                                                                const endMins = startMins + duration;
                                                                const endH = Math.floor(endMins / 60);
                                                                const endM = endMins % 60;

                                                                const displayRange = `${hour}:${min.toString().padStart(2, '0')} - ${endH}:${endM.toString().padStart(2, '0')}`;

                                                                const fullTime = new Date();
                                                                fullTime.setHours(hour, min, 0, 0);
                                                                const formattedTime = fullTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

                                                                const isBlocked = range?.blocked_slots?.includes(formattedTime);
                                                                const isActive = range?.is_active;

                                                                if (!range) return (
                                                                    <div key={min} className="rounded-xl border border-dashed border-gray-100 bg-gray-50/30" />
                                                                );

                                                                return (
                                                                    <div
                                                                        key={min}
                                                                        onClick={() => toggleSlotBlock(range.id, formattedTime, !!isBlocked)}
                                                                        className={`relative rounded-lg flex items-center justify-center text-[9px] font-black transition-all border-2 overflow-hidden cursor-pointer px-1 ${!isActive
                                                                            ? 'bg-gray-100 border-gray-200 text-gray-400 grayscale opacity-40'
                                                                            : isBlocked
                                                                                ? 'bg-red-500 border-red-600 text-white shadow-lg'
                                                                                : 'bg-white border-accent-green/20 text-accent-green hover:bg-accent-green hover:text-white hover:scale-105'
                                                                            }`}
                                                                        title={isBlocked ? 'Hidden from Homepage' : 'Visible on Homepage'}
                                                                    >
                                                                        <span className="leading-tight whitespace-nowrap">{displayRange}</span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bulk Creation Modal */}
            {showBulkModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-primary-navy/70 backdrop-blur-xl transition-all" onClick={() => setShowBulkModal(false)}></div>
                    <div className="relative bg-white w-full max-w-xl rounded-[3.5rem] shadow-2xl border border-white/20 overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-10 md:p-14">
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h2 className="text-3xl font-black text-primary-navy tracking-tight uppercase">Bulk Create</h2>
                                    <p className="text-sm text-gray-500 mt-2 font-medium">Apply hours to multiple days instantly.</p>
                                </div>
                                <button onClick={() => setShowBulkModal(false)} className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-2xl transition-all">
                                    <X className="w-8 h-8 text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Working Days</label>
                                    <div className="flex flex-wrap gap-2">
                                        {days.map((day, idx) => (
                                            <button
                                                key={day}
                                                onClick={() => toggleBulkDay(idx)}
                                                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all border-2 ${bulkDays.includes(idx)
                                                    ? 'bg-primary-navy border-primary-navy text-white shadow-xl shadow-primary-navy/20 active:scale-95'
                                                    : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                                                    }`}
                                            >
                                                {day.slice(0, 3)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Start Hour</label>
                                        <input
                                            type="time"
                                            className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-accent-green transition-all font-black text-lg text-primary-navy"
                                            value={bulkStart}
                                            onChange={e => setBulkStart(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">End Hour</label>
                                        <input
                                            type="time"
                                            className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-accent-green transition-all font-black text-lg text-primary-navy"
                                            value={bulkEnd}
                                            onChange={e => setBulkEnd(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Session Policy</label>
                                    <div className="grid grid-cols-1">
                                        {durationOptions.map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => setBulkDuration(opt.value)}
                                                className={`px-4 py-4 rounded-xl text-[10px] font-black transition-all border-2 uppercase tracking-widest ${bulkDuration === opt.value
                                                    ? 'bg-accent-green border-accent-green text-white'
                                                    : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleBulkSave}
                                    className="w-full bg-primary-navy text-white py-5 rounded-[2rem] font-black text-lg hover:bg-accent-green transition-all shadow-2xl active:scale-[0.98] mt-4"
                                >
                                    Apply Schedule
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

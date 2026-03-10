'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
    Search,
    Filter,
    MoreHorizontal,
    Mail,
    Phone,
    Calendar as CalendarIcon,
    Clock,
    CheckCircle2,
    XCircle,
    Eye,
    FileText,
    Bell,
    CalendarClock,
    Loader2,
    Trash2,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';

interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    type: string;
    appointment_date: string;
    appointment_time: string;
    status: string;
    created_at: string;
    message: string;
}

export default function LeadsManager() {
    const supabase = createClient();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const leadsPerPage = 5;
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [reschedulingLead, setReschedulingLead] = useState<Lead | null>(null);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [sendingReminderId, setSendingReminderId] = useState<string | null>(null);
    const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

    useEffect(() => {
        fetchLeads();
    }, []);

    async function fetchLeads() {
        setLoading(true);
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching leads:', error);
        else setLeads(data || []);
        setLoading(false);
    }

    const updateStatus = async (id: string, status: string) => {
        const { error } = await supabase
            .from('leads')
            .update({ status })
            .eq('id', id);

        if (error) alert('Error updating status: ' + error.message);
        else fetchLeads();
    };

    const handleSendReminder = async (lead: Lead) => {
        try {
            setSendingReminderId(lead.id);
            const res = await fetch('/api/send-reminder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lead)
            });
            const data = await res.json();

            if (res.ok) {
                alert(`Success! Reminder email successfully sent via Hostinger to ${lead.name} (${lead.email}).`);
            } else {
                alert(`Error sending email: ${data.error || 'Unknown error'}`);
            }
        } catch (error: any) {
            alert('A network error occurred: ' + error.message);
        } finally {
            setSendingReminderId(null);
        }
    };

    const handleReschedule = async () => {
        if (!reschedulingLead || !newDate || !newTime) return;
        setLoading(true);
        const { error } = await supabase
            .from('leads')
            .update({
                appointment_date: newDate,
                appointment_time: newTime,
                status: 'rescheduled' // optional status change
            })
            .eq('id', reschedulingLead.id);

        if (error) {
            alert('Error rescheduling: ' + error.message);
        } else {
            alert(`Successfully rescheduled ${reschedulingLead.name} to ${newDate} at ${newTime}.`);
            setReschedulingLead(null);
            fetchLeads();
        }
        setLoading(false);
    };

    const handleStatusChange = async (leadId: string, newStatus: string) => {
        setLoading(true);
        const { error } = await supabase
            .from('leads')
            .update({ status: newStatus })
            .eq('id', leadId);

        if (error) {
            alert('Error updating status: ' + error.message);
        } else {
            fetchLeads();
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!leadToDelete) return;
        setLoading(true);
        const { error } = await supabase
            .from('leads')
            .delete()
            .eq('id', leadToDelete.id);

        if (error) {
            alert('Error deleting lead: ' + error.message);
        } else {
            setLeadToDelete(null);
            fetchLeads();
        }
        setLoading(false);
    };

    const filteredLeads = leads.filter(lead =>
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const indexOfLastLead = currentPage * leadsPerPage;
    const indexOfFirstLead = indexOfLastLead - leadsPerPage;
    const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
    const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Reset pagination when searching
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-primary-navy tracking-tight">Leads & Enquiries</h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage all incoming migration booking enquiries.</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-3 bg-primary-navy text-white px-8 py-4 rounded-2xl font-bold hover:bg-accent-green transition-all shadow-lg">
                        <Filter className="w-5 h-5" />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-[2rem] w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-green transition-all font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Leads List */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center">
                        <div className="animate-spin w-10 h-10 border-4 border-accent-green border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-500 font-bold">Loading leads...</p>
                    </div>
                ) : filteredLeads.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                <tr>
                                    <th className="px-8 py-5">Client Information</th>
                                    <th className="px-8 py-5">Booking Details</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5">Created</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {currentLeads.map((lead) => (
                                    <tr key={lead.id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-primary-navy/5 flex items-center justify-center font-bold text-primary-navy text-lg group-hover:scale-110 transition-transform">
                                                    {lead.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-primary-navy text-lg">{lead.name}</div>
                                                    <div className="flex flex-col gap-1 mt-1">
                                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                                            <Mail className="w-3 h-3" />
                                                            {lead.email}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                                            <Phone className="w-3 h-3" />
                                                            {lead.phone}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="space-y-3">
                                                <span className="px-4 py-1.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 uppercase tracking-wider">
                                                    {lead.type}
                                                </span>
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-2 text-sm text-primary-navy font-bold">
                                                        <CalendarIcon className="w-3.5 h-3.5 text-accent-green" />
                                                        {lead.appointment_date}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {lead.appointment_time}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="relative inline-block">
                                                <select
                                                    value={lead.status}
                                                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                                    className={`appearance-none pl-8 pr-10 py-2 rounded-full text-sm font-bold border-none cursor-pointer transition-all shadow-sm hover:shadow-md focus:ring-2 focus:ring-offset-2 focus:outline-none ${lead.status === 'new' ? 'bg-blue-50 text-blue-600 focus:ring-blue-500' :
                                                        lead.status === 'contacted' ? 'bg-amber-50 text-amber-600 focus:ring-amber-500' :
                                                            'bg-green-50 text-green-600 focus:ring-green-500'
                                                        }`}
                                                >
                                                    <option value="new">New</option>
                                                    <option value="contacted">Contacted</option>
                                                    <option value="converted">Converted</option>
                                                </select>
                                                <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ${lead.status === 'new' ? 'bg-blue-500 animate-pulse' :
                                                    lead.status === 'contacted' ? 'bg-amber-500' : 'bg-green-500'
                                                    } pointer-events-none`}></div>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <ChevronRight className="w-4 h-4 rotate-90 text-current opacity-50" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="text-xs font-medium text-gray-400">
                                                {new Date(lead.created_at).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-right">
                                            <div className="flex items-center justify-end gap-3 font-sans">
                                                <div className="relative group/view">
                                                    <button
                                                        onClick={() => setSelectedLead(lead)}
                                                        className="p-3 bg-white text-gray-400 hover:text-primary-navy shadow-sm hover:shadow-md rounded-xl transition-all"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-primary-navy text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 invisible group-hover/view:opacity-100 group-hover/view:visible transition-all whitespace-nowrap z-50 shadow-xl pointer-events-none">
                                                        View Details
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-primary-navy"></div>
                                                    </div>
                                                </div>

                                                <div className="relative group/remind">
                                                    <button
                                                        onClick={() => handleSendReminder(lead)}
                                                        disabled={sendingReminderId === lead.id}
                                                        className="p-3 bg-white text-gray-400 hover:text-blue-500 shadow-sm hover:shadow-md rounded-xl transition-all disabled:opacity-50"
                                                    >
                                                        {sendingReminderId === lead.id ? (
                                                            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                                                        ) : (
                                                            <Bell className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-primary-navy text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 invisible group-hover/remind:opacity-100 group-hover/remind:visible transition-all whitespace-nowrap z-50 shadow-xl pointer-events-none">
                                                        Send Reminder
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-primary-navy"></div>
                                                    </div>
                                                </div>

                                                <div className="relative group/resched">
                                                    <button
                                                        onClick={() => setReschedulingLead(lead)}
                                                        className="p-3 bg-white text-gray-400 hover:text-amber-500 shadow-sm hover:shadow-md rounded-xl transition-all"
                                                    >
                                                        <CalendarClock className="w-5 h-5" />
                                                    </button>
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-primary-navy text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 invisible group-hover/resched:opacity-100 group-hover/resched:visible transition-all whitespace-nowrap z-50 shadow-xl pointer-events-none">
                                                        Reschedule
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-primary-navy"></div>
                                                    </div>
                                                </div>

                                                <div className="relative group/del">
                                                    <button
                                                        onClick={() => setLeadToDelete(lead)}
                                                        className="p-3 bg-white text-gray-400 hover:text-red-600 shadow-sm hover:shadow-md rounded-xl transition-all"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 invisible group-hover/del:opacity-100 group-hover/del:visible transition-all whitespace-nowrap z-50 shadow-xl pointer-events-none">
                                                        Delete
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-red-600"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        {filteredLeads.length > 0 && (
                            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    Showing {indexOfFirstLead + 1} to {Math.min(indexOfLastLead, filteredLeads.length)} of {filteredLeads.length} leads
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary-navy hover:shadow-md transition-all disabled:opacity-30 disabled:hover:shadow-none"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => paginate(i + 1)}
                                            className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === i + 1
                                                ? 'bg-primary-navy text-white shadow-lg'
                                                : 'bg-white border border-gray-100 text-gray-400 hover:text-primary-navy hover:shadow-md'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary-navy hover:shadow-md transition-all disabled:opacity-30 disabled:hover:shadow-none"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-32 text-center">
                        <div className="bg-gray-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                            <Mail className="w-12 h-12 text-gray-200" />
                        </div>
                        <h3 className="text-2xl font-bold text-primary-navy">No leads yet</h3>
                        <p className="text-gray-500 mt-2 font-medium max-w-sm mx-auto">When clients book through your website, they will appear here automatically.</p>
                    </div>
                )}
            </div>

            {/* Lead Details Modal */}
            {selectedLead && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 lg:p-10">
                    <div className="absolute inset-0 bg-primary-navy/80 backdrop-blur-sm" onClick={() => setSelectedLead(null)} />
                    <div className="bg-white rounded-[2rem] p-8 max-w-2xl w-full relative z-10 max-h-[90vh] overflow-y-auto shadow-2xl">
                        <button onClick={() => setSelectedLead(null)} className="absolute top-6 right-6 p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors group">
                            <XCircle className="w-6 h-6 text-gray-400 group-hover:text-primary-navy" />
                        </button>

                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                            <div className="w-16 h-16 rounded-3xl bg-primary-navy/5 flex items-center justify-center font-bold text-primary-navy text-2xl">
                                {selectedLead.name?.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-primary-navy tracking-tight">{selectedLead.name}</h2>
                                <p className="text-gray-400 font-bold mt-1 uppercase tracking-widest text-[10px]">{selectedLead.type} • {selectedLead.status}</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Basic Info */}
                            <div>
                                <h3 className="text-xs font-black text-gray-300 uppercase tracking-[0.3em] mb-4">Contact & Booking</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100/50">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2"><Mail className="w-3 h-3" /> Email</p>
                                        <p className="font-bold text-primary-navy break-all">{selectedLead.email}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100/50">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2"><Phone className="w-3 h-3" /> Phone</p>
                                        <p className="font-bold text-primary-navy">{selectedLead.phone}</p>
                                    </div>
                                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 md:col-span-2">
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 flex items-center gap-2"><CalendarIcon className="w-3 h-3" /> Scheduled Session</p>
                                        <p className="font-black text-blue-900 text-lg">{selectedLead.appointment_date} at {selectedLead.appointment_time}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Questionnaire & Message */}
                            {selectedLead.message && (
                                <div>
                                    <h3 className="text-xs font-black text-gray-300 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" /> Questionnaire Details</h3>
                                    {(() => {
                                        const msg = selectedLead.message;
                                        if (!msg.includes('**Booking Details**')) {
                                            return <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm whitespace-pre-wrap font-medium text-primary-navy leading-relaxed text-sm">{msg}</div>;
                                        }

                                        const lines = msg.split('\n');
                                        const details: { question: string, answer: string }[] = [];
                                        let additionalMessage = '';
                                        let isAdditionalMessage = false;

                                        lines.forEach(line => {
                                            if (line.trim() === '') return;
                                            if (line.includes('**Additional Message:**')) {
                                                isAdditionalMessage = true;
                                                return;
                                            }
                                            if (line.includes('**Booking Details**')) return;

                                            if (isAdditionalMessage) {
                                                additionalMessage += line + '\n';
                                            } else if (line.startsWith('- ')) {
                                                const cleanLine = line.substring(2);
                                                const colonPos = cleanLine.indexOf(': ');
                                                if (colonPos !== -1) {
                                                    details.push({ question: cleanLine.substring(0, colonPos), answer: cleanLine.substring(colonPos + 2) });
                                                } else {
                                                    const qMarkPos = cleanLine.indexOf('? ');
                                                    if (qMarkPos !== -1) {
                                                        details.push({ question: cleanLine.substring(0, qMarkPos + 1), answer: cleanLine.substring(qMarkPos + 2) });
                                                    } else {
                                                        details.push({ question: cleanLine, answer: '' });
                                                    }
                                                }
                                            }
                                        });

                                        return (
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 gap-4">
                                                    {details
                                                        .filter(item => !item.question.toLowerCase().includes('nearest office'))
                                                        .map((item, i) => (
                                                            <div key={i} className="bg-white border border-gray-100 border-l-4 border-l-primary-navy p-5 rounded-2xl shadow-sm">
                                                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{item.question}</p>
                                                                <p className="font-bold text-primary-navy text-base">{item.answer || <span className="text-gray-300 italic">Not provided</span>}</p>
                                                            </div>
                                                        ))}
                                                </div>
                                                {additionalMessage.trim() && additionalMessage.trim() !== 'None provided' && (
                                                    <div className="bg-amber-50/50 border border-amber-100 border-l-4 border-l-amber-400 p-6 rounded-2xl shadow-sm mt-6">
                                                        <p className="text-[10px] font-black text-amber-600/70 uppercase tracking-widest mb-2">Attached Message</p>
                                                        <p className="font-bold text-amber-900 whitespace-pre-wrap text-[15px] leading-relaxed italic border-l-2 border-amber-200 pl-4">{additionalMessage.trim()}</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>

                        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setSelectedLead(null)}
                                className="bg-primary-navy text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-accent-green transition-all shadow-xl shadow-primary-navy/20"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rescheduling Modal */}
            {reschedulingLead && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 lg:p-10">
                    <div className="absolute inset-0 bg-primary-navy/80 backdrop-blur-sm" onClick={() => setReschedulingLead(null)} />
                    <div className="bg-white rounded-[2rem] p-8 max-w-md w-full relative z-10 shadow-2xl">
                        <button onClick={() => setReschedulingLead(null)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-primary-navy">
                            <XCircle className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl font-black text-primary-navy mb-6">Reschedule</h2>
                        <p className="text-sm font-medium text-gray-500 mb-6">Set a new date and time for {reschedulingLead.name}.</p>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="text-sm font-bold text-primary-navy block mb-2">New Date</label>
                                <input
                                    type="date"
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:border-accent-green outline-none font-medium"
                                    value={newDate}
                                    onChange={(e) => setNewDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-primary-navy block mb-2">New Time</label>
                                <input
                                    type="time"
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:border-accent-green outline-none font-medium"
                                    value={newTime}
                                    onChange={(e) => setNewTime(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleReschedule}
                            className="w-full bg-primary-navy text-white px-8 py-4 rounded-xl font-black hover:bg-accent-green transition-all shadow-xl disabled:opacity-50"
                            disabled={!newDate || !newTime}
                        >
                            Confirm Reschedule
                        </button>
                    </div>
                </div>
            )}

            {/* Deletion Confirmation Modal */}
            {leadToDelete && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 lg:p-10">
                    <div className="absolute inset-0 bg-primary-navy/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setLeadToDelete(null)} />
                    <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full relative z-10 shadow-2xl text-center animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Trash2 className="w-10 h-10 text-red-600" />
                        </div>
                        <h2 className="text-3xl font-black text-primary-navy mb-4 tracking-tight uppercase">Are you sure?</h2>
                        <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                            You are about to permanently delete <span className="font-bold text-primary-navy">{leadToDelete.name}&apos;s</span> lead. This action cannot be undone.
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setLeadToDelete(null)}
                                className="flex-1 px-8 py-5 rounded-2xl bg-gray-50 text-gray-400 font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-8 py-5 rounded-2xl bg-red-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-red-200 hover:scale-105 active:scale-95 transition-all"
                            >
                                Delete Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

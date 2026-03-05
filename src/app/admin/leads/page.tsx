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
    Archive
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
}

export default function LeadsManager() {
    const supabase = createClient();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredLeads = leads.filter(lead =>
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-primary-navy tracking-tight">Leads & Enquiries</h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage all incoming migration booking enquiries.</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-3 bg-white border border-gray-100 text-gray-600 px-6 py-4 rounded-2xl font-bold hover:shadow-lg transition-all">
                        <Archive className="w-5 h-5" />
                        <span>Archived</span>
                    </button>
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
                                {filteredLeads.map((lead) => (
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
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${lead.status === 'new' ? 'bg-blue-500 animate-pulse' :
                                                    lead.status === 'contacted' ? 'bg-amber-500' : 'bg-green-500'
                                                    }`}></div>
                                                <span className="text-sm font-bold text-primary-navy capitalize">{lead.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="text-xs font-medium text-gray-400">
                                                {new Date(lead.created_at).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => updateStatus(lead.id, 'contacted')}
                                                    className="p-3 bg-white text-gray-400 hover:text-amber-500 shadow-sm hover:shadow-md rounded-xl transition-all"
                                                    title="Mark as Contacted"
                                                >
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(lead.id, 'archived')}
                                                    className="p-3 bg-white text-gray-400 hover:text-red-500 shadow-sm hover:shadow-md rounded-xl transition-all"
                                                    title="Archive"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
        </div>
    );
}

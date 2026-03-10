'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
    Users,
    FileText,
    Calendar,
    TrendingUp,
    ArrowUpRight,
    Search,
    ChevronRight,
    Loader2,
    Mail,
    Clock
} from 'lucide-react';
import Link from 'next/link';

interface Lead {
    id: string;
    name: string;
    email: string;
    type: string;
    status: string;
    appointment_date: string;
    appointment_time: string;
    created_at: string;
}

export default function AdminDashboard() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([
        { label: 'Total Leads', value: '0', change: '--', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Resources', value: '0', change: '--', icon: FileText, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Pending Bookings', value: '0', change: '--', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Conversion Rate', value: '24%', change: '+4.5%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    ]);
    const [recentLeads, setRecentLeads] = useState<Lead[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    async function fetchDashboardData() {
        setLoading(true);
        try {
            // Fetch Total Leads
            const { count: leadsCount } = await supabase
                .from('leads')
                .select('*', { count: 'exact', head: true });

            // Fetch Resources (Blogs)
            const { count: blogsCount } = await supabase
                .from('blogs')
                .select('*', { count: 'exact', head: true });

            // Fetch Pending Bookings (New Leads)
            const { count: pendingCount } = await supabase
                .from('leads')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'new');

            // Fetch Converted Leads
            const { count: convertedCount } = await supabase
                .from('leads')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'converted');

            // Fetch Recent Leads
            const { data: leadsData } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            const totalLeads = leadsCount || 0;
            const convRate = totalLeads > 0
                ? ((convertedCount || 0) / totalLeads * 100).toFixed(1)
                : '0';

            setStats([
                { label: 'Total Leads', value: totalLeads.toString(), change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Resources', value: (blogsCount || 0).toString(), change: '+2', icon: FileText, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Pending Bookings', value: (pendingCount || 0).toString(), change: 'Live', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: 'Conversion Rate', value: `${convRate}%`, change: 'Live', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
            ]);

            setRecentLeads(leadsData || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-primary-navy">Dashboard</h1>
                    <p className="text-gray-500 mt-2 font-medium">Welcome back. Here&apos;s what&apos;s happening today.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl w-full md:w-80 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-green transition-all font-medium"
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                            <div className="flex items-center justify-between mb-6">
                                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex items-center gap-1 text-green-600 font-bold text-xs bg-green-50 px-3 py-1 rounded-full">
                                    <ArrowUpRight className="w-4 h-4" />
                                    <span>{stat.change}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">{stat.label}</p>
                                <h3 className="text-3xl font-extrabold text-primary-navy">
                                    {loading ? <Loader2 className="w-6 h-6 animate-spin text-gray-200" /> : stat.value}
                                </h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Leads Preview */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-primary-navy">Recent Leads</h2>
                    <Link href="/admin/leads" className="text-sm font-bold text-accent-green hover:underline">View All Leads</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Name</th>
                                <th className="px-8 py-5">Type</th>
                                <th className="px-8 py-5">Date</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <Loader2 className="w-10 h-10 animate-spin text-accent-green mx-auto mb-4" />
                                        <p className="text-gray-400 font-bold">Fetching latest leads...</p>
                                    </td>
                                </tr>
                            ) : recentLeads.length > 0 ? (
                                recentLeads.map((lead) => (
                                    <tr key={lead.id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-primary-navy/5 flex items-center justify-center font-bold text-primary-navy uppercase">
                                                    {lead.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-primary-navy">{lead.name}</div>
                                                    <div className="text-xs text-gray-400">{lead.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-xs font-bold text-gray-500">
                                            {lead.type}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm text-gray-600 font-medium">{lead.appointment_date}</div>
                                            <div className="text-xs text-gray-400">{lead.appointment_time}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${lead.status === 'new' ? 'bg-blue-500 animate-pulse' :
                                                    lead.status === 'contacted' ? 'bg-amber-500' : 'bg-green-500'
                                                    }`}></span>
                                                <span className="text-sm text-gray-600 font-bold capitalize">
                                                    {lead.status === 'converted' ? 'Converted' : lead.status}
                                                </span>
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Link href="/admin/leads" className="inline-block p-3 hover:bg-white hover:shadow-md rounded-xl transition-all">
                                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Mail className="w-8 h-8 text-gray-200" />
                                        </div>
                                        <h3 className="font-bold text-primary-navy">No recent leads</h3>
                                        <p className="text-sm text-gray-400 mt-1">New enquiries will appear here.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

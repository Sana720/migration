'use client';

import {
    Users,
    FileText,
    Calendar,
    TrendingUp,
    ArrowUpRight,
    Search,
    ChevronRight
} from 'lucide-react';

const stats = [
    { label: 'Total Leads', value: '128', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Pages', value: '14', change: '+2', icon: FileText, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending Bookings', value: '7', change: '-3%', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Conversion Rate', value: '24%', change: '+4.5%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-primary-navy">Dashboard</h1>
                    <p className="text-gray-500 mt-2 font-medium">Welcome back, Aditi. Here's what's happening today.</p>
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
                                <h3 className="text-3xl font-extrabold text-primary-navy">{stat.value}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Leads Preview */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-primary-navy">Recent Leads</h2>
                    <button className="text-sm font-bold text-accent-green hover:underline">View All Leads</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Name</th>
                                <th className="px-8 py-5">Type</th>
                                <th className="px-8 py-5">Date</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[1, 2, 3].map((i) => (
                                <tr key={i} className="group hover:bg-gray-50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary-navy/5 flex items-center justify-center font-bold text-primary-navy">
                                                JD
                                            </div>
                                            <div>
                                                <div className="font-bold text-primary-navy">John Doe</div>
                                                <div className="text-xs text-gray-400">john@example.com</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-green-50 text-green-700">15-Min Assessment</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm text-gray-600 font-medium">March 10, 2026</div>
                                        <div className="text-xs text-gray-400">10:30 AM</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                            <span className="text-sm text-gray-600 font-bold">New</span>
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <button className="p-3 hover:bg-white hover:shadow-md rounded-xl transition-all">
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

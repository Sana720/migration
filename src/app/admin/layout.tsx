'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    Menu as MenuIcon,
    Users,
    Calendar,
    LogOut,
    ChevronRight,
    BookOpen
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const sidebarItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Pages', href: '/admin/pages', icon: FileText },
    { name: 'Blogs', href: '/admin/blogs', icon: BookOpen },
    { name: 'Menu Items', href: '/admin/menu', icon: MenuIcon },
    { name: 'Leads', href: '/admin/leads', icon: Users },
    { name: 'Availability', href: '/admin/availability', icon: Calendar },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 shadow-xl transition-all">
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="p-8 border-b border-gray-100">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-primary-navy rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
                                <span className="text-white font-bold text-xl">F</span>
                            </div>
                            <span className="font-bold text-xl text-primary-navy tracking-tight">Admin Panel</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center justify-between p-4 rounded-2xl font-bold transition-all group ${isActive
                                        ? 'bg-primary-navy text-white shadow-lg'
                                        : 'text-gray-500 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <Icon className={`w-5 h-5 ${isActive ? 'text-accent-green' : 'group-hover:text-primary-navy'}`} />
                                        <span>{item.name}</span>
                                    </div>
                                    {isActive && <ChevronRight className="w-4 h-4 text-accent-green" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-6 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-4 w-full p-4 text-gray-500 font-bold hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72 p-10 min-h-screen">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

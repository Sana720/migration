'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface Blog {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    thumbnail_url: string;
    is_published: boolean;
    author_name: string;
    created_at: string;
}

const ITEMS_PER_PAGE = 6;

export default function ResourcesListingPage() {
    const supabase = createClient();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        async function fetchBlogs() {
            setLoading(true);
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .eq('is_published', true)
                .order('created_at', { ascending: false });

            if (error) console.error('Error fetching blogs:', error);
            setBlogs((data as Blog[]) || []);
            setLoading(false);
        }
        fetchBlogs();
    }, []);


    const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
    const paginated = blogs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <PageLayout>
            <div className="bg-white min-h-screen">
                {/* Hero section for Resources */}
                <section className="relative pt-40 pb-24 px-4 bg-primary-navy text-white overflow-hidden">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/aboriginal-bg.png"
                            alt="Background"
                            fill
                            className="object-cover scale-105 opacity-20"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-navy via-primary-navy/90 to-transparent z-10"></div>
                    </div>

                    {/* Decorative blurred elements */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute top-[-10%] right-[-10%] w-1/2 h-1/2 bg-accent-green rounded-full blur-[120px]"></div>
                        <div className="absolute bottom-[-10%] left-[-10%] w-1/2 h-1/2 bg-secondary-blue rounded-full blur-[120px]"></div>
                    </div>

                    <div className="max-w-6xl mx-auto text-center relative z-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full text-accent-green font-bold text-[10px] mb-8 border border-white/10 uppercase tracking-[0.3em] shadow-2xl">
                            Forte Migration • Expert Insights
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-[1.1]">
                            Immigration <span className="text-accent-green italic">Insights</span>
                        </h1>
                        <p className="text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
                            Stay updated with the Australian migration policies, visa updates, and success stories.
                        </p>
                    </div>
                </section>

                {/* Blog Grid */}
                <section className="py-20 px-4">
                    <div className="max-w-6xl mx-auto">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-gray-100 rounded-[2.5rem] h-96 animate-pulse" />
                                ))}
                            </div>
                        ) : blogs.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                                <p className="text-gray-400 font-bold">No articles published yet. Check back soon!</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                    {paginated.map((blog: Blog) => (
                                        <Link
                                            key={blog.id}
                                            href={`/resources/${blog.slug}`}
                                            className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 transition-all hover:shadow-2xl hover:-translate-y-2"
                                        >
                                            {/* Thumbnail */}
                                            <div className="relative h-64 overflow-hidden bg-gray-50">
                                                <Image
                                                    src={blog.thumbnail_url || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800'}
                                                    alt={blog.title}
                                                    fill
                                                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute top-6 left-6">
                                                    <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary-navy">
                                                        Insights
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-8 flex-1 flex flex-col">
                                                <div className="flex items-center gap-4 text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-4">
                                                    <span className="flex items-center gap-1.5 font-black text-accent-green">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    {blog.author_name && (
                                                        <span className="flex items-center gap-1.5">
                                                            <User className="w-3.5 h-3.5" />
                                                            {blog.author_name}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="text-2xl font-black text-primary-navy mb-4 leading-tight group-hover:text-accent-green transition-colors">
                                                    {blog.title}
                                                </h3>

                                                <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                                                    {blog.excerpt || 'Read our latest update on Australian migration policies and how they might affect your visa application.'}
                                                </p>

                                                <div className="flex items-center gap-2 text-primary-navy font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                                                    Read Article <ArrowRight className="w-4 h-4 text-accent-green" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-3 mt-16">
                                        <button
                                            onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            disabled={page === 1}
                                            className="w-12 h-12 flex items-center justify-center rounded-2xl border-2 border-gray-200 text-gray-400 hover:border-primary-navy hover:text-primary-navy disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>

                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${page === i + 1
                                                    ? 'bg-primary-navy text-white shadow-lg'
                                                    : 'border-2 border-gray-200 text-gray-500 hover:border-primary-navy hover:text-primary-navy'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            disabled={page === totalPages}
                                            className="w-12 h-12 flex items-center justify-center rounded-2xl border-2 border-gray-200 text-gray-400 hover:border-primary-navy hover:text-primary-navy disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </PageLayout>
    );
}

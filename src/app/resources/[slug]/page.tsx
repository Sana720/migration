import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Clock, Share2 } from 'lucide-react';

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

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ResourceDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

    const blog = data as Blog | null;

    if (error || !blog) {
        notFound();
    }

    return (
        <PageLayout>
            <div className="bg-white min-h-screen">
                {/* Hero Header */}
                <section className="relative pt-48 pb-20 px-4 bg-primary-navy text-white overflow-hidden">
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <Image
                            src={blog.thumbnail_url || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200'}
                            alt="Background"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-navy to-transparent" />
                    </div>

                    <div className="max-w-4xl mx-auto relative z-10">
                        <Link
                            href="/resources"
                            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-black uppercase tracking-widest mb-10 group"
                        >
                            <ArrowLeft className="w-4 h-4 text-accent-green group-hover:-translate-x-1 transition-transform" />
                            Back to Resources
                        </Link>

                        <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight">
                            {blog.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-8 text-white/70 text-sm font-bold">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-accent-green/20 flex items-center justify-center border border-accent-green/30">
                                    <User className="w-5 h-5 text-accent-green" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest opacity-50">Written by</span>
                                    <span>{blog.author_name || 'Forte Migration Expert'}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest opacity-50">Published on</span>
                                    <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                    <Clock className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest opacity-50">Reading time</span>
                                    <span>{Math.ceil((blog.content || '').split(' ').length / 200)} min read</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Article Content */}
                <section className="py-20 px-4">
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12">
                        {/* Sidebar Share */}
                        <div className="md:w-20 shrink-0 flex flex-row md:flex-col items-center gap-4 justify-center md:justify-start">
                            <span className="hidden md:block text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 whitespace-nowrap rotate-90 mb-12 w-fit origin-center">Share this</span>
                            {[1, 2, 3].map((i) => (
                                <button key={i} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary-navy hover:text-white transition-all hover:shadow-xl">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            ))}
                        </div>

                        {/* Main Body */}
                        <div className="flex-1">
                            <div className="relative aspect-[16/9] w-full rounded-[3rem] overflow-hidden shadow-2xl mb-16 border-8 border-white">
                                <Image
                                    src={blog.thumbnail_url || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200'}
                                    alt={blog.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <article className="prose prose-xl prose-slate max-w-none prose-headings:text-primary-navy prose-headings:font-black prose-p:text-gray-600 prose-p:leading-relaxed prose-strong:text-primary-navy prose-a:text-accent-green hover:prose-a:text-primary-navy transition-all">
                                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                            </article>

                            {/* Author Bio Footer */}
                            <div className="mt-20 p-10 bg-gray-50 rounded-[3rem] border border-gray-100 flex flex-col md:flex-row items-center gap-10">
                                <div className="w-24 h-24 rounded-3xl bg-primary-navy flex items-center justify-center text-white shrink-0 shadow-lg">
                                    <User className="w-12 h-12" />
                                </div>
                                <div className="text-center md:text-left">
                                    <h4 className="text-xl font-black text-primary-navy mb-2">About {blog.author_name || 'the Author'}</h4>
                                    <p className="text-gray-500 font-medium leading-relaxed">
                                        Forte Migration is dedicated to providing expert advice on Australian immigration. Our team stays on top of all legislative changes to ensure your application has the best chance of success.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PageLayout>
    );
}

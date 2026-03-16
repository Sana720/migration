import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import ShareButtons from '@/components/ShareButtons';

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

const cleanAIContent = (text: string) => {
    if (!text) return '';
    return text
        .replace(/:contentReference\[oaicite:\d+\]\{index=\d+\}/g, '')
        .replace(/\[oaicite:\d+\]/g, '')
        .replace(/【\d+†source】/g, '');
};

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

    // Fetch Previous Blog
    const { data: prevData } = await supabase
        .from('blogs')
        .select('title, slug')
        .eq('is_published', true)
        .lt('created_at', blog.created_at)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    // Fetch Next Blog
    const { data: nextData } = await supabase
        .from('blogs')
        .select('title, slug')
        .eq('is_published', true)
        .gt('created_at', blog.created_at)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

    const prevBlog = prevData as { title: string; slug: string } | null;
    const nextBlog = nextData as { title: string; slug: string } | null;

    return (
        <PageLayout>
            <div className="bg-white min-h-screen">
                {/* Hero Header */}
                <section className="relative pt-48 pb-20 px-4 bg-primary-navy text-white overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <Image
                            src="/aboriginal-bg.png"
                            alt="Background"
                            fill
                            className="object-cover scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-navy to-transparent" />
                    </div>

                    <div className="max-w-4xl mx-auto relative z-10">
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
                        <ShareButtons title={blog.title} />

                        {/* Main Body */}
                        <div className="flex-1">
                            <div className="relative aspect-[16/9] w-full rounded-[3rem] overflow-hidden shadow-2xl mb-16 border-8 border-white bg-gray-50">
                                <Image
                                    src={blog.thumbnail_url || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200'}
                                    alt={blog.title}
                                    fill
                                    className="object-cover object-left"
                                />
                            </div>

                            <article className="prose prose-xl prose-slate max-w-none prose-headings:text-primary-navy prose-headings:font-black prose-p:text-gray-600 prose-p:leading-relaxed prose-strong:text-primary-navy prose-a:text-accent-green hover:prose-a:text-primary-navy transition-all">
                                <div dangerouslySetInnerHTML={{ __html: cleanAIContent(blog.content) }} />
                            </article>

                            {/* Post Navigation */}
                            <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-8">
                                <div className="w-full sm:w-1/2">
                                    {prevBlog && (
                                        <Link
                                            href={`/resources/${prevBlog.slug}`}
                                            className="group flex flex-col gap-3 p-6 rounded-[2rem] bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 transition-all hover:shadow-xl"
                                        >
                                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent-green">
                                                <ChevronLeft className="w-4 h-4" /> Previous Post
                                            </span>
                                            <span className="text-primary-navy font-bold line-clamp-1 group-hover:text-accent-green transition-colors">
                                                {prevBlog.title}
                                            </span>
                                        </Link>
                                    )}
                                </div>
                                <div className="w-full sm:w-1/2 text-right">
                                    {nextBlog && (
                                        <Link
                                            href={`/resources/${nextBlog.slug}`}
                                            className="group flex flex-col gap-3 p-6 rounded-[2rem] bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 transition-all hover:shadow-xl items-end"
                                        >
                                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent-green">
                                                Next Post <ChevronRight className="w-4 h-4" />
                                            </span>
                                            <span className="text-primary-navy font-bold line-clamp-1 group-hover:text-accent-green transition-colors">
                                                {nextBlog.title}
                                            </span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PageLayout>
    );
}

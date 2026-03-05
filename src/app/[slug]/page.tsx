import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function DynamicPage({ params }: PageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: page, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

    if (error || !page) {
        notFound();
    }

    return (
        <PageLayout>
            <article className="flex-1 py-12 px-4 bg-white">
                <div className="max-w-4xl mx-auto py-20">
                    <h1 className="text-5xl md:text-7xl font-black text-primary-navy mb-12 tracking-tight">
                        {page.title}
                    </h1>

                    <div
                        className="prose prose-xl max-w-none text-gray-600 leading-relaxed font-medium"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                </div>
            </article>
        </PageLayout>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Plus, Edit2, Trash2, Eye, Search, FileText, X, Check } from 'lucide-react';

interface Page {
    id: string;
    title: string;
    slug: string;
    content: string;
    is_published: boolean;
    created_at: string;
}

export default function PagesManager() {
    const supabase = createClient();
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPage, setEditingPage] = useState<Page | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        is_published: true
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPages();
    }, []);

    async function fetchPages() {
        setLoading(true);
        const { data, error } = await supabase
            .from('pages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching pages:', error);
        else setPages(data || []);
        setLoading(false);
    }

    const handleOpenModal = (page: Page | null = null) => {
        if (page) {
            setEditingPage(page);
            setFormData({
                title: page.title,
                slug: page.slug,
                content: page.content || '',
                is_published: page.is_published
            });
        } else {
            setEditingPage(null);
            setFormData({
                title: '',
                slug: '',
                content: '',
                is_published: true
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPage(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingPage) {
                const { error } = await supabase
                    .from('pages')
                    .update(formData)
                    .eq('id', editingPage.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('pages')
                    .insert([formData]);
                if (error) throw error;
            }
            fetchPages();
            handleCloseModal();
        } catch (error: any) {
            alert('Error saving page: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this page?')) return;
        try {
            const { error } = await supabase
                .from('pages')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchPages();
        } catch (error: any) {
            alert('Error deleting page: ' + error.message);
        }
    };

    const filteredPages = pages.filter(page =>
        page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-primary-navy tracking-tight">Pages</h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage your website's dynamic pages and content.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-3 bg-primary-navy text-white px-8 py-4 rounded-2xl font-bold hover:bg-accent-green transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create New Page</span>
                </button>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search pages by title or slug..."
                        className="pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-green transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Pages Table */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center">
                        <div className="animate-spin w-10 h-10 border-4 border-accent-green border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-500 font-bold">Loading pages...</p>
                    </div>
                ) : filteredPages.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                <tr>
                                    <th className="px-8 py-5">Title</th>
                                    <th className="px-8 py-5">Slug</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5">Created</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredPages.map((page) => (
                                    <tr key={page.id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div className="font-bold text-primary-navy">{page.title}</div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <code className="text-xs font-mono bg-gray-100 px-3 py-1.5 rounded-lg text-gray-600">/{page.slug}</code>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${page.is_published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {page.is_published ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-medium text-gray-600">
                                                {new Date(page.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-3 bg-gray-50 text-gray-400 hover:text-primary-navy hover:bg-white hover:shadow-md rounded-xl transition-all">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModal(page)}
                                                    className="p-3 bg-gray-50 text-gray-400 hover:text-accent-green hover:bg-white hover:shadow-md rounded-xl transition-all"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(page.id)}
                                                    className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-white hover:shadow-md rounded-xl transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-20 text-center">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-primary-navy">No pages found</h3>
                        <p className="text-gray-500 mt-2 font-medium">Get started by creating your first page.</p>
                        <button
                            onClick={() => handleOpenModal()}
                            className="mt-8 bg-primary-navy text-white px-8 py-4 rounded-2xl font-bold hover:bg-accent-green transition-all shadow-lg"
                        >
                            Create Page
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-primary-navy/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-primary-navy">
                                {editingPage ? 'Edit Page' : 'Create New Page'}
                            </h2>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-6 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Page Title</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-accent-green rounded-2xl transition-all outline-none"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                                        placeholder="e.g. About Us"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">URL Slug</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">/</span>
                                        <input
                                            required
                                            type="text"
                                            className="w-full pl-8 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-accent-green rounded-2xl transition-all outline-none font-mono text-sm"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            placeholder="about-us"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Page Content (HTML/Markdown)</label>
                                <textarea
                                    className="w-full p-6 bg-gray-50 border border-transparent focus:bg-white focus:border-accent-green rounded-2xl transition-all outline-none min-h-[200px] font-mono text-sm"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="Enter page content here..."
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="published"
                                    className="w-5 h-5 rounded border-gray-300 text-accent-green focus:ring-accent-green"
                                    checked={formData.is_published}
                                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                />
                                <label htmlFor="published" className="text-sm font-bold text-gray-600">Publish immediately</label>
                            </div>
                            <button
                                disabled={saving}
                                type="submit"
                                className="w-full bg-primary-navy text-white py-5 rounded-3xl font-bold text-lg hover:bg-accent-green transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {saving ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <Check className="w-5 h-5" />}
                                {editingPage ? 'Save Changes' : 'Create Page'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

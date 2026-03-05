'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Plus, Edit2, Trash2, Eye, Search, BookOpen, X, Check, Image as ImageIcon } from 'lucide-react';

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

export default function BlogsManager() {
    const supabase = createClient();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        thumbnail_url: '',
        author_name: '',
        is_published: true
    });
    const [saving, setSaving] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchBlogs();
    }, []);

    async function fetchBlogs() {
        setLoading(true);
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching blogs:', error);
        else setBlogs(data || []);
        setLoading(false);
    }

    const handleOpenModal = (blog: Blog | null = null) => {
        setUploadFile(null);
        if (blog) {
            setEditingBlog(blog);
            setFormData({
                title: blog.title,
                slug: blog.slug,
                content: blog.content || '',
                excerpt: blog.excerpt || '',
                thumbnail_url: blog.thumbnail_url || '',
                author_name: blog.author_name || '',
                is_published: blog.is_published
            });
        } else {
            setEditingBlog(null);
            setFormData({
                title: '',
                slug: '',
                content: '',
                excerpt: '',
                thumbnail_url: '',
                author_name: '',
                is_published: true
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBlog(null);
        setUploadFile(null);
    };

    const uploadThumbnail = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `blogs/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            let finalThumbnailUrl = formData.thumbnail_url;

            if (uploadFile) {
                setUploading(true);
                finalThumbnailUrl = await uploadThumbnail(uploadFile);
                setUploading(false);
            }

            const payload = {
                ...formData,
                thumbnail_url: finalThumbnailUrl
            };

            if (editingBlog) {
                const { error } = await supabase
                    .from('blogs')
                    .update(payload)
                    .eq('id', editingBlog.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('blogs')
                    .insert([payload]);
                if (error) throw error;
            }
            fetchBlogs();
            handleCloseModal();
        } catch (error: any) {
            alert('Error saving blog: ' + error.message);
        } finally {
            setSaving(false);
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;
        try {
            const { error } = await supabase
                .from('blogs')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchBlogs();
        } catch (error: any) {
            alert('Error deleting blog: ' + error.message);
        }
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-primary-navy tracking-tight">Blog Posts</h1>
                    <p className="text-gray-500 mt-2 font-medium">Create and manage your articles and news updates.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-3 bg-primary-navy text-white px-8 py-4 rounded-2xl font-bold hover:bg-accent-green transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create New Post</span>
                </button>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search blogs by title or slug..."
                        className="pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-green transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Blogs Table */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center">
                        <div className="animate-spin w-10 h-10 border-4 border-accent-green border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-500 font-bold">Loading blogs...</p>
                    </div>
                ) : filteredBlogs.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                <tr>
                                    <th className="px-8 py-5">Article</th>
                                    <th className="px-8 py-5">Slug</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5">Author</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredBlogs.map((blog: Blog) => (
                                    <tr key={blog.id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                                                    <BookOpen className="w-5 h-5" />
                                                </div>
                                                <div className="font-bold text-primary-navy truncate max-w-[200px]">{blog.title}</div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <code className="text-xs font-mono bg-gray-100 px-3 py-1.5 rounded-lg text-gray-600">/blogs/{blog.slug}</code>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${blog.is_published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {blog.is_published ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-medium text-gray-600 italic">
                                                {blog.author_name || 'Anonymous'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-3 bg-gray-50 text-gray-400 hover:text-primary-navy hover:bg-white hover:shadow-md rounded-xl transition-all">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModal(blog)}
                                                    className="p-3 bg-gray-50 text-gray-400 hover:text-accent-green hover:bg-white hover:shadow-md rounded-xl transition-all"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(blog.id)}
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
                            <BookOpen className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-primary-navy">No blogs found</h3>
                        <p className="text-gray-500 mt-2 font-medium">Get started by creating your first blog post.</p>
                        <button
                            onClick={() => handleOpenModal()}
                            className="mt-8 bg-primary-navy text-white px-8 py-4 rounded-2xl font-bold hover:bg-accent-green transition-all shadow-lg"
                        >
                            Create Post
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-primary-navy/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
                    <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-primary-navy">
                                {editingBlog ? 'Edit Post' : 'Create New Post'}
                            </h2>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Title</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-accent-green rounded-2xl transition-all outline-none font-bold text-primary-navy"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })}
                                        placeholder="Enter title"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">URL Slug</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-accent-green rounded-2xl transition-all outline-none font-mono text-xs"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder="url-slug-here"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Author Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-accent-green rounded-2xl transition-all outline-none"
                                        value={formData.author_name}
                                        onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                                        placeholder="e.g. Aditi Sharma"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Thumbnail Image</label>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-4">
                                            {/* Primary Upload Area */}
                                            <label className="flex-1 cursor-pointer">
                                                <div className="w-full pl-6 pr-4 py-4 bg-gray-50 border border-dashed border-gray-200 hover:border-accent-green rounded-2xl transition-all flex items-center gap-3 text-gray-400 text-xs font-bold">
                                                    <Plus className="w-4 h-4 text-accent-green" />
                                                    <span>{uploadFile ? uploadFile.name : 'Upload file...'}</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                setUploadFile(file);
                                                                // Clear URL if uploading a new file to avoid confusion
                                                                setFormData({ ...formData, thumbnail_url: '' });
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </label>

                                            {/* Preview & Reset */}
                                            {(formData.thumbnail_url || uploadFile) && (
                                                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 shadow-inner group/preview">
                                                    <img
                                                        src={uploadFile ? URL.createObjectURL(uploadFile) : formData.thumbnail_url}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setUploadFile(null);
                                                            setFormData({ ...formData, thumbnail_url: '' });
                                                        }}
                                                        className="absolute inset-0 bg-red-500/80 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center text-white"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Excerpt (Short Summary)</label>
                                <textarea
                                    required
                                    className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-accent-green rounded-2xl transition-all outline-none text-sm resize-none"
                                    rows={2}
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    placeholder="Brief summary for the blog list..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Content (HTML/Markdown)</label>
                                <textarea
                                    required
                                    className="w-full p-6 bg-gray-50 border border-transparent focus:bg-white focus:border-accent-green rounded-2xl transition-all outline-none min-h-[300px] font-mono text-sm"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="Write your story here..."
                                />
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 italic">
                                <input
                                    type="checkbox"
                                    id="published"
                                    className="w-6 h-6 rounded-lg border-gray-300 text-accent-green focus:ring-accent-green"
                                    checked={formData.is_published}
                                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                />
                                <label htmlFor="published" className="text-sm font-black text-primary-navy cursor-pointer">Publish Post Immediately</label>
                            </div>

                            <button
                                disabled={saving || uploading}
                                type="submit"
                                className="w-full bg-primary-navy text-white py-6 rounded-3xl font-black text-xl hover:bg-accent-green transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {saving || uploading ? <div className="animate-spin w-6 h-6 border-3 border-white border-t-transparent rounded-full" /> : <Check className="w-6 h-6" />}
                                {uploading ? 'Uploading Image...' : (editingBlog ? 'Update Post' : 'Publish Article')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

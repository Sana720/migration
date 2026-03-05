'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
    Plus,
    Edit2,
    Trash2,
    ExternalLink,
    Save,
    ArrowUp,
    ArrowDown,
    Menu as MenuIcon,
    X,
    Check
} from 'lucide-react';

interface MenuItem {
    id: string;
    label: string;
    href: string;
    order_index: number;
    parent_id?: string | null;
}

export default function MenuManager() {
    const supabase = createClient();
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [formData, setFormData] = useState({
        label: '',
        href: '',
        parent_id: null as string | null
    });

    useEffect(() => {
        fetchMenuItems();
    }, []);

    async function fetchMenuItems() {
        setLoading(true);
        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .order('order_index', { ascending: true });

        if (error) console.error('Error fetching menu items:', error);
        else setItems(data || []);
        setLoading(false);
    }

    const handleOpenModal = (item: MenuItem | null = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                label: item.label,
                href: item.href,
                parent_id: item.parent_id || null
            });
        } else {
            setEditingItem(null);
            setFormData({
                label: '',
                href: '/',
                parent_id: null
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleSaveItem = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingItem) {
                const { error } = await supabase
                    .from('menu_items')
                    .update(formData)
                    .eq('id', editingItem.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('menu_items')
                    .insert([{
                        ...formData,
                        order_index: items.length
                    }]);
                if (error) throw error;
            }
            fetchMenuItems();
            handleCloseModal();
        } catch (error: any) {
            alert('Error saving menu item: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this menu item?')) return;
        try {
            const { error } = await supabase
                .from('menu_items')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchMenuItems();
        } catch (error: any) {
            alert('Error deleting menu item: ' + error.message);
        }
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newItems = [...items];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= items.length) return;

        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

        // Update order_index in state
        const updatedItems = newItems.map((item, i) => ({
            ...item,
            order_index: i
        }));

        setItems(updatedItems);
    };

    const handleSaveOrder = async () => {
        setSaving(true);
        const updates = items.map(item => ({
            id: item.id,
            label: item.label,
            href: item.href,
            order_index: item.order_index,
            parent_id: item.parent_id
        }));

        const { error } = await supabase
            .from('menu_items')
            .upsert(updates);

        if (error) alert('Error saving order: ' + error.message);
        else alert('Menu order saved successfully!');
        setSaving(false);
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-primary-navy tracking-tight">Navigation Menu</h1>
                    <p className="text-gray-500 mt-2 font-medium">Control the links in your website's header.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSaveOrder}
                        disabled={saving}
                        className="flex items-center gap-3 bg-accent-green text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-navy transition-all shadow-lg active:scale-95 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        <span>{saving ? 'Saving...' : 'Save Order'}</span>
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-3 bg-primary-navy text-white px-8 py-4 rounded-2xl font-bold hover:bg-accent-green transition-all shadow-lg active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Menu Item</span>
                    </button>
                </div>
            </div>

            {/* Menu List */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden p-8">
                {loading ? (
                    <div className="p-20 text-center">
                        <div className="animate-spin w-10 h-10 border-4 border-accent-green border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-500 font-bold">Loading menu...</p>
                    </div>
                ) : items.length > 0 ? (
                    <div className="space-y-4">
                        {items.filter(i => !i.parent_id).map((parent, pIdx) => (
                            <div key={parent.id} className="space-y-4">
                                <div
                                    className="group flex items-center justify-between p-6 bg-gray-50 hover:bg-white rounded-[2rem] border border-transparent hover:border-gray-100 hover:shadow-xl transition-all"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col gap-1">
                                            <button
                                                onClick={() => handleMove(items.indexOf(parent), 'up')}
                                                disabled={pIdx === 0}
                                                className="p-1 text-gray-400 hover:text-primary-navy disabled:opacity-20"
                                            >
                                                <ArrowUp className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleMove(items.indexOf(parent), 'down')}
                                                disabled={pIdx === items.filter(i => !i.parent_id).length - 1}
                                                className="p-1 text-gray-400 hover:text-primary-navy disabled:opacity-20"
                                            >
                                                <ArrowDown className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg text-primary-navy">{parent.label}</div>
                                            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mt-1">
                                                <ExternalLink className="w-3 h-3" />
                                                {parent.href}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleOpenModal(parent)}
                                            className="p-4 bg-white text-gray-400 hover:text-accent-green shadow-sm hover:shadow-lg rounded-2xl transition-all"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(parent.id)}
                                            className="p-4 bg-white text-gray-400 hover:text-red-500 shadow-sm hover:shadow-lg rounded-2xl transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Child Items */}
                                <div className="ml-12 space-y-3">
                                    {items.filter(child => child.parent_id === parent.id).map(child => (
                                        <div
                                            key={child.id}
                                            className="group flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 hover:border-accent-green/20 transition-all"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-2 h-2 rounded-full bg-accent-green/30" />
                                                <div>
                                                    <div className="font-bold text-sm text-primary-navy">{child.label}</div>
                                                    <div className="text-[10px] text-gray-400 font-medium">
                                                        {child.href}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(child)}
                                                    className="p-2 text-gray-400 hover:text-accent-green transition-all"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(child.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-20 text-center">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MenuIcon className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-primary-navy">Menu is empty</h3>
                        <p className="text-gray-500 mt-2 font-medium">Create items to build your navigation.</p>
                        <button
                            onClick={() => handleOpenModal()}
                            className="mt-8 bg-primary-navy text-white px-8 py-4 rounded-2xl font-bold hover:bg-accent-green transition-all shadow-lg"
                        >
                            Add First Item
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-primary-navy/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-primary-navy">
                                {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
                            </h2>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveItem} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Label</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-accent-green rounded-2xl transition-all outline-none"
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    placeholder="e.g. Home, Services, Contact"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Link (URL or Slug)</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-accent-green rounded-2xl transition-all outline-none font-mono text-sm"
                                    value={formData.href}
                                    onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                                    placeholder="e.g. /about or https://google.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Parent Item (Optional)</label>
                                <select
                                    className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-accent-green rounded-2xl transition-all outline-none text-sm appearance-none"
                                    value={formData.parent_id || ''}
                                    onChange={(e) => setFormData({ ...formData, parent_id: e.target.value || null })}
                                >
                                    <option value="">None (Top Level)</option>
                                    {items
                                        .filter(i => !i.parent_id && i.id !== editingItem?.id)
                                        .map(parent => (
                                            <option key={parent.id} value={parent.id}>{parent.label}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <button
                                disabled={saving}
                                type="submit"
                                className="w-full bg-primary-navy text-white py-5 rounded-3xl font-bold text-lg hover:bg-accent-green transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {saving ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <Check className="w-5 h-5" />}
                                {editingItem ? 'Save Changes' : 'Add Item'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

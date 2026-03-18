'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Lock, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function SettingsPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        if (formData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: formData.newPassword
            });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setFormData({ newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to update password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-extrabold text-primary-navy">Settings</h1>
                <p className="text-gray-500 mt-2 font-medium">Manage your account preferences and security.</p>
            </div>

            <div className="max-w-2xl">
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary-navy rounded-2xl flex items-center justify-center shadow-lg shadow-primary-navy/10">
                                <Lock className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-primary-navy">Security</h2>
                                <p className="text-sm text-gray-500 font-medium">Update your administrative password</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 px-1">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            required
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-green focus:bg-white transition-all font-medium"
                                            placeholder="••••••••"
                                            value={formData.newPassword}
                                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-navy transition-colors"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 px-1">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-green focus:bg-white transition-all font-medium"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-navy transition-colors"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {message && (
                                <div className={`flex items-center gap-3 p-4 rounded-2xl border ${
                                    message.type === 'success' 
                                        ? 'bg-green-50 border-green-100 text-green-700' 
                                        : 'bg-red-50 border-red-100 text-red-700'
                                } font-medium transition-all`}>
                                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    <span>{message.text}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto px-10 py-4 bg-primary-navy hover:bg-accent-green text-white font-bold rounded-2xl shadow-lg shadow-primary-navy/10 hover:shadow-accent-green/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Info Card */}
                <div className="mt-8 p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50 flex gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm text-blue-600">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm text-blue-800 font-medium leading-relaxed">
                            Changing your password will update your login credentials for the admin panel. Ensure you remember your new password or store it securely.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

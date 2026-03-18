'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Mail, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/admin/reset-password`,
            });

            if (error) throw error;

            setMessage({ 
                type: 'success', 
                text: 'Password reset link has been sent to your email.' 
            });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to send reset email' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-primary-navy">
                        Forgot Password?
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 font-medium">
                        Enter your email address and we&apos;ll send you a link to reset your password.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleReset}>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 px-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-green focus:bg-white transition-all font-medium"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {message && (
                        <div className={`flex items-center gap-3 p-4 rounded-2xl border ${
                            message.type === 'success' 
                                ? 'bg-green-50 border-green-100 text-green-700' 
                                : 'bg-red-50 border-red-100 text-red-700'
                        } font-medium`}>
                            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            <span>{message.text}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-primary-navy hover:bg-accent-green text-white font-bold rounded-2xl shadow-lg shadow-primary-navy/10 hover:shadow-accent-green/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                        {loading ? 'Sending link...' : 'Send Reset Link'}
                    </button>

                    <Link 
                        href="/admin/login" 
                        className="flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-primary-navy transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </Link>
                </form>
            </div>
        </div>
    );
}

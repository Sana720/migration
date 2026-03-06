import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@supabase/supabase-js';

const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ error: 'Email and OTP are required.' }, { status: 400 });
        }

        // 1. Check if OTP exists and is valid
        const { data, error } = await supabaseAdmin
            .from('otp_verifications')
            .select('*')
            .eq('email', email)
            .eq('otp', otp)
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'Invalid or expired verification code.' }, { status: 400 });
        }

        // 2. Success! Delete the OTP record (or mark as used) to prevent reuse
        await supabaseAdmin
            .from('otp_verifications')
            .delete()
            .eq('email', email);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Verify OTP Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

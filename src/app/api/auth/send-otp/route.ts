import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@/utils/supabase/client'; // Assuming client side util is okay for simple non-auth usage or create server one

// We should use server client to avoid client-side keys exposure if possible, 
// but since this is an API route, let's use a server-side Supabase client.
import { createClient as createServerClient } from '@supabase/supabase-js';

const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // We need service role to insert/delete OTPs easily
);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
        }

        // 1. Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // 2. Store in Supabase
        const { error: dbError } = await supabaseAdmin
            .from('otp_verifications')
            .insert({
                email,
                otp,
                expires_at: expiresAt.toISOString()
            });

        if (dbError) throw dbError;

        // 3. Send Email via Hostinger
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.hostinger.com',
            port: Number(process.env.SMTP_PORT) || 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #0f172a; margin-bottom: 24px;">Verify Your Email</h2>
        <p style="color: #4b5563; font-size: 16px; line-height: 24px;">
          To proceed with your booking at Forte Migration, please use the following verification code:
        </p>
        <div style="background-color: #f8fafc; padding: 32px; text-align: center; border-radius: 8px; margin: 32px 0;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #000;">${otp}</span>
        </div>
        <p style="color: #9ca3af; font-size: 14px; margin-top: 32px;">
          This code will expire in 10 minutes. If you did not request this, please ignore this email.
        </p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
        <p style="color: #6b7280; font-size: 12px; text-align: center;">
          &copy; ${new Date().getFullYear()} Forte Migration. All rights reserved.
        </p>
      </div>
    `;

        await transporter.sendMail({
            from: `"Forte Migration" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
            to: email,
            subject: `${otp} is your verification code for Forte Migration`,
            html: htmlContent,
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Send OTP Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

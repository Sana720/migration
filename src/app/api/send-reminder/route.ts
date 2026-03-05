import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const lead = await req.json();

        if (!lead || !lead.email) {
            return NextResponse.json({ error: 'Invalid lead data provided.' }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.hostinger.com',
            port: Number(process.env.SMTP_PORT) || 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Parse out the Local time explicitly if the system captured it
        let localTimeHtml = '';
        if (lead.message && lead.message.includes('- Local Time:')) {
            const match = lead.message.match(/- Local Time: (.*)/);
            if (match && match[1]) {
                localTimeHtml = `<strong>Your Local Time:</strong> ${match[1].trim()}<br><br>`;
            }
        }

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6; max-width: 600px;">
                <h2 style="color: #0f172a;">Reminder: Upcoming Session</h2>
                <p>Hi ${lead.name.split(' ')[0]},</p>
                <p>This is a quick reminder that your migration strategy session with <strong>Aditi Mohan</strong> is coming up soon.</p>
                
                <div style="background-color: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #0f172a;">Session Details</h3>
                    <strong>Date:</strong> ${lead.appointment_date}<br><br>
                    <strong>Sydney Time:</strong> ${lead.appointment_time}<br><br>
                    ${localTimeHtml}
                    <strong>Consultant:</strong> Aditi Mohan
                </div>

                <p>If you need to reschedule or submit any additional documents prior to our call, please simply reply directly to this email.</p>
                <br>
                <p>Best regards,<br>
                <strong>Forte Migration Team</strong><br>
                <a href="https://fortemigration.com.au">fortemigration.com.au</a></p>
            </div>
        `;

        const info = await transporter.sendMail({
            from: `"Forte Migration" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
            to: lead.email,
            subject: `Reminder: Your upcoming Forte Migration strategy session`,
            html: htmlContent,
        });

        return NextResponse.json({ success: true, messageId: info.messageId });

    } catch (error: any) {
        console.error('Email API Error:', error);
        return NextResponse.json({ error: 'Failed to send email: ' + error.message }, { status: 500 });
    }
}

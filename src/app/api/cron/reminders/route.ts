import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');
    if (secret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const d = new Date();
        const yest = new Date(d); yest.setDate(yest.getDate() - 1);
        const tom = new Date(d); tom.setDate(tom.getDate() + 2);

        const { data: leads, error } = await supabase
            .from('leads')
            .select('*')
            .in('status', ['new', 'rescheduled', 'contacted'])
            .gte('appointment_date', yest.toISOString().split('T')[0])
            .lte('appointment_date', tom.toISOString().split('T')[0]);

        if (error) throw error;
        if (!leads || leads.length === 0) {
            return NextResponse.json({ success: true, message: 'No upcoming appointments found.' });
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

        const emailsSent: { to: string; type: string }[] = [];

        for (const lead of leads) {
            const sendEmail = async (reminderType: string) => {
                let localTimeHtml = '';
                if (lead.message && lead.message.includes('- Local Time:')) {
                    const match = lead.message.match(/- Local Time: (.*)/);
                    if (match && match[1]) {
                        localTimeHtml = `<strong>Your Local Time:</strong> ${match[1].trim()}<br><br>`;
                    }
                }

                const htmlContent = `
                    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6; max-width: 600px;">
                        <h2 style="color: #0f172a;">Session Starting in ${reminderType}</h2>
                        <p>Hi ${lead.name.split(' ')[0]},</p>
                        <p>This is an automated reminder that your migration strategy session with <strong>Aditi Mohan</strong> is starting in exactly ${reminderType}.</p>
                        
                        <div style="background-color: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #0f172a;">Session Details</h3>
                            <strong>Date:</strong> ${lead.appointment_date}<br><br>
                            <strong>Sydney Time:</strong> ${lead.appointment_time}<br><br>
                            ${localTimeHtml}
                            <strong>Consultant:</strong> Aditi Mohan
                        </div>

                        <p>Please ensure you are ready and have a stable internet connection. We look forward to speaking with you shortly!</p>
                        <br>
                        <p>Best regards,<br>
                        <strong>Forte Migration Team</strong><br>
                        <a href="https://fortemigration.com.au">fortemigration.com.au</a></p>
                    </div>
                `;

                await transporter.sendMail({
                    from: `"Forte Migration" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
                    to: lead.email,
                    subject: `Starting Soon: Your Forte Migration strategy session`,
                    html: htmlContent,
                });
                emailsSent.push({ to: lead.email, type: reminderType });
            };

            // This is placeholder logic outlining exactly where to compare current time to lead.appointment_time
            // Ex: 
            // const minsUntilMeeting = calculateMinutesDifference(Date.now(), lead.appointment_date, lead.appointment_time);
            // if (minsUntilMeeting > 10 && minsUntilMeeting <= 15) { await sendEmail("15 Minutes") }
            // else if (minsUntilMeeting > 25 && minsUntilMeeting <= 30) { await sendEmail("30 Minutes") }
        }

        return NextResponse.json({
            success: true,
            scanned: leads.length,
            remindersSent: emailsSent
        });

    } catch (error: any) {
        console.error('Cron Error:', error);
        return NextResponse.json({ error: 'Failed to process reminders: ' + error.message }, { status: 500 });
    }
}

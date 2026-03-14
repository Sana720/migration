import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const booking = await req.json();

        if (!booking || !booking.email) {
            return NextResponse.json({ error: 'Invalid booking data provided.' }, { status: 400 });
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

        const userHtmlContent = `
            <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
                <h2 style="color: #0f172a; margin-bottom: 16px;">Booking Confirmed!</h2>
                <p>Hi ${booking.name.split(' ')[0]},</p>
                <p>Your migration strategy session with <strong>Aditi Mohan</strong> has been successfully booked. We've included the details below for your reference.</p>
                
                <div style="background-color: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 24px 0;">
                    <h3 style="margin-top: 0; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Session Details</h3>
                    <p style="margin: 8px 0;"><strong>Service:</strong> ${booking.type || 'Consultation'}</p>
                    <p style="margin: 8px 0;"><strong>Date:</strong> ${booking.appointment_date}</p>
                    <p style="margin: 8px 0;"><strong>Sydney Time:</strong> ${booking.appointment_time}</p>
                    ${booking.local_display_time ? `<p style="margin: 8px 0;"><strong>Your Local Time:</strong> ${booking.local_display_time}</p>` : ''}
                    <p style="margin: 8px 0;"><strong>Consultant:</strong> Aditi Mohan</p>
                </div>

                <p><strong>Next Steps:</strong></p>
                <ul style="padding-left: 20px;">
                    <li>You will receive a calendar invitation shortly with the meeting link.</li>
                    <li>If you have any documents relevant to your case, please feel free to reply to this email and attach them.</li>
                    <li>Please ensure you are in a quiet environment with a stable internet connection for our call.</li>
                </ul>

                <p style="margin-top: 32px;">If you need to reschedule or have any questions, please reply directly to this email.</p>
                
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
                <p style="font-size: 14px; color: #64748b; text-align: center;">
                    &copy; ${new Date().getFullYear()} Forte Migration. All rights reserved.<br>
                    <a href="https://fortemigration.com.au" style="color: #3b82f6; text-decoration: none;">fortemigration.com.au</a>
                </p>
            </div>
        `;

        const adminHtmlContent = `
            <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
                <h2 style="color: #0f172a; margin-bottom: 16px;">New Booking Received</h2>
                <p>A new strategy session has been booked.</p>
                
                <div style="background-color: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 24px 0;">
                    <h3 style="margin-top: 0; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Lead Information</h3>
                    <p style="margin: 8px 0;"><strong>Name:</strong> ${booking.name}</p>
                    <p style="margin: 8px 0;"><strong>Email:</strong> ${booking.email}</p>
                    <p style="margin: 8px 0;"><strong>Phone:</strong> ${booking.phone}</p>
                    <p style="margin: 8px 0;"><strong>Service:</strong> ${booking.type}</p>
                    <p style="margin: 8px 0;"><strong>Date:</strong> ${booking.appointment_date}</p>
                    <p style="margin: 8px 0;"><strong>Sydney Time:</strong> ${booking.appointment_time}</p>
                </div>

                <div style="background-color: #fffbeb; padding: 20px; border: 1px solid #fef3c7; border-radius: 8px; margin: 24px 0;">
                    <h3 style="margin-top: 0; color: #92400e; border-bottom: 1px solid #fef3c7; padding-bottom: 8px;">Message/Details</h3>
                    <pre style="white-space: pre-wrap; font-family: inherit; font-size: 14px; color: #78350f;">${booking.message}</pre>
                </div>

                <p style="font-size: 14px; color: #64748b; text-align: center; margin-top: 32px;">
                    Sent from Forte Migration Booking System
                </p>
            </div>
        `;

        // Send to User
        await transporter.sendMail({
            from: `"Forte Migration" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
            to: booking.email,
            subject: `Confirmed: Your Strategy Session with Forte Migration`,
            html: userHtmlContent,
        });

        // Send to Admin
        const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
        if (adminEmail) {
            await transporter.sendMail({
                from: `"Forte Migration Notifications" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
                to: adminEmail,
                subject: `New Booking: ${booking.name} - ${booking.appointment_date}`,
                html: adminHtmlContent,
            });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Confirmation Email Error:', error);
        return NextResponse.json({ error: 'Failed to send confirmation email: ' + error.message }, { status: 500 });
    }
}

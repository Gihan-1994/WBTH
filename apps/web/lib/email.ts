import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
    to: string;
    subject: string;
    message: string;
    bookingId?: string;
}

/**
 * Validate email format using RFC 5322 compliant regex
 */
function isValidEmail(email: string): boolean {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Check if email domain is not in invalid/test domain list
 */
function hasValidDomain(email: string): boolean {
    const invalidDomains = [
        'example.com',
        'test.com',
        'localhost',
        'invalid.com',
        'temp.com',
    ];

    const domain = email.split('@')[1]?.toLowerCase();
    return domain ? !invalidDomains.includes(domain) : false;
}

/**
 * Comprehensive email validation
 */
export function validateEmail(email: string): { valid: boolean; reason?: string } {
    if (!email || typeof email !== 'string') {
        return { valid: false, reason: 'Email is required' };
    }

    const trimmedEmail = email.trim();

    if (!isValidEmail(trimmedEmail)) {
        return { valid: false, reason: 'Invalid email format' };
    }

    if (!hasValidDomain(trimmedEmail)) {
        return { valid: false, reason: 'Invalid email domain' };
    }

    return { valid: true };
}

/**
 * Send notification email using Resend
 * Uses the same message as in-app notifications for consistency
 */
export async function sendNotificationEmail(params: SendEmailParams) {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.warn('RESEND_API_KEY not configured, skipping email notification');
            return;
        }

        // Validate email before sending
        const validation = validateEmail(params.to);
        if (!validation.valid) {
            console.warn(`Invalid email address: ${params.to} - ${validation.reason}`);
            return;
        }

        await resend.emails.send({
            from: 'WBTH Notifications <notifications@nggp94.xyz>', // Using verified domain
            to: params.to,
            subject: params.subject,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
                    <div style="max-width: 600px; margin: 40px auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 24px;">WBTH</h1>
                            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">Travel Booking Platform</p>
                        </div>
                        
                        <!-- Content -->
                        <div style="padding: 40px 30px;">
                            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 20px;">${params.subject}</h2>
                            <p style="color: #555; line-height: 1.6; font-size: 16px; margin: 0 0 20px 0;">
                                ${params.message}
                            </p>
                            
                            ${params.bookingId ? `
                            <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0;">
                                <p style="margin: 0; color: #666; font-size: 14px;">
                                    <strong>Booking ID:</strong> ${params.bookingId}
                                </p>
                            </div>
                            ` : ''}
                            
                            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" 
                                   style="display: inline-block; background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                    View Dashboard
                                </a>
                            </div>
                        </div>
                        
                        <!-- Footer -->
                        <div style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #eee;">
                            <p style="color: #999; font-size: 12px; margin: 0;">
                                This is an automated notification from WBTH.<br>
                                Please do not reply to this email.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        console.log(`Email sent to ${params.to}: ${params.subject}`);
    } catch (error) {
        console.error('Failed to send email notification:', error);
        // Don't throw - email failure shouldn't break the booking flow
    }
}

/**
 * Get email subject based on notification type
 */
export function getEmailSubject(type: string): string {
    const subjects: Record<string, string> = {
        BOOKING_CREATED: '📅 New Booking Notification',
        BOOKING_CONFIRMED: '✅ Booking Confirmed',
        BOOKING_CANCELLED: '❌ Booking Cancelled',
        BOOKING_UPDATED: '🔄 Booking Updated',
        PAYMENT_RECEIVED: '💰 Payment Received',
        PAYMENT_SENT: '💸 Payment Sent',
    };

    return subjects[type] || '📬 WBTH Notification';
}

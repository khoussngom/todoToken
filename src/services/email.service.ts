import nodemailer from 'nodemailer';
import { Notification } from '../interfaces/INotification';

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransporter({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendNotificationEmail(email: string, notification: Notification): Promise<void> {
        try {
            const mailOptions = {
                from: process.env.SMTP_FROM || 'noreply@todoapp.com',
                to: email,
                subject: notification.title,
                html: this.generateEmailTemplate(notification)
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`Email envoyé à ${email} pour la notification ${notification.id}`);
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
        }
    }

    private generateEmailTemplate(notification: Notification): string {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">${notification.title}</h2>
                <p style="color: #666; font-size: 16px;">${notification.message}</p>
                <div style="margin-top: 20px; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">
                    <small style="color: #888;">Reçu le ${notification.createdAt.toLocaleString()}</small>
                </div>
            </div>
        `;
    }
}
import nodemailer from 'nodemailer';
import { env } from '../config/env';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT ?? 587,
      secure: (env.SMTP_PORT ?? 587) === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: env.SMTP_FROM ?? env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
    } catch (error) {
      console.error('Email send error:', error);
      throw error;
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch {
      return false;
    }
  }
}

export const emailService = new EmailService();

export function generateWelcomeEmail(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Welcome to RoboSemi</title></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
        <h1 style="color: white; margin: 0;">Welcome to RoboSemi!</h1>
      </div>
      <div style="background: #f9f9f9; padding: 30px; border-radius: 10px;">
        <h2 style="color: #333;">Hello, ${name}!</h2>
        <p style="color: #666; line-height: 1.6;">
          Thank you for joining RoboSemi — your premier destination for robotics and electronics components.
        </p>
        <p style="color: #666; line-height: 1.6;">
          Explore our wide range of products, training programs, and project guides to kickstart your robotics journey.
        </p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="${env.FRONTEND_URL}" style="background: #667eea; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; font-weight: bold;">
            Start Exploring
          </a>
        </div>
      </div>
      <p style="color: #999; text-align: center; margin-top: 20px; font-size: 12px;">
        © ${new Date().getFullYear()} RoboSemi. All rights reserved.
      </p>
    </body>
    </html>
  `;
}

export function generateLoginSuccessEmail(name: string, loginTime: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Login Notification</title></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #f9f9f9; padding: 30px; border-radius: 10px;">
        <h2 style="color: #333;">Login Notification</h2>
        <p style="color: #666;">Hello ${name},</p>
        <p style="color: #666;">A new login was detected on your account at ${loginTime}.</p>
        <p style="color: #666;">If this was not you, please contact support immediately.</p>
      </div>
    </body>
    </html>
  `;
}

export function generateOrderConfirmationEmail(order: any): string {
  const itemsHtml = order.items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(2)}</td>
    </tr>
  `,
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Order Confirmation</title></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
        <h1 style="color: white; margin: 0;">Order Confirmed!</h1>
      </div>
      <div style="background: #f9f9f9; padding: 30px; border-radius: 10px;">
        <p style="color: #666;">Order Number: <strong>${order.orderNumber}</strong></p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background: #667eea; color: white;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <div style="text-align: right; margin-top: 20px; border-top: 2px solid #667eea; padding-top: 10px;">
          <p style="font-size: 18px; font-weight: bold; color: #333;">Total: ₹${order.total.toFixed(2)}</p>
        </div>
      </div>
      <p style="color: #999; text-align: center; margin-top: 20px; font-size: 12px;">
        © ${new Date().getFullYear()} RoboSemi. All rights reserved.
      </p>
    </body>
    </html>
  `;
}

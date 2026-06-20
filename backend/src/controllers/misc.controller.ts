import { Request, Response } from 'express';
import { newsletterRepository } from '../repositories/newsletter.repository';
import { leadRepository } from '../repositories/lead.repository';
import { sellerRepository } from '../repositories/seller.repository';
import { slideRepository } from '../repositories/slide.repository';
import { analyticsService } from '../services/analytics.service';
import { calculateShippingRates, calculateCartWeight } from '../services/shipping.service';
import { successResponse, errorResponse } from '../helpers/response';
import { emailService } from '../services/email.service';

export async function subscribeNewsletter(req: Request, res: Response): Promise<void> {
  try {
    const { email, name, interests } = req.body;

    const existing = await newsletterRepository.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.status === 'unsubscribed') {
        await newsletterRepository.updateById((existing as any)._id.toString(), {
          status: 'active',
          unsubscribedAt: undefined,
        });
        successResponse(res, null, 'Resubscribed successfully');
      } else {
        successResponse(res, null, 'Already subscribed');
      }
      return;
    }

    await newsletterRepository.create({
      email,
      name,
      interests: interests ?? [],
      source: 'website',
    });

    successResponse(res, null, 'Subscribed successfully', 201);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function createContact(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, phone, message, company } = req.body;

    const lead = await leadRepository.create({
      name,
      email,
      phone,
      company,
      source: 'website',
      notes: message ?? '',
      interests: ['contact_form'],
    });

    successResponse(res, lead, 'Message sent successfully', 201);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function createLead(req: Request, res: Response): Promise<void> {
  try {
    const lead = await leadRepository.create({
      ...req.body,
      source: req.body.source ?? 'website',
    });

    successResponse(res, lead, 'Lead created', 201);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function createCareerInquiry(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, phone, message, position } = req.body;

    const lead = await leadRepository.create({
      name,
      email,
      phone,
      source: 'website',
      notes: message ?? '',
      interests: ['career', position].filter(Boolean),
      customFields: { type: 'career', position },
    });

    successResponse(res, lead, 'Career inquiry submitted', 201);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function createTechSupport(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, phone, issue, orderId } = req.body;

    const lead = await leadRepository.create({
      name,
      email,
      phone,
      source: 'website',
      notes: issue ?? '',
      interests: ['technical_support'],
      customFields: { type: 'tech_support', orderId },
    });

    successResponse(res, lead, 'Support request submitted', 201);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function createBulkOrderInquiry(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, phone, company, products, quantity, message } = req.body;

    const lead = await leadRepository.create({
      name,
      email,
      phone,
      company,
      source: 'website',
      notes: message ?? '',
      interests: ['bulk_order'],
      customFields: { type: 'bulk_order', products, quantity },
    });

    successResponse(res, lead, 'Bulk order inquiry submitted', 201);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function getHeroSlides(req: Request, res: Response): Promise<void> {
  try {
    const slides = await slideRepository.findActive();
    successResponse(res, slides);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function trackAnalytics(req: Request, res: Response): Promise<void> {
  try {
    const userAgent = req.headers['user-agent'] ?? '';
    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
      req.socket.remoteAddress ??
      '';

    await analyticsService.trackEvent({
      ...req.body,
      userAgent,
      ipAddress,
      userId: req.user?.userId,
    });

    successResponse(res, null, 'Event tracked');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function calculateShipping(req: Request, res: Response): Promise<void> {
  try {
    const { cartTotal = 0, items = [], pincode } = req.query;

    const parsedItems = typeof items === 'string' ? JSON.parse(items) : [];
    const weight = calculateCartWeight(parsedItems);
    const rates = calculateShippingRates(Number(cartTotal), weight, pincode as string);

    successResponse(res, { rates, weight });
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function registerAsSeller(req: Request, res: Response): Promise<void> {
  try {
    const existing = await sellerRepository.findByUserId(req.user!.userId);
    if (existing) {
      errorResponse(res, 'Seller application already exists', 409);
      return;
    }

    const seller = await sellerRepository.create({
      ...req.body,
      userId: req.user!.userId as any,
    });

    successResponse(res, seller, 'Seller application submitted', 201);
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 400);
  }
}

export async function sendInvoiceEmail(req: Request, res: Response): Promise<void> {
  try {
    const { to, subject, body, invoiceHtml } = req.body;

    if (!to || !subject) {
      errorResponse(res, '"to" and "subject" are required', 400);
      return;
    }

    const htmlContent = invoiceHtml
      ? `
        <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;padding:20px">
          <div style="background:linear-gradient(135deg,#1e3a5f,#2563eb);padding:24px 32px;border-radius:10px 10px 0 0;text-align:center">
            <h1 style="color:#fff;margin:0;font-size:24px;letter-spacing:1px">RoboSemi</h1>
            <p style="color:#93c5fd;margin:6px 0 0;font-size:13px">Invoice Enclosed</p>
          </div>
          <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 10px 10px;padding:28px 32px;background:#fff">
            <p style="color:#334155;font-size:14px;white-space:pre-line;margin:0 0 24px">${body ?? ''}</p>
            <div style="border-top:1px solid #e2e8f0;padding-top:24px;margin-top:8px">
              ${invoiceHtml}
            </div>
          </div>
          <p style="text-align:center;color:#94a3b8;font-size:12px;margin-top:20px">
            © ${new Date().getFullYear()} RoboSemi · reach@robosemi.in
          </p>
        </div>`
      : `<div style="font-family:Arial,sans-serif;white-space:pre-line;padding:20px">${body ?? ''}</div>`;

    await emailService.sendEmail({
      to,
      subject,
      html: htmlContent,
      text: body ?? '',
    });

    successResponse(res, null, 'Invoice email sent successfully');
  } catch (err: any) {
    errorResponse(res, err.message || 'Failed to send email', 500);
  }
}

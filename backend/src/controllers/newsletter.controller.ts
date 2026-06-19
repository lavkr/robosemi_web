import { Request, Response } from 'express';
import { newsletterRepository } from '../repositories/newsletter.repository';
import { leadRepository } from '../repositories/lead.repository';
import { successResponse, errorResponse, paginatedResponse } from '../helpers/response';

export async function subscribe(req: Request, res: Response): Promise<void> {
  try {
    const { email, name } = req.body;
    if (!email) {
      errorResponse(res, 'Email is required', 400);
      return;
    }

    const existing = await newsletterRepository.findOne({ email });
    if (existing) {
      if ((existing as any).isActive) {
        errorResponse(res, 'Email is already subscribed', 400);
        return;
      }
      await newsletterRepository.updateById((existing as any)._id, { isActive: true });
    } else {
      await newsletterRepository.create({ email, name });
    }

    successResponse(res, null, 'Successfully subscribed');
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}

export async function unsubscribe(req: Request, res: Response): Promise<void> {
  try {
    const { email } = req.body;
    const sub = await newsletterRepository.findOne({ email });
    if (sub) await newsletterRepository.updateById((sub as any)._id, { isActive: false });
    successResponse(res, null, 'Unsubscribed');
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}

export async function getSubscribers(req: Request, res: Response): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const [subscribers, total] = await Promise.all([
      newsletterRepository.findMany({ isActive: true }, { skip, limit }),
      newsletterRepository.count({ isActive: true }),
    ]);

    paginatedResponse(res, subscribers, total, page, limit);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function createLead(req: Request, res: Response): Promise<void> {
  try {
    const lead = await leadRepository.create(req.body);
    successResponse(res, lead, 'Lead captured', 201);
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}

export async function getLeads(req: Request, res: Response): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      leadRepository.findMany({}, { skip, limit, sort: { createdAt: -1 } }),
      leadRepository.count({}),
    ]);

    paginatedResponse(res, leads, total, page, limit);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

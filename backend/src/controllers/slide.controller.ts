import { Request, Response } from 'express';
import { slideRepository } from '../repositories/slide.repository';
import { successResponse, errorResponse } from '../helpers/response';

export async function getSlides(req: Request, res: Response): Promise<void> {
  try {
    const slides = await slideRepository.findMany({ isActive: true }, { sort: { order: 1 } });
    successResponse(res, slides);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function getAllSlides(req: Request, res: Response): Promise<void> {
  try {
    const slides = await slideRepository.findMany({}, { sort: { order: 1 } });
    successResponse(res, slides);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function createSlide(req: Request, res: Response): Promise<void> {
  try {
    const slide = await slideRepository.create(req.body);
    successResponse(res, slide, 'Slide created', 201);
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}

export async function updateSlide(req: Request, res: Response): Promise<void> {
  try {
    const slide = await slideRepository.updateById(req.params.id, req.body);
    successResponse(res, slide, 'Slide updated');
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}

export async function deleteSlide(req: Request, res: Response): Promise<void> {
  try {
    await slideRepository.deleteById(req.params.id);
    successResponse(res, null, 'Slide deleted');
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}

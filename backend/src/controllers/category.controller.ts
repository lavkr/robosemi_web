import { Request, Response } from 'express';
import { categoryRepository } from '../repositories/category.repository';
import { successResponse, errorResponse } from '../helpers/response';

export async function getCategories(req: Request, res: Response): Promise<void> {
  try {
    const categories = await categoryRepository.findMany({ isActive: true });
    successResponse(res, categories);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

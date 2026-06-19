import { Request, Response } from 'express';
import { productRepository } from '../repositories/product.repository';
import { blogRepository } from '../repositories/blog.repository';
import { trainingRepository } from '../repositories/training.repository';
import { projectRepository } from '../repositories/project.repository';
import { successResponse, errorResponse } from '../helpers/response';

export async function search(req: Request, res: Response): Promise<void> {
  try {
    const { q, type, limit = '10' } = req.query;

    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      errorResponse(res, 'Search query is required', 400);
      return;
    }

    const maxLimit = Math.min(Number(limit), 50);
    const regex = { $regex: q, $options: 'i' };

    const results: Record<string, any[]> = {};

    if (!type || type === 'products') {
      results.products = await productRepository.findMany(
        {
          isActive: true,
          $or: [{ name: regex }, { description: regex }, { brand: regex }, { tags: regex }],
        },
        { limit: maxLimit },
      );
    }

    if (!type || type === 'blogs') {
      results.blogs = await blogRepository.findMany(
        {
          status: 'published',
          $or: [{ title: regex }, { excerpt: regex }, { tags: regex }],
        },
        { limit: maxLimit },
      );
    }

    if (!type || type === 'trainings') {
      results.trainings = await trainingRepository.findMany(
        {
          isActive: true,
          $or: [{ title: regex }, { description: regex }, { tags: regex }],
        },
        { limit: maxLimit },
      );
    }

    if (!type || type === 'projects') {
      results.projects = await projectRepository.findMany(
        {
          isActive: true,
          $or: [{ title: regex }, { description: regex }, { tags: regex }],
        },
        { limit: maxLimit },
      );
    }

    successResponse(res, results);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

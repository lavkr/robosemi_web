import { Request, Response } from 'express';
import { blogRepository } from '../repositories/blog.repository';
import { successResponse, errorResponse, paginatedResponse } from '../helpers/response';

export async function getBlogs(req: Request, res: Response): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;
    const filter: any = { status: 'published' };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.tag) filter.tags = req.query.tag;

    const [blogs, total] = await Promise.all([
      blogRepository.findPublished({ skip, limit }),
      blogRepository.count(filter),
    ]);

    paginatedResponse(res, blogs, total, page, limit);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function getBlogById(req: Request, res: Response): Promise<void> {
  try {
    const blog = await blogRepository.findById(req.params.id);
    if (!blog || blog.status !== 'published') {
      errorResponse(res, 'Blog not found', 404);
      return;
    }
    await blogRepository.updateById(req.params.id, { $inc: { views: 1 } });
    successResponse(res, blog);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function getBlogBySlug(req: Request, res: Response): Promise<void> {
  try {
    const blog = await blogRepository.findBySlug(req.params.slug);
    if (!blog || blog.status !== 'published') {
      errorResponse(res, 'Blog not found', 404);
      return;
    }
    await blogRepository.updateById((blog as any)._id.toString(), { $inc: { views: 1 } });
    successResponse(res, blog);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function getAllBlogsAdmin(req: Request, res: Response): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      blogRepository.findMany({}, { skip, limit, sort: { createdAt: -1 } }),
      blogRepository.count({}),
    ]);

    paginatedResponse(res, blogs, total, page, limit);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function createBlog(req: Request, res: Response): Promise<void> {
  try {
    const blog = await blogRepository.create({ ...req.body, author: req.user!.userId });
    successResponse(res, blog, 'Blog created', 201);
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}

export async function updateBlog(req: Request, res: Response): Promise<void> {
  try {
    const blog = await blogRepository.updateById(req.params.id, req.body);
    successResponse(res, blog, 'Blog updated');
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}

export async function deleteBlog(req: Request, res: Response): Promise<void> {
  try {
    await blogRepository.deleteById(req.params.id);
    successResponse(res, null, 'Blog deleted');
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}

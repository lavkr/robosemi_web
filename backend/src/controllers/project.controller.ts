import { Request, Response } from 'express';
import { projectRepository } from '../repositories/project.repository';
import { successResponse, errorResponse, paginatedResponse } from '../helpers/response';

export async function getProjects(req: Request, res: Response): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      projectRepository.findMany({ isActive: true }, { skip, limit, sort: { createdAt: -1 } }),
      projectRepository.count({ isActive: true }),
    ]);

    paginatedResponse(res, projects, total, page, limit);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function getProjectById(req: Request, res: Response): Promise<void> {
  try {
    const project = await projectRepository.findById(req.params.id);
    if (!project) {
      errorResponse(res, 'Project not found', 404);
      return;
    }
    successResponse(res, project);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function getProjectBySlug(req: Request, res: Response): Promise<void> {
  try {
    const project = await projectRepository.findOne({ slug: req.params.slug });
    if (!project) {
      errorResponse(res, 'Project not found', 404);
      return;
    }
    successResponse(res, project);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function createProject(req: Request, res: Response): Promise<void> {
  try {
    const project = await projectRepository.create(req.body);
    successResponse(res, project, 'Project created', 201);
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}

export async function updateProject(req: Request, res: Response): Promise<void> {
  try {
    const project = await projectRepository.updateById(req.params.id, req.body);
    successResponse(res, project, 'Project updated');
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}

export async function deleteProject(req: Request, res: Response): Promise<void> {
  try {
    await projectRepository.deleteById(req.params.id);
    successResponse(res, null, 'Project deleted');
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}

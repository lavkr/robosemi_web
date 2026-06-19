import { Request, Response } from 'express';
import { trainingRepository } from '../repositories/training.repository';
import { registrationRepository } from '../repositories/registration.repository';
import { successResponse, errorResponse, paginatedResponse } from '../helpers/response';

export async function getTrainings(req: Request, res: Response): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const [trainings, total] = await Promise.all([
      trainingRepository.findMany({ isActive: true }, { skip, limit, sort: { createdAt: -1 } }),
      trainingRepository.count({ isActive: true }),
    ]);

    paginatedResponse(res, trainings, total, page, limit);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function getTrainingBySlug(req: Request, res: Response): Promise<void> {
  try {
    const training = await trainingRepository.findOne({ slug: req.params.slug });
    if (!training) {
      errorResponse(res, 'Training not found', 404);
      return;
    }
    successResponse(res, training);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function createTraining(req: Request, res: Response): Promise<void> {
  try {
    const training = await trainingRepository.create(req.body);
    successResponse(res, training, 'Training created', 201);
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}

export async function updateTraining(req: Request, res: Response): Promise<void> {
  try {
    const training = await trainingRepository.updateById(req.params.id, req.body);
    successResponse(res, training, 'Training updated');
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}

export async function deleteTraining(req: Request, res: Response): Promise<void> {
  try {
    await trainingRepository.deleteById(req.params.id);
    successResponse(res, null, 'Training deleted');
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}

export async function getTrainingById(req: Request, res: Response): Promise<void> {
  try {
    const training = await trainingRepository.findById(req.params.id);
    if (!training) {
      errorResponse(res, 'Training not found', 404);
      return;
    }
    successResponse(res, training);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function registerForTraining(req: Request, res: Response): Promise<void> {
  try {
    const training = await trainingRepository.findById(req.params.id);
    if (!training || !training.isActive) {
      errorResponse(res, 'Training not found or unavailable', 404);
      return;
    }

    if (training.currentParticipants >= training.maxParticipants) {
      errorResponse(res, 'Training is fully booked', 400, 'TRAINING_FULL');
      return;
    }

    const existing = await registrationRepository.findOne({
      trainingId: req.params.id,
      userEmail: req.body.userEmail ?? req.user!.email,
    });

    if (existing) {
      errorResponse(res, 'Already registered for this training', 409, 'ALREADY_REGISTERED');
      return;
    }

    const registration = await registrationRepository.create({
      ...req.body,
      trainingId: req.params.id,
      amount: training.price,
    });

    await trainingRepository.incrementParticipants(req.params.id);

    successResponse(res, registration, 'Registration submitted', 201);
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 400);
  }
}

export async function getTrainingStats(req: Request, res: Response): Promise<void> {
  try {
    const [total, active] = await Promise.all([
      trainingRepository.count({}),
      trainingRepository.count({ isActive: true }),
    ]);

    successResponse(res, { total, active });
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

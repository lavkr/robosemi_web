import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authService } from '../services/auth.service';
import { successResponse, errorResponse } from '../helpers/response';
import { env } from '../config/env';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body;
    const user = await authService.register(name, email, password);

    const token = jwt.sign(
      { sub: (user as any)._id.toString(), email: user.email, role: user.role, name: user.name },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any },
    );

    successResponse(res, { user, token }, 'Registration successful', 201);
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 400);
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const user = await authService.validateCredentials(email, password);

    if (!user) {
      errorResponse(res, 'Invalid email or password', 401, 'INVALID_CREDENTIALS');
      return;
    }

    const token = jwt.sign(
      { sub: (user as any)._id.toString(), email: user.email, role: user.role, name: user.name },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any },
    );

    successResponse(res, { user, token }, 'Login successful');
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 500);
  }
}

export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    successResponse(res, req.user, 'User profile retrieved');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function oauthLogin(req: Request, res: Response): Promise<void> {
  try {
    const { provider, email, name, image } = req.body;

    if (!provider || !email || !name) {
      errorResponse(res, 'provider, email and name are required', 400);
      return;
    }

    const user = await authService.oauthLogin({ provider, email, name, image });

    const token = jwt.sign(
      { sub: (user as any)._id.toString(), email: user.email, role: user.role, name: user.name },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any },
    );

    successResponse(res, { user, token }, 'OAuth login successful');
  } catch (err: any) {
    errorResponse(res, err.message, err.statusCode ?? 500);
  }
}

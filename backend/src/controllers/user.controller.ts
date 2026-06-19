import { Request, Response } from 'express';
import { userRepository } from '../repositories/user.repository';
import { orderRepository } from '../repositories/order.repository';
import { cloudinaryService } from '../services/cloudinary.service';
import { successResponse, errorResponse } from '../helpers/response';

export async function getProfile(req: Request, res: Response): Promise<void> {
  try {
    const user = await userRepository.findById(req.user!.userId);
    if (!user) {
      errorResponse(res, 'User not found', 404);
      return;
    }
    successResponse(res, user);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  try {
    const allowedFields = ['name', 'phone'];
    const updates: Record<string, any> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const user = await userRepository.updateById(req.user!.userId, updates);
    successResponse(res, user, 'Profile updated');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function updatePassword(req: Request, res: Response): Promise<void> {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await userRepository.findById(req.user!.userId);
    if (!user) {
      errorResponse(res, 'User not found', 404);
      return;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      errorResponse(res, 'Current password is incorrect', 400, 'WRONG_PASSWORD');
      return;
    }

    user.password = newPassword;
    await user.save();

    successResponse(res, null, 'Password updated');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function getAddresses(req: Request, res: Response): Promise<void> {
  try {
    const user = await userRepository.findById(req.user!.userId);
    successResponse(res, user?.addresses ?? []);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function addAddress(req: Request, res: Response): Promise<void> {
  try {
    const user = await userRepository.updateById(req.user!.userId, {
      $push: { addresses: req.body },
    });
    successResponse(res, user?.addresses, 'Address added', 201);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function updateAvatar(req: Request, res: Response): Promise<void> {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      errorResponse(res, 'Image data is required', 400);
      return;
    }

    const result = await cloudinaryService.uploadImage(imageBase64, 'robosemi/avatars');
    const user = await userRepository.updateById(req.user!.userId, {
      avatar: result.url,
    });

    successResponse(res, { avatar: result.url }, 'Avatar updated');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function getNotificationPrefs(req: Request, res: Response): Promise<void> {
  try {
    const user = await userRepository.findById(req.user!.userId);
    successResponse(res, user?.notifications);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function updateNotificationPrefs(req: Request, res: Response): Promise<void> {
  try {
    const { emailOrders, emailPromotions, emailNewsletter, smsOrders } = req.body;
    const updates: Record<string, any> = {};

    if (emailOrders !== undefined) updates['notifications.emailOrders'] = emailOrders;
    if (emailPromotions !== undefined) updates['notifications.emailPromotions'] = emailPromotions;
    if (emailNewsletter !== undefined) updates['notifications.emailNewsletter'] = emailNewsletter;
    if (smsOrders !== undefined) updates['notifications.smsOrders'] = smsOrders;

    const user = await userRepository.updateById(req.user!.userId, updates);
    successResponse(res, user?.notifications, 'Notifications updated');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function getDashboard(req: Request, res: Response): Promise<void> {
  try {
    const [user, totalOrders, recentOrders] = await Promise.all([
      userRepository.findById(req.user!.userId),
      orderRepository.count({ user: req.user!.userId }),
      orderRepository.findMany(
        { user: req.user!.userId },
        { limit: 5, sort: { createdAt: -1 } },
      ),
    ]);

    const stats = {
      totalOrders,
      wishlistCount: user?.wishlist?.length ?? 0,
      cartItems: user?.cart?.length ?? 0,
      addressCount: user?.addresses?.length ?? 0,
      recentOrders,
    };

    successResponse(res, stats);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

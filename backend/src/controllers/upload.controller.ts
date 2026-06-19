import { Request, Response } from 'express';
import { cloudinaryService } from '../services/cloudinary.service';
import { successResponse, errorResponse } from '../helpers/response';

export async function uploadFile(req: Request, res: Response): Promise<void> {
  try {
    const { folder = 'robosemi', imageBase64 } = req.body;

    // If uploaded via multer (req.file) or base64
    if (req.file) {
      const result = await cloudinaryService.uploadBuffer(
        req.file.buffer,
        folder,
      );
      successResponse(res, result, 'File uploaded');
      return;
    }

    if (imageBase64) {
      const result = await cloudinaryService.uploadImage(imageBase64, folder);
      successResponse(res, result, 'File uploaded');
      return;
    }

    errorResponse(res, 'No file provided', 400);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function deleteFile(req: Request, res: Response): Promise<void> {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      errorResponse(res, 'publicId is required', 400);
      return;
    }

    await cloudinaryService.deleteImage(publicId);
    successResponse(res, null, 'File deleted');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

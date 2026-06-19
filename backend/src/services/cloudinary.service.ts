import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

class CloudinaryService {
  async uploadImage(
    file: string,
    folder = 'robosemi',
    options?: Record<string, unknown>,
  ): Promise<UploadResult> {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      ...options,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }

  async uploadBuffer(
    buffer: Buffer,
    folder = 'robosemi',
    options?: Record<string, unknown>,
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, ...options },
        (error, result) => {
          if (error) reject(error);
          else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format,
              bytes: result.bytes,
            });
          }
        },
      );
      uploadStream.end(buffer);
    });
  }

  getTransformUrl(
    publicId: string,
    transformations: Record<string, unknown>,
  ): string {
    return cloudinary.url(publicId, transformations);
  }
}

export const cloudinaryService = new CloudinaryService();

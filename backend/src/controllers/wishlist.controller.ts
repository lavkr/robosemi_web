import { Request, Response } from 'express';
import WishlistModel from '../models/Wishlist.model';
import { successResponse, errorResponse } from '../helpers/response';

export async function getWishlist(req: Request, res: Response): Promise<void> {
  try {
    const wishlist = await WishlistModel.findOne({ user: req.user!.userId }).populate(
      'products',
      'name price images discount rating isActive',
    );
    successResponse(res, wishlist?.products ?? []);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function addToWishlist(req: Request, res: Response): Promise<void> {
  try {
    const { productId } = req.body;
    const wishlist = await WishlistModel.findOneAndUpdate(
      { user: req.user!.userId },
      { $addToSet: { products: productId } },
      { upsert: true, new: true },
    ).populate('products', 'name price images');

    successResponse(res, wishlist.products, 'Added to wishlist');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function removeFromWishlist(req: Request, res: Response): Promise<void> {
  try {
    const { productId } = req.query;

    if (productId) {
      await WishlistModel.findOneAndUpdate(
        { user: req.user!.userId },
        { $pull: { products: productId } },
      );
    } else {
      // Clear wishlist
      await WishlistModel.findOneAndUpdate(
        { user: req.user!.userId },
        { $set: { products: [] } },
      );
    }

    successResponse(res, null, 'Wishlist updated');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function syncWishlist(req: Request, res: Response): Promise<void> {
  try {
    const { productIds } = req.body;
    const wishlist = await WishlistModel.findOneAndUpdate(
      { user: req.user!.userId },
      { $set: { products: productIds } },
      { upsert: true, new: true },
    ).populate('products', 'name price images');

    successResponse(res, wishlist.products, 'Wishlist synced');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

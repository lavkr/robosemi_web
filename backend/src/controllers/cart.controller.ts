import { Request, Response } from 'express';
import { userRepository } from '../repositories/user.repository';
import { productRepository } from '../repositories/product.repository';
import { successResponse, errorResponse } from '../helpers/response';

export async function getCart(req: Request, res: Response): Promise<void> {
  try {
    const user = await userRepository.findById(req.user!.userId);
    if (!user) {
      errorResponse(res, 'User not found', 404);
      return;
    }

    // Populate cart products
    const UserModel = user.constructor as any;
    const populated = await UserModel.findById(req.user!.userId)
      .populate('cart.product', 'name price images stock isActive discount');

    successResponse(res, populated?.cart ?? []);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function addToCart(req: Request, res: Response): Promise<void> {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await productRepository.findById(productId);
    if (!product || !product.isActive) {
      errorResponse(res, 'Product not found or unavailable', 404);
      return;
    }

    const user = await userRepository.findById(req.user!.userId);
    if (!user) {
      errorResponse(res, 'User not found', 404);
      return;
    }

    const existingIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (existingIndex >= 0) {
      const newQty = user.cart[existingIndex].quantity + quantity;
      await userRepository.updateById(req.user!.userId, {
        $set: { [`cart.${existingIndex}.quantity`]: newQty },
      });
    } else {
      await userRepository.updateById(req.user!.userId, {
        $push: { cart: { product: productId, quantity, addedAt: new Date() } },
      });
    }

    const updated = await userRepository.findById(req.user!.userId);
    successResponse(res, updated?.cart, 'Added to cart');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function updateCart(req: Request, res: Response): Promise<void> {
  try {
    const { productId, quantity } = req.body;

    if (quantity <= 0) {
      // Remove item
      await userRepository.updateById(req.user!.userId, {
        $pull: { cart: { product: productId } },
      });
    } else {
      const user = await userRepository.findById(req.user!.userId);
      const index = user?.cart.findIndex((i) => i.product.toString() === productId) ?? -1;
      if (index >= 0) {
        await userRepository.updateById(req.user!.userId, {
          $set: { [`cart.${index}.quantity`]: quantity },
        });
      }
    }

    const updated = await userRepository.findById(req.user!.userId);
    successResponse(res, updated?.cart, 'Cart updated');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function removeFromCart(req: Request, res: Response): Promise<void> {
  try {
    const { productId } = req.query;

    if (productId) {
      await userRepository.updateById(req.user!.userId, {
        $pull: { cart: { product: productId } },
      });
    } else {
      // Clear cart
      await userRepository.updateById(req.user!.userId, { $set: { cart: [] } });
    }

    successResponse(res, null, 'Cart updated');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

export async function syncCart(req: Request, res: Response): Promise<void> {
  try {
    const { items } = req.body; // Array of {productId, quantity}
    const cartItems = items.map((item: any) => ({
      product: item.productId,
      quantity: item.quantity,
      addedAt: new Date(),
    }));

    await userRepository.updateById(req.user!.userId, { $set: { cart: cartItems } });
    const updated = await userRepository.findById(req.user!.userId);
    successResponse(res, updated?.cart, 'Cart synced');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
}

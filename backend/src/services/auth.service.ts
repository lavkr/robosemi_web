import { userRepository } from '../repositories/user.repository';
import { emailService, generateWelcomeEmail } from './email.service';
import { IUser } from '../models/User.model';

class AuthService {
  async register(name: string, email: string, password: string): Promise<IUser> {
    const existing = await userRepository.findOne({ email: email.toLowerCase() });
    if (existing) {
      const err: any = new Error('Email already in use');
      err.statusCode = 409;
      throw err;
    }

    const user = await userRepository.create({ name, email: email.toLowerCase(), password });

    // Fire-and-forget welcome email
    emailService
      .sendEmail({
        to: email,
        subject: 'Welcome to RoboSemi!',
        html: generateWelcomeEmail(name),
      })
      .catch((err) => console.error('Welcome email failed:', err));

    return user;
  }

  async validateCredentials(email: string, password: string): Promise<IUser | null> {
    const user = await userRepository.findOne({ email: email.toLowerCase(), isActive: true });
    if (!user) return null;

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return null;

    return user;
  }

  async oauthLogin(data: { provider: string; email: string; name: string; image?: string }): Promise<IUser> {
    let user = await userRepository.findOne({ email: data.email.toLowerCase() });

    if (!user) {
      user = await userRepository.create({
        name: data.name,
        email: data.email.toLowerCase(),
        avatar: data.image,
        oauthProvider: data.provider,
        emailVerified: true,
        isActive: true,
      } as any);
    } else if (!user.oauthProvider) {
      // existing email/password account — just mark provider
      await userRepository.updateById((user as any)._id.toString(), { oauthProvider: data.provider });
    }

    return user;
  }
}

export const authService = new AuthService();

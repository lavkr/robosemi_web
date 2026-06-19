export type UserRole = 'user' | 'admin' | 'staff' | 'seller';

export interface Address {
  _id?: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface NotificationPreferences {
  emailOrders: boolean;
  emailPromotions: boolean;
  emailNewsletter: boolean;
  smsOrders: boolean;
}

export interface UserDto {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  notifications?: NotificationPreferences;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfileDto {
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

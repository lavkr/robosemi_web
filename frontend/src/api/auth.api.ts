import { apiGet, apiPost } from './client';

export const authApi = {
  register: (data: any) => apiPost('/auth/register', data),
  me: () => apiGet('/auth/me'),
};

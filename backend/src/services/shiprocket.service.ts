import axios, { AxiosInstance } from 'axios';
import { env } from '../config/env';

interface ShiprocketToken {
  token: string;
  expiresAt: number;
}

interface CreateOrderPayload {
  order_id: string;
  order_date: string;
  pickup_location: string;
  billing_customer_name: string;
  billing_last_name?: string;
  billing_address: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_is_billing: boolean;
  order_items: Array<{
    name: string;
    sku: string;
    units: number;
    selling_price: number;
    discount?: number;
    tax?: number;
  }>;
  payment_method: string;
  sub_total: number;
  length: number;
  breadth: number;
  height: number;
  weight: number;
}

class ShiprocketService {
  private client: AxiosInstance;
  private tokenCache: ShiprocketToken | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: env.SHIPROCKET_BASE_URL,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  private async getToken(): Promise<string> {
    if (this.tokenCache && Date.now() < this.tokenCache.expiresAt) {
      return this.tokenCache.token;
    }

    const response = await this.client.post('/auth/login', {
      email: env.SHIPROCKET_EMAIL,
      password: env.SHIPROCKET_PASSWORD,
    });

    const token = response.data.token;
    // Token expires in 24 hours; cache for 23 hours
    this.tokenCache = {
      token,
      expiresAt: Date.now() + 23 * 60 * 60 * 1000,
    };

    return token;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.getToken();
    return { Authorization: `Bearer ${token}` };
  }

  async createOrder(payload: CreateOrderPayload): Promise<any> {
    const headers = await this.getAuthHeaders();
    const response = await this.client.post('/orders/create/adhoc', payload, { headers });
    return response.data;
  }

  async generateAWB(shipmentId: number, courierCompanyId: number): Promise<any> {
    const headers = await this.getAuthHeaders();
    const response = await this.client.post(
      '/courier/assign/awb',
      { shipment_id: shipmentId, courier_id: courierCompanyId },
      { headers },
    );
    return response.data;
  }

  async generatePickup(shipmentIds: number[]): Promise<any> {
    const headers = await this.getAuthHeaders();
    const response = await this.client.post(
      '/courier/generate/pickup',
      { shipment_id: shipmentIds },
      { headers },
    );
    return response.data;
  }

  async trackOrder(orderId: string): Promise<any> {
    const headers = await this.getAuthHeaders();
    const response = await this.client.get(`/courier/track/awb/${orderId}`, { headers });
    return response.data;
  }

  async cancelOrder(orderIds: number[]): Promise<any> {
    const headers = await this.getAuthHeaders();
    const response = await this.client.post(
      '/orders/cancel',
      { ids: orderIds },
      { headers },
    );
    return response.data;
  }

  async getServiceability(
    pickupPincode: string,
    deliveryPincode: string,
    weight: number,
    cod: boolean,
  ): Promise<any> {
    const headers = await this.getAuthHeaders();
    const response = await this.client.get('/courier/serviceability/', {
      headers,
      params: {
        pickup_postcode: pickupPincode,
        delivery_postcode: deliveryPincode,
        weight,
        cod: cod ? 1 : 0,
      },
    });
    return response.data;
  }
}

export const shiprocketService = new ShiprocketService();

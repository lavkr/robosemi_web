export const config = {
  shiprocket: {
    enabled: !!(process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD),
    email: process.env.SHIPROCKET_EMAIL || '',
    password: process.env.SHIPROCKET_PASSWORD || '',
    baseUrl: process.env.SHIPROCKET_BASE_URL || 'https://apiv2.shiprocket.in/v1/external'
  },
  shipping: {
    defaultPickupPincode: process.env.DEFAULT_PICKUP_PINCODE || '400001',
    freeShippingThreshold: 500,
    defaultWeight: 0.5
  }
};

export const isShiprocketEnabled = () => config.shiprocket.enabled;
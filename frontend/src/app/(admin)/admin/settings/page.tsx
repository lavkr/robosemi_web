'use client';

import { apiUrl } from '@/utils/api-url';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'RoboSemi',
    storeDescription: 'Your trusted electronics partner',
    storeEmail: 'info@robosemi.in',
    storePhone: '+91 9876543210',
    currency: 'INR',
    taxRate: 18,
    shippingFee: 50,
    freeShippingThreshold: 500,
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    enableEmailNotifications: true,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    razorpayKeyId: '',
    razorpayKeySecret: '',
    enableCOD: true,
    enableRazorpay: true,
  });

  const handleStoreSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(apiUrl('/admin/settings/store'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeSettings),
      });
      if (response.ok) {
        toast.success('Store settings updated');
      }
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(apiUrl('/admin/settings/email'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailSettings),
      });
      if (response.ok) {
        toast.success('Email settings updated');
      }
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(apiUrl('/admin/settings/payment'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentSettings),
      });
      if (response.ok) {
        toast.success('Payment settings updated');
      }
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">Configure your store settings</p>
      </div>

      {/* Store Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleStoreSettingsUpdate} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={storeSettings.storeName}
                  onChange={(e) =>
                    setStoreSettings({ ...storeSettings, storeName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={storeSettings.currency}
                  onChange={(e) =>
                    setStoreSettings({ ...storeSettings, currency: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="storeDescription">Store Description</Label>
              <Textarea
                id="storeDescription"
                value={storeSettings.storeDescription}
                onChange={(e) =>
                  setStoreSettings({ ...storeSettings, storeDescription: e.target.value })
                }
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="storeEmail">Store Email</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={storeSettings.storeEmail}
                  onChange={(e) =>
                    setStoreSettings({ ...storeSettings, storeEmail: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="storePhone">Store Phone</Label>
                <Input
                  id="storePhone"
                  value={storeSettings.storePhone}
                  onChange={(e) =>
                    setStoreSettings({ ...storeSettings, storePhone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={storeSettings.taxRate}
                  onChange={(e) =>
                    setStoreSettings({ ...storeSettings, taxRate: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label htmlFor="shippingFee">Shipping Fee (₹)</Label>
                <Input
                  id="shippingFee"
                  type="number"
                  value={storeSettings.shippingFee}
                  onChange={(e) =>
                    setStoreSettings({ ...storeSettings, shippingFee: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label htmlFor="freeShippingThreshold">Free Shipping Above (₹)</Label>
                <Input
                  id="freeShippingThreshold"
                  type="number"
                  value={storeSettings.freeShippingThreshold}
                  onChange={(e) =>
                    setStoreSettings({ ...storeSettings, freeShippingThreshold: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Store Settings'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePaymentSettingsUpdate} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="razorpayKeyId">Razorpay Key ID</Label>
                <Input
                  id="razorpayKeyId"
                  value={paymentSettings.razorpayKeyId}
                  onChange={(e) =>
                    setPaymentSettings({ ...paymentSettings, razorpayKeyId: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="razorpayKeySecret">Razorpay Key Secret</Label>
                <Input
                  id="razorpayKeySecret"
                  type="password"
                  value={paymentSettings.razorpayKeySecret}
                  onChange={(e) =>
                    setPaymentSettings({ ...paymentSettings, razorpayKeySecret: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Razorpay</p>
                  <p className="text-sm text-muted-foreground">Accept online payments</p>
                </div>
                <Switch
                  checked={paymentSettings.enableRazorpay}
                  onCheckedChange={(checked) =>
                    setPaymentSettings({ ...paymentSettings, enableRazorpay: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Cash on Delivery</p>
                  <p className="text-sm text-muted-foreground">Accept COD orders</p>
                </div>
                <Switch
                  checked={paymentSettings.enableCOD}
                  onCheckedChange={(checked) =>
                    setPaymentSettings({ ...paymentSettings, enableCOD: checked })
                  }
                />
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Payment Settings'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
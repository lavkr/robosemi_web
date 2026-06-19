'use client';

import { apiUrl } from '@/utils/api-url';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Calendar, Edit, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

export default function SellerCoupons() {
  const { data: session } = useSession();
  const user = session?.user;
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    minOrderValue: '',
    maxDiscount: '',
    usageLimit: '',
    validFrom: '',
    validUntil: ''
  });

  useEffect(() => {
    if (user?.id) {
      fetchCoupons();
    }
  }, [user]);

  const fetchCoupons = async () => {
    try {
      const response = await fetch(apiUrl('/seller/coupons'));
      if (response.ok) {
        const data = await response.json();
        setCoupons(data.data || data.coupons || []);
      }
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const couponData = {
      ...formData,
      value: parseFloat(formData.value),
      minOrderValue: parseFloat(formData.minOrderValue),
      maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : undefined,
      usageLimit: parseInt(formData.usageLimit),

    };

    try {
      const url = editingCoupon ? `/api/seller/coupons/${editingCoupon.id}` : '/api/seller/coupons';
      const method = editingCoupon ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(couponData)
      });

      if (response.ok) {
        await fetchCoupons();
        setIsDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save coupon:', error);
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value.toString(),
      minOrderValue: coupon.minOrderValue.toString(),
      maxDiscount: coupon.maxDiscount?.toString() || '',
      usageLimit: coupon.usageLimit.toString(),
      validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
      validUntil: new Date(coupon.validUntil).toISOString().split('T')[0]
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (couponId: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/seller/coupons/${couponId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchCoupons();
      }
    } catch (error) {
      console.error('Failed to delete coupon:', error);
    }
  };

  const resetForm = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      minOrderValue: '',
      maxDiscount: '',
      usageLimit: '',
      validFrom: '',
      validUntil: ''
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Coupons</h1>
          <p className="text-muted-foreground">Create and manage discount coupons</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Coupon Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="SAVE20"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Discount Type</Label>
                  <Select value={formData.type} onValueChange={(value: 'percentage' | 'fixed') => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="value">
                    {formData.type === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'}
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="minOrderValue">Min Order Value (₹)</Label>
                  <Input
                    id="minOrderValue"
                    type="number"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, minOrderValue: e.target.value }))}
                    required
                  />
                </div>
              </div>
              {formData.type === 'percentage' && (
                <div>
                  <Label htmlFor="maxDiscount">Max Discount (₹)</Label>
                  <Input
                    id="maxDiscount"
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxDiscount: e.target.value }))}
                  />
                </div>
              )}
              <div>
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="validFrom">Valid From</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {coupons.map((coupon) => (
          <Card key={coupon.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{coupon.code}</h3>
                    <Badge variant={coupon.isActive ? "default" : "secondary"}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong>Discount:</strong> {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                    </div>
                    <div>
                      <strong>Min Order:</strong> ₹{coupon.minOrderValue}
                    </div>
                    <div>
                      <strong>Usage:</strong> {coupon.usedCount}/{coupon.usageLimit}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(coupon.validFrom).toLocaleDateString()} - {new Date(coupon.validUntil).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(coupon)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(coupon.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {coupons.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No coupons created yet. Create your first coupon to offer discounts.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
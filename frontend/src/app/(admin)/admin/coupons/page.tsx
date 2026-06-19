'use client';

import { apiUrl } from '@/utils/api-url';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Percent } from 'lucide-react';
import { toast } from 'sonner';

interface Coupon {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    minOrderValue: 0,
    maxDiscount: 0,
    usageLimit: 100,
    expiresAt: '',
    isActive: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch(apiUrl('/admin/coupons'));
      if (response.ok) {
        const data = await response.json();
        setCoupons(data.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingCoupon ? 'PUT' : 'POST';
      const url = editingCoupon 
        ? `/api/admin/coupons/${editingCoupon._id}` 
        : '/api/admin/coupons';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchCoupons();
        setShowForm(false);
        setEditingCoupon(null);
        setFormData({
          code: '',
          type: 'percentage',
          value: 0,
          minOrderValue: 0,
          maxDiscount: 0,
          usageLimit: 100,
          expiresAt: '',
          isActive: true,
        });
        toast.success(editingCoupon ? 'Coupon updated' : 'Coupon created');
      }
    } catch (error) {
      toast.error('Failed to save coupon');
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrderValue: coupon.minOrderValue,
      maxDiscount: coupon.maxDiscount || 0,
      usageLimit: coupon.usageLimit,
      expiresAt: coupon.expiresAt.split('T')[0],
      isActive: coupon.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (couponId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/admin/coupons/${couponId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchCoupons();
        toast.success('Coupon deleted');
      }
    } catch (error) {
      toast.error('Failed to delete coupon');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading coupons...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Coupons</h1>
          <p className="text-muted-foreground">Manage discount coupons</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Coupon
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Coupon Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Discount Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'percentage' | 'fixed') =>
                      setFormData({ ...formData, type: value })
                    }
                  >
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
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="value">
                    {formData.type === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'}
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="minOrderValue">Min Order Value (₹)</Label>
                  <Input
                    id="minOrderValue"
                    type="number"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="usageLimit">Usage Limit</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="expiresAt">Expiry Date</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {editingCoupon ? 'Update' : 'Create'} Coupon
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCoupon(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {coupons.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Percent className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No coupons found</h3>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {coupons.map((coupon) => (
            <Card key={coupon._id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{coupon.code}</h3>
                      <Badge variant={coupon.isActive ? 'default' : 'secondary'}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {coupon.type === 'percentage' 
                        ? `${coupon.value}% off` 
                        : `₹${coupon.value} off`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Min order: ₹{coupon.minOrderValue}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Used: {coupon.usedCount}/{coupon.usageLimit}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(coupon)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(coupon._id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, UserPlus } from 'lucide-react';
import { Customer } from '@/types/billing.types';

const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  mobile: z.string().min(10, 'Enter a valid mobile number'),
  email: z.string().email('Enter a valid email address'),
  billingAddress: z.string().min(10, 'Enter a complete billing address'),
  gstNumber: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface AddCustomerModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (customer: Customer) => void;
}

export default function AddCustomerModal({ open, onClose, onAdd }: AddCustomerModalProps) {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  const onSubmit = async (data: CustomerFormData) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    const newCustomer: Customer = {
      id: `CUST${Date.now()}`,
      ...data,
      gstNumber: data.gstNumber || undefined,
    };
    onAdd(newCustomer);
    toast.success(`Customer "${newCustomer.name}" added successfully`);
    reset();
    setSaving(false);
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Add New Customer
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="name">
                Customer Name <span className="text-destructive">*</span>
              </Label>
              <Input id="name" placeholder="Acme Pvt Ltd" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mobile">
                Mobile Number <span className="text-destructive">*</span>
              </Label>
              <Input id="mobile" placeholder="+91 98765 43210" {...register('mobile')} />
              {errors.mobile && <p className="text-xs text-destructive">{errors.mobile.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input id="email" type="email" placeholder="purchase@company.com" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="billingAddress">
                Billing Address <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="billingAddress"
                placeholder="Street, City, State - PIN"
                rows={2}
                {...register('billingAddress')}
              />
              {errors.billingAddress && (
                <p className="text-xs text-destructive">{errors.billingAddress.message}</p>
              )}
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="gstNumber">GST Number (Optional)</Label>
              <Input id="gstNumber" placeholder="22AAAAA0000A1Z5" className="uppercase" {...register('gstNumber')} />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
              Add Customer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

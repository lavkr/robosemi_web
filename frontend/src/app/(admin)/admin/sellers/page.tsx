'use client';

import { apiUrl } from '@/utils/api-url';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';

interface Seller {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  businessName: string;
  businessType: 'individual' | 'company' | 'partnership';
  gstNumber?: string;
  panNumber: string;
  businessAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankName: string;
  };
  commission: number;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  isActive: boolean;
  createdAt: string;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  suspended: 'bg-gray-100 text-gray-800'
};

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchSellers();
  }, [filterStatus]);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/admin/sellers?${params}`);
      if (!response.ok) throw new Error('Failed to fetch sellers');
      
      const data = await response.json();
      setSellers(data.data || data.sellers || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sellers');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (sellerId: string, newStatus: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/admin/sellers/${sellerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update seller status');
      
      await fetchSellers();
      setIsEditDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update seller');
    }
  };

  const handleDelete = async (sellerId: string) => {
    if (!confirm('Are you sure you want to delete this seller?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/admin/sellers/${sellerId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete seller');
      
      await fetchSellers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete seller');
    }
  };

  const filteredSellers = sellers.filter(seller =>
    seller.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.userId.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading sellers...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sellers</h1>
          <p className="text-muted-foreground">Manage seller accounts and applications</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search sellers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {filteredSellers.map((seller) => (
          <Card key={seller._id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{seller.businessName}</h3>
                    <Badge className={statusColors[seller.status]}>
                      {seller.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p><strong>Owner:</strong> {seller.userId.name}</p>
                      <p><strong>Email:</strong> {seller.userId.email}</p>
                      <p><strong>Type:</strong> {seller.businessType}</p>
                    </div>
                    <div>
                      <p><strong>Commission:</strong> {seller.commission}%</p>
                      <p><strong>PAN:</strong> {seller.panNumber}</p>
                      <p><strong>GST:</strong> {seller.gstNumber || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedSeller(seller);
                      setIsViewDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedSeller(seller);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(seller._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Seller Details</DialogTitle>
          </DialogHeader>
          {selectedSeller && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Business Name</Label>
                  <p className="text-sm">{selectedSeller.businessName}</p>
                </div>
                <div>
                  <Label>Business Type</Label>
                  <p className="text-sm">{selectedSeller.businessType}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Owner Name</Label>
                  <p className="text-sm">{selectedSeller.userId.name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm">{selectedSeller.userId.email}</p>
                </div>
              </div>
              <div>
                <Label>Business Address</Label>
                <p className="text-sm">
                  {selectedSeller.businessAddress.street}, {selectedSeller.businessAddress.city}, 
                  {selectedSeller.businessAddress.state} - {selectedSeller.businessAddress.zipCode}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Bank Account</Label>
                  <p className="text-sm">{selectedSeller.bankDetails.accountNumber}</p>
                </div>
                <div>
                  <Label>IFSC Code</Label>
                  <p className="text-sm">{selectedSeller.bankDetails.ifscCode}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Seller Status</DialogTitle>
          </DialogHeader>
          {selectedSeller && (
            <div className="space-y-4">
              <div>
                <Label>Current Status: {selectedSeller.status}</Label>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleStatusUpdate(selectedSeller._id, 'approved')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleStatusUpdate(selectedSeller._id, 'rejected')}
                  variant="destructive"
                >
                  Reject
                </Button>
                <Button
                  onClick={() => handleStatusUpdate(selectedSeller._id, 'suspended')}
                  variant="outline"
                >
                  Suspend
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
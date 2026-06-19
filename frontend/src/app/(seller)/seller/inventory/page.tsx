'use client';

import { apiUrl } from '@/utils/api-url';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Loader2, Package, AlertTriangle, Edit } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Product {
  _id: string;
  name: string;
  stock: number;
  minStock: number;
  price: number;
  isActive: boolean;
  images: string[];
  category: { name: string };
}

interface InventoryData {
  products: Product[];
  lowStockProducts: Product[];
  outOfStockProducts: Product[];
  totalProducts: number;
  totalValue: number;
}

export default function SellerInventory() {
  const { data: session } = useSession();
  const user = session?.user;
  const [inventory, setInventory] = useState<InventoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newStock, setNewStock] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchInventory();
    }
  }, [user]);

  const fetchInventory = async () => {
    try {
      const response = await fetch(apiUrl('/seller/inventory'));
      if (response.ok) {
        const data = await response.json();
        setInventory(data);
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async () => {
    if (!editingProduct) return;

    try {
      const response = await fetch(apiUrl('/seller/inventory'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: editingProduct._id,
          stock: newStock
        })
      });

      if (response.ok) {
        await fetchInventory();
        setIsDialogOpen(false);
        setEditingProduct(null);
        setNewStock('');
      }
    } catch (error) {
      console.error('Failed to update stock:', error);
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (product.stock <= product.minStock) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
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
      <div>
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-muted-foreground">Monitor and manage your product stock levels</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{inventory?.totalProducts || 0}</div>
                <p className="text-sm text-muted-foreground">Total Products</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{inventory?.lowStockProducts.length || 0}</div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-2xl font-bold">{inventory?.outOfStockProducts.length || 0}</div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div>
              <div className="text-2xl font-bold">₹{inventory?.totalValue.toLocaleString() || 0}</div>
              <p className="text-sm text-muted-foreground">Inventory Value</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventory?.products.map((product) => {
              const status = getStockStatus(product);
              return (
                <div key={product._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <img
                      src={product.images[0] || '/placeholder.jpg'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">{product.stock} units</div>
                      <div className="text-sm text-muted-foreground">Min: {product.minStock}</div>
                    </div>
                    <Badge className={status.color}>{status.label}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingProduct(product);
                        setNewStock(product.stock.toString());
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stock</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div>
                <Label>Product: {editingProduct.name}</Label>
                <p className="text-sm text-muted-foreground">Current Stock: {editingProduct.stock}</p>
              </div>
              <div>
                <Label htmlFor="newStock">New Stock Quantity</Label>
                <Input
                  id="newStock"
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  min="0"
                />
              </div>
              <Button onClick={handleUpdateStock} className="w-full">
                Update Stock
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
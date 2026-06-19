'use client';

import { apiUrl } from '@/utils/api-url';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const categories = [
  'automation',
  'electronics',
  'sensors',
  'actuators',
  'controllers',
  'accessories',
];

const brands = [
  'RoboSemi',
  'Arduino',
  'Raspberry Pi',
  'Adafruit',
  'SparkFun',
  'Seeed Studio',
];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: '',
    sellingPrice: '',
    category: '',
    brand: '',
    sku: '',
    stock: '',
    minStock: '5',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: '',
    },
    specifications: {},
    tags: '',
    isActive: true,
    isFeatured: false,
    seoTitle: '',
    seoDescription: '',
  });

  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([]);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(typeof prev[parent as keyof typeof prev] === 'object' && prev[parent as keyof typeof prev] !== null
            ? prev[parent as keyof typeof prev]
            : {}),
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => {
        const newData = { ...prev, [field]: value };

        // Calculate discount when price or sellingPrice changes
        if (field === 'price' || field === 'sellingPrice') {
          const price = parseFloat(field === 'price' ? value : prev.price);
          const selling = parseFloat(field === 'sellingPrice' ? value : prev.sellingPrice);

          if (price && selling && price > 0) {
            const discount = ((price - selling) / price) * 100;
            newData.discount = discount > 0 ? discount.toFixed(2) : '0';
          } else if (field === 'price' && !selling) {
            // If price changes and no selling price yet, keep discount empty or 0
            // But if we have a discount, we might want to update selling price? 
            // Requirement says: price -> selling price -> calculate discount.
            // So we prioritize calculating discount.
          }
        }

        return newData;
      });
    }
  };

  const handleMultipleImageUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    const remainingSlots = 5 - images.length;
    const filesToUpload = fileArray.slice(0, remainingSlots);

    if (fileArray.length > remainingSlots) {
      toast.error(`Can only upload ${remainingSlots} more images (maximum 5 total)`);
    }

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      setUploadProgress(`Uploading ${i + 1} of ${filesToUpload.length}...`);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'products');

      try {
        const response = await fetch(apiUrl('/upload'), {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setImages(prev => [...prev, data.secure_url]);
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }

    setUploadProgress('');
    toast.success(`${filesToUpload.length} images uploaded`);
  };

  const handleImageUpload = async (file: File, index?: number) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'products');

    if (index !== undefined) {
      const newUploading = [...uploadingImages];
      newUploading[index] = true;
      setUploadingImages(newUploading);
    }

    try {
      const response = await fetch(apiUrl('/upload'), {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (index !== undefined) {
          const newImages = [...images];
          newImages[index] = data.secure_url;
          setImages(newImages);
        } else {
          setImages([...images, data.secure_url]);
        }
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      if (index !== undefined) {
        const newUploading = [...uploadingImages];
        newUploading[index] = false;
        setUploadingImages(newUploading);
      }
    }
  };

  const removeImage = async (index: number) => {
    const imageUrl = images[index];

    try {
      await fetch(apiUrl('/upload/delete'), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });
    } catch (error) {
      console.error('Failed to delete from Cloudinary:', error);
    }

    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (images.length === 0) {
        toast.error('Please add at least one product image');
        return;
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        discount: formData.discount ? parseFloat(formData.discount) : undefined,
        stock: parseInt(formData.stock),
        minStock: parseInt(formData.minStock),
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        dimensions: {
          length: formData.dimensions.length ? parseFloat(formData.dimensions.length) : undefined,
          width: formData.dimensions.width ? parseFloat(formData.dimensions.width) : undefined,
          height: formData.dimensions.height ? parseFloat(formData.dimensions.height) : undefined,
        },
        images: images,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      };

      const response = await fetch(apiUrl('/products'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        toast.success('Product created successfully');
        router.push('/admin/products');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground">
            Create a new product for your store
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="brand">Brand *</Label>
                    <Select value={formData.brand} onValueChange={(value) => handleInputChange('brand', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    placeholder="e.g., ARD-UNO-R3"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="arduino, microcontroller, development"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}

                  {images.length < 5 && (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 flex flex-col items-center justify-center h-32 hover:border-muted-foreground/50 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            handleMultipleImageUpload(files);
                            e.target.value = '';
                          }
                        }}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer text-center">
                        <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Upload Images</span>
                        <p className="text-xs text-muted-foreground mt-1">{5 - images.length} slots remaining</p>
                      </label>
                    </div>
                  )}
                </div>

                {images.length === 0 && !uploadProgress && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Upload at least one product image
                  </p>
                )}

                {uploadProgress && (
                  <div className="text-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{uploadProgress}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Physical Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="weight">Weight (grams)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="50"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="length">Length (mm)</Label>
                    <Input
                      id="length"
                      type="number"
                      value={formData.dimensions.length}
                      onChange={(e) => handleInputChange('dimensions.length', e.target.value)}
                      placeholder="68"
                    />
                  </div>
                  <div>
                    <Label htmlFor="width">Width (mm)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={formData.dimensions.width}
                      onChange={(e) => handleInputChange('dimensions.width', e.target.value)}
                      placeholder="53"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (mm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.dimensions.height}
                      onChange={(e) => handleInputChange('dimensions.height', e.target.value)}
                      placeholder="15"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    value={formData.seoTitle}
                    onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                    placeholder="Leave empty to use product name"
                  />
                </div>

                <div>
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    value={formData.seoDescription}
                    onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                    rows={3}
                    placeholder="Brief description for search engines"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing & Inventory */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="sellingPrice">Selling Price (₹)</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.sellingPrice}
                    onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                  />
                  {formData.discount && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Calculated Discount: {parseFloat(formData.discount).toFixed(1)}%
                    </p>
                  )}
                </div>

                <Separator />

                <div>
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="minStock">Minimum Stock Alert</Label>
                  <Input
                    id="minStock"
                    type="number"
                    min="0"
                    value={formData.minStock}
                    onChange={(e) => handleInputChange('minStock', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">Active</Label>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="isFeatured">Featured</Label>
                  <Switch
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Product'
                    )}
                  </Button>
                  <Button type="button" variant="outline" className="w-full" asChild>
                    <Link href="/admin/products">Cancel</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
"use client";

import { apiUrl } from '@/utils/api-url';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { ImageUpload } from "@/components/ui/image-upload";

interface Slide {
  id: string;
  desktoimage: string;
  mobileImage: string;
  link?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function SlidesPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [formData, setFormData] = useState({
    desktoimage: "",
    mobileImage: "",
    link: "",
    isActive: true,
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch(apiUrl('/slides'));
      const data = await response.json();
      if (data.success) {
        setSlides(data.data || data.slides || []);
      }
    } catch (error) {
      toast.error("Failed to fetch slides");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.desktoimage.trim()) {
      toast.error("Desktop image is required");
      return;
    }
    
    if (!formData.mobileImage.trim()) {
      toast.error("Mobile image is required");
      return;
    }
    
    try {
      const url = editingSlide ? `/api/admin/slides/${editingSlide.id}` : "/api/admin/slides";
      const method = editingSlide ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(editingSlide ? "Slide updated" : "Slide created");
        setDialogOpen(false);
        resetForm();
        fetchSlides();
      } else {
        toast.error(data.error || "Failed to save slide");
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error("Failed to save slide");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/admin/slides/${id}`, { method: "DELETE" });
      const data = await response.json();
      
      if (data.success) {
        toast.success("Slide deleted");
        fetchSlides();
      } else {
        toast.error("Failed to delete slide");
      }
    } catch (error) {
      toast.error("Failed to delete slide");
    }
  };

  const toggleActive = async (slide: Slide) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/admin/slides/${slide.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...slide, isActive: !slide.isActive }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Slide ${!slide.isActive ? 'activated' : 'deactivated'}`);
        fetchSlides();
      }
    } catch (error) {
      toast.error("Failed to update slide");
    }
  };

  const resetForm = () => {
    setFormData({ desktoimage: "", mobileImage: "", link: "", isActive: true });
    setEditingSlide(null);
  };

  const openEditDialog = (slide: Slide) => {
    setEditingSlide(slide);
    setFormData({
      desktoimage: slide.desktoimage,
      mobileImage: slide.mobileImage,
      link: slide.link || "",
      isActive: slide.isActive,
    });
    setDialogOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Hero Slides</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingSlide ? "Edit Slide" : "Add New Slide"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Desktop Image</Label>
                <ImageUpload
                  value={formData.desktoimage}
                  onChange={(url) => setFormData({ ...formData, desktoimage: url })}
                  onRemove={() => setFormData({ ...formData, desktoimage: "" })}
                  folder="slides"
                />
                <div className="mt-2">
                  <Label className="text-sm text-gray-600">Or enter image URL:</Label>
                  <Input
                    value={formData.desktoimage}
                    onChange={(e) => setFormData({ ...formData, desktoimage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <div>
                <Label>Mobile Image</Label>
                <ImageUpload
                  value={formData.mobileImage}
                  onChange={(url) => setFormData({ ...formData, mobileImage: url })}
                  onRemove={() => setFormData({ ...formData, mobileImage: "" })}
                  folder="slides"
                />
                <div className="mt-2">
                  <Label className="text-sm text-gray-600">Or enter image URL:</Label>
                  <Input
                    value={formData.mobileImage}
                    onChange={(e) => setFormData({ ...formData, mobileImage: e.target.value })}
                    placeholder="https://example.com/mobile-image.jpg"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="link">Link (Optional)</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/products or https://example.com"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked: boolean) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSlide ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {slides.map((slide) => (
          <Card key={slide.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">Slide #{slide.id.slice(-6)}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={slide.isActive ? "default" : "secondary"}>
                    {slide.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleActive(slide)}
                  >
                    {slide.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(slide)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(slide.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Desktop Image</Label>
                  <div className="mt-2 relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    {slide.desktoimage ? (
                      <Image
                        src={slide.desktoimage}
                        alt="Desktop slide"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Mobile Image</Label>
                  <div className="mt-2 relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden max-w-48">
                    {slide.mobileImage ? (
                      <Image
                        src={slide.mobileImage}
                        alt="Mobile slide"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {slide.link && (
                <div className="mt-4">
                  <Label className="text-sm font-medium">Link</Label>
                  <p className="text-sm text-gray-600 mt-1">{slide.link}</p>
                </div>
              )}
              <div className="mt-4 text-xs text-gray-500">
                Created: {new Date(slide.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {slides.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No slides found. Create your first slide to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
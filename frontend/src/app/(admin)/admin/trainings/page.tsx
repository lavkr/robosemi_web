'use client';

import { apiUrl } from '@/utils/api-url';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ImageUpload } from '@/components/ui/image-upload';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  DollarSign
} from 'lucide-react';

interface Training {
  _id: string;
  title: string;
  description: string;
  image?: string;
  category: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  startDate: string;
  endDate?: string;
  price: number;
  instructor: string;
  instructorBio?: string;
  maxParticipants: number;
  currentParticipants: number;
  location: string;
  mode: 'online' | 'offline' | 'hybrid';
  prerequisites: string[];
  learningOutcomes: string[];
  tags: string[];
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
  isActive: boolean;
}

interface TrainingForm {
  title: string;
  description: string;
  image: string;
  category: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  startDate: string;
  endDate: string;
  price: number;
  instructor: string;
  instructorBio: string;
  maxParticipants: number;
  location: string;
  mode: 'online' | 'offline' | 'hybrid';
  prerequisites: string[];
  learningOutcomes: string[];
  tags: string[];
}

const categoryColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800'
};

const modeColors = {
  online: 'bg-blue-100 text-blue-800',
  offline: 'bg-purple-100 text-purple-800',
  hybrid: 'bg-orange-100 text-orange-800'
};

export default function AdminTrainingsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterMode, setFilterMode] = useState('all');

  // Form states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [formData, setFormData] = useState<TrainingForm>({
    title: '',
    description: '',
    image: '',
    category: 'beginner',
    duration: '',
    startDate: '',
    endDate: '',
    price: 0,
    instructor: '',
    instructorBio: '',
    maxParticipants: 20,
    location: '',
    mode: 'online',
    prerequisites: [],
    learningOutcomes: [],
    tags: []
  });
  const [formLoading, setFormLoading] = useState(false);
  const [prerequisiteInput, setPrerequisiteInput] = useState('');
  const [outcomeInput, setOutcomeInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl('/trainings?limit=100'));
      if (!response.ok) throw new Error('Failed to fetch trainings');
      const data = await response.json();
      setTrainings(data.data || data.trainings || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trainings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const method = editingTraining ? 'PUT' : 'POST';
      const url = editingTraining ? `/api/trainings/${editingTraining._id}` : '/api/trainings';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save training');
      }

      await fetchTrainings();
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save training');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (training: Training) => {
    setEditingTraining(training);
    setFormData({
      title: training.title,
      description: training.description,
      image: training.image || '',
      category: training.category,
      duration: training.duration,
      startDate: training.startDate.split('T')[0],
      endDate: training.endDate?.split('T')[0] || '',
      price: training.price,
      instructor: training.instructor,
      instructorBio: training.instructorBio || '',
      maxParticipants: training.maxParticipants,
      location: training.location,
      mode: training.mode,
      prerequisites: training.prerequisites,
      learningOutcomes: training.learningOutcomes,
      tags: training.tags
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (trainingId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/trainings/${trainingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete training');
      }

      await fetchTrainings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete training');
    }
  };

  const resetForm = () => {
    setEditingTraining(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      category: 'beginner',
      duration: '',
      startDate: '',
      endDate: '',
      price: 0,
      instructor: '',
      instructorBio: '',
      maxParticipants: 20,
      location: '',
      mode: 'online',
      prerequisites: [],
      learningOutcomes: [],
      tags: []
    });
    setPrerequisiteInput('');
    setOutcomeInput('');
    setTagInput('');
  };

  const addPrerequisite = () => {
    if (prerequisiteInput.trim()) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, prerequisiteInput.trim()]
      }));
      setPrerequisiteInput('');
    }
  };

  const removePrerequisite = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index)
    }));
  };

  const addOutcome = () => {
    if (outcomeInput.trim()) {
      setFormData(prev => ({
        ...prev,
        learningOutcomes: [...prev.learningOutcomes, outcomeInput.trim()]
      }));
      setOutcomeInput('');
    }
  };

  const removeOutcome = (index: number) => {
    setFormData(prev => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const filteredTrainings = trainings.filter(training => {
    const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || training.category === filterCategory;
    const matchesMode = filterMode === 'all' || training.mode === filterMode;

    return matchesSearch && matchesCategory && matchesMode;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading trainings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Training Courses</h1>
          <p className="text-muted-foreground">Manage training programs and courses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="btn-gradient">
              <Plus className="h-4 w-4 mr-2" />
              Add Training
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTraining ? 'Edit Training' : 'Add New Training'}
              </DialogTitle>
              <DialogDescription>
                {editingTraining ? 'Update training program details below.' : 'Enter details to create a new training program.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructor">Instructor *</Label>
                  <Input
                    id="instructor"
                    value={formData.instructor}
                    onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructorBio">Instructor Bio</Label>
                <Textarea
                  id="instructorBio"
                  value={formData.instructorBio}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructorBio: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mode">Mode *</Label>
                  <Select value={formData.mode} onValueChange={(value: 'online' | 'offline' | 'hybrid') => setFormData(prev => ({ ...prev, mode: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 2 weeks, 40 hours"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Max Participants *</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    min="1"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: Number(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Training Image</Label>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                  onRemove={() => setFormData(prev => ({ ...prev, image: '' }))}
                  folder="trainings"
                />
              </div>

              {/* Prerequisites */}
              <div className="space-y-2">
                <Label>Prerequisites</Label>
                <div className="flex gap-2">
                  <Input
                    value={prerequisiteInput}
                    onChange={(e) => setPrerequisiteInput(e.target.value)}
                    placeholder="Add prerequisite"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
                  />
                  <Button type="button" onClick={addPrerequisite} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.prerequisites.map((prereq, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {prereq}
                      <button
                        type="button"
                        onClick={() => removePrerequisite(index)}
                        className="ml-1 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Learning Outcomes */}
              <div className="space-y-2">
                <Label>Learning Outcomes</Label>
                <div className="flex gap-2">
                  <Input
                    value={outcomeInput}
                    onChange={(e) => setOutcomeInput(e.target.value)}
                    placeholder="Add learning outcome"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOutcome())}
                  />
                  <Button type="button" onClick={addOutcome} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.learningOutcomes.map((outcome, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {outcome}
                      <button
                        type="button"
                        onClick={() => removeOutcome(index)}
                        className="ml-1 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-1 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingTraining ? 'Update Training' : 'Create Training'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search trainings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterMode} onValueChange={setFilterMode}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Training Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrainings.map((training) => (
          <Card key={training._id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex gap-2">
                  <Badge className={categoryColors[training.category]}>
                    {training.category}
                  </Badge>
                  <Badge className={modeColors[training.mode]}>
                    {training.mode}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(training)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Training</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{training.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(training._id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <CardTitle className="text-lg">{training.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {training.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{training.instructor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>₹{training.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(training.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{training.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{training.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{training.currentParticipants}/{training.maxParticipants}</span>
                </div>
              </div>

              {training.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {training.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {training.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{training.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-muted-foreground">
                  Created: {new Date(training.createdAt).toLocaleDateString()}
                </span>
                <Badge variant={training.isActive ? "default" : "secondary"}>
                  {training.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTrainings.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            {searchTerm || filterCategory !== 'all' || filterMode !== 'all'
              ? 'No trainings found matching your filters.'
              : 'No trainings available. Create your first training to get started.'}
          </div>
        </div>
      )}
    </div>
  );
}
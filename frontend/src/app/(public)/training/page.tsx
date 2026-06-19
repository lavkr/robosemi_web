'use client';

import { apiUrl } from '@/utils/api-url';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  Loader2,
  AlertCircle,
  User,
  Phone,
  Mail,
  CheckCircle,
  ArrowRight,
  Github,
  Linkedin
} from 'lucide-react';

interface Training {
  _id: string;
  title: string;
  slug: string;
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
  createdAt: string;
}

interface ApiResponse {
  trainings: Training[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface RegistrationForm {
  userName: string;
  userEmail: string;
  userPhone: string;
  college: string;
  semester: string;
  branch: string;
  linkedin: string;
  github: string;
  notes: string;
}

const categoryColors = {
  beginner: 'bg-green-100 text-green-800 border-green-200',
  intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  advanced: 'bg-red-100 text-red-800 border-red-200'
};

const modeColors = {
  online: 'bg-blue-100 text-blue-800 border-blue-200',
  offline: 'bg-purple-100 text-purple-800 border-purple-200',
  hybrid: 'bg-orange-100 text-orange-800 border-orange-200'
};

export default function TrainingPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMode, setSelectedMode] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Registration modal states
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>({
    userName: '',
    userEmail: '',
    userPhone: '',
    college: '',
    semester: '',
    branch: '',
    linkedin: '',
    github: '',
    notes: ''
  });
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    fetchTrainings();
  }, [searchTerm, selectedCategory, selectedMode, currentPage]);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sortBy: 'startDate',
        sortOrder: 'asc'
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedMode !== 'all') params.append('mode', selectedMode);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/trainings?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch trainings');
      }

      const data = await response.json();
      setTrainings(data.data || []);
      setTotalPages(data.meta?.pages || 1);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTrainings();
  };

  const openRegistrationModal = (training: Training) => {
    setSelectedTraining(training);
    setIsRegistrationOpen(true);
    setRegistrationSuccess(false);
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTraining) return;

    setRegistrationLoading(true);

    try {
      const response = await fetch(apiUrl('/trainings/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...registrationForm,
          trainingId: selectedTraining._id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      setRegistrationSuccess(true);
      setRegistrationForm({
        userName: '',
        userEmail: '',
        userPhone: '',
        college: '',
        semester: '',
        branch: '',
        linkedin: '',
        github: '',
        notes: ''
      });

      // Update training participant count
      setTrainings(prev =>
        prev.map(training =>
          training._id === selectedTraining._id
            ? { ...training, currentParticipants: training.currentParticipants + 1 }
            : training
        )
      );

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setRegistrationLoading(false);
    }
  };

  const isTrainingFull = (training: Training) => {
    return training.currentParticipants >= training.maxParticipants;
  };

  const isTrainingExpired = (training: Training) => {
    return new Date(training.startDate) < new Date();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-6 mb-12">
        <Badge className="bg-accent/10 text-accent border-accent/20 px-4 py-2">
          Training Courses
        </Badge>
        <h1 className="heading-xl text-balance">
          Master <span className="text-gradient">Robotics & IoT</span> Skills
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
          Join our comprehensive training programs designed to enhance your expertise in robotics,
          automation, and IoT technologies with hands-on experience.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search training courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={loading}>
              Search
            </Button>
          </form>

          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedMode} onValueChange={setSelectedMode}>
              <SelectTrigger className="w-48">
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
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading training courses...</span>
        </div>
      )}

      {/* Error State */}
      {error && !registrationSuccess && (
        <div className="text-center py-12">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="font-semibold text-destructive mb-2">Error</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button
              onClick={() => {
                setError(null);
                fetchTrainings();
              }}
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Training Cards */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {trainings.length > 0 ? (
              trainings.map((training, index) => (
                <Card key={training._id} className="card-hover fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={categoryColors[training.category]}>
                        {training.category}
                      </Badge>
                      <Badge className={modeColors[training.mode]}>
                        {training.mode}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight">{training.title}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-4 w-4 mr-1" />
                      {training.instructor}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {training.description.length > 100
                        ? `${training.description.substring(0, 100)}...`
                        : training.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(training.startDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          {training.duration}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          {training.location}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Users className="h-4 w-4 mr-1" />
                          {training.currentParticipants}/{training.maxParticipants}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          ₹{training.price.toLocaleString()}
                        </span>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-1" />
                          {training.maxParticipants - training.currentParticipants} spots left
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/training/${training.slug}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            View Details
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                        <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => openRegistrationModal(training)}
                              disabled={isTrainingFull(training) || isTrainingExpired(training)}
                              className="flex-1 btn-gradient"
                            >
                              {isTrainingFull(training) ? 'Full' :
                                isTrainingExpired(training) ? 'Expired' : 'Register'}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>
                                {registrationSuccess ? 'Registration Successful!' : 'Register for Training'}
                              </DialogTitle>
                              <DialogDescription>
                                {registrationSuccess
                                  ? 'Your registration has been confirmed and we have sent you an email with the details.'
                                  : 'Please fill out the form below to register for this training course.'}
                              </DialogDescription>
                            </DialogHeader>

                            {registrationSuccess ? (
                              <div className="text-center space-y-4 py-4">
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                                <div>
                                  <h3 className="font-semibold">Registration Confirmed</h3>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    We've sent you a confirmation email with further details.
                                  </p>
                                </div>
                                <Button
                                  onClick={() => {
                                    setIsRegistrationOpen(false);
                                    setRegistrationSuccess(false);
                                    setRegistrationForm({
                                      userName: '',
                                      userEmail: '',
                                      userPhone: '',
                                      college: '',
                                      semester: '',
                                      branch: '',
                                      linkedin: '',
                                      github: '',
                                      notes: ''
                                    });
                                  }}
                                  className="btn-gradient"
                                >
                                  Close
                                </Button>
                              </div>
                            ) : (
                              <form onSubmit={handleRegistration} className="space-y-4">
                                {selectedTraining && (
                                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                                    <h4 className="font-semibold">{selectedTraining.title}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedTraining.instructor} • {selectedTraining.duration} • ₹{selectedTraining.price.toLocaleString()}
                                    </p>
                                  </div>
                                )}

                                <div className="space-y-2">
                                  <Label htmlFor="userName">Full Name *</Label>
                                  <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      id="userName"
                                      placeholder="Enter your full name"
                                      value={registrationForm.userName}
                                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, userName: e.target.value }))}
                                      className="pl-10"
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="userEmail">Email Address *</Label>
                                  <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      id="userEmail"
                                      type="email"
                                      placeholder="Enter your email"
                                      value={registrationForm.userEmail}
                                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, userEmail: e.target.value }))}
                                      className="pl-10"
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="userPhone">Phone Number *</Label>
                                  <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      id="userPhone"
                                      type="tel"
                                      placeholder="Enter your phone number"
                                      value={registrationForm.userPhone}
                                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, userPhone: e.target.value }))}
                                      className="pl-10"
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="college">College Name *</Label>
                                  <Input
                                    id="college"
                                    placeholder="Enter your college name"
                                    value={registrationForm.college}
                                    onChange={(e) => setRegistrationForm(prev => ({ ...prev, college: e.target.value }))}
                                    required
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="semester">Semester *</Label>
                                    <Input
                                      id="semester"
                                      placeholder="e.g. 6th"
                                      value={registrationForm.semester}
                                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, semester: e.target.value }))}
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="branch">Branch *</Label>
                                    <Input
                                      id="branch"
                                      placeholder="e.g. CSE"
                                      value={registrationForm.branch}
                                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, branch: e.target.value }))}
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="linkedin">LinkedIn Profile</Label>
                                  <div className="relative">
                                    <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      id="linkedin"
                                      placeholder="LinkedIn profile URL"
                                      value={registrationForm.linkedin}
                                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, linkedin: e.target.value }))}
                                      className="pl-10"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="github">GitHub Profile</Label>
                                  <div className="relative">
                                    <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      id="github"
                                      placeholder="GitHub profile URL"
                                      value={registrationForm.github}
                                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, github: e.target.value }))}
                                      className="pl-10"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="notes">Additional Notes</Label>
                                  <Textarea
                                    id="notes"
                                    placeholder="Any special requirements or questions?"
                                    value={registrationForm.notes}
                                    onChange={(e) => setRegistrationForm(prev => ({ ...prev, notes: e.target.value }))}
                                    rows={3}
                                  />
                                </div>

                                <div className="flex gap-2 pt-4">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsRegistrationOpen(false)}
                                    className="flex-1"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="submit"
                                    disabled={registrationLoading}
                                    className="flex-1 btn-gradient"
                                  >
                                    {registrationLoading ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Registering...
                                      </>
                                    ) : (
                                      'Register Now'
                                    )}
                                  </Button>
                                </div>
                              </form>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Training Courses Found</h3>
                  <p>Try adjusting your search criteria or check back later.</p>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}


    </div>
  );
}
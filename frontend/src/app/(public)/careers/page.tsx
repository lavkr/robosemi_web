'use client';

import { apiUrl } from '@/utils/api-url';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Users, 
  TrendingUp, 
  Heart,
  Coffee,
  Zap,
  Award,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';

const openPositions = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'Mumbai, India',
    type: 'Full-time',
    experience: '3-5 years',
    description: 'Build scalable web applications and APIs for our e-commerce platform.',
    skills: ['React', 'Node.js', 'MongoDB', 'AWS']
  },
  {
    id: 2,
    title: 'Product Manager',
    department: 'Product',
    location: 'Mumbai, India',
    type: 'Full-time',
    experience: '4-6 years',
    description: 'Lead product strategy and roadmap for automation solutions.',
    skills: ['Product Strategy', 'Analytics', 'Agile', 'User Research']
  },
  {
    id: 3,
    title: 'Electronics Engineer',
    department: 'Hardware',
    location: 'Mumbai, India',
    type: 'Full-time',
    experience: '2-4 years',
    description: 'Design and test electronic circuits and embedded systems.',
    skills: ['Circuit Design', 'PCB Layout', 'Embedded C', 'Testing']
  },
  {
    id: 4,
    title: 'Digital Marketing Specialist',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    experience: '2-3 years',
    description: 'Drive online marketing campaigns and growth initiatives.',
    skills: ['SEO', 'Google Ads', 'Social Media', 'Analytics']
  },
  {
    id: 5,
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'Mumbai, India',
    type: 'Full-time',
    experience: '3-5 years',
    description: 'Ensure customer satisfaction and drive retention.',
    skills: ['Customer Relations', 'Technical Support', 'CRM', 'Communication']
  },
  {
    id: 6,
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    experience: '3-4 years',
    description: 'Manage infrastructure and deployment pipelines.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD']
  }
];

const benefits = [
  {
    icon: Heart,
    title: 'Health & Wellness',
    description: 'Comprehensive health insurance and wellness programs'
  },
  {
    icon: TrendingUp,
    title: 'Growth Opportunities',
    description: 'Career development and learning opportunities'
  },
  {
    icon: Coffee,
    title: 'Work-Life Balance',
    description: 'Flexible hours and remote work options'
  },
  {
    icon: Award,
    title: 'Competitive Package',
    description: 'Attractive salary and performance bonuses'
  }
];

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    coverLetter: '',
    resume: null as File | null
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setApplicationData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setApplicationData(prev => ({ ...prev, resume: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real application, you would upload the resume file and submit the application
      const response = await fetch(apiUrl('/leads'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...applicationData,
          source: 'careers',
          interests: ['careers'],
          notes: `Job Application: ${applicationData.position} - ${applicationData.coverLetter}`,
        }),
      });

      if (response.ok) {
        toast.success('Application submitted successfully! We\'ll review and get back to you soon.');
        setApplicationData({
          name: '',
          email: '',
          phone: '',
          position: '',
          experience: '',
          coverLetter: '',
          resume: null
        });
        setSelectedJob(null);
      } else {
        toast.error('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-6 mb-12">
        <Badge className="bg-purple-100 text-purple-800 border-purple-200 px-4 py-2">
          Careers
        </Badge>
        <h1 className="heading-xl text-balance">
          Join Our <span className="text-gradient">Amazing Team</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
          Be part of a dynamic team that's shaping the future of automation and electronics. 
          We're looking for passionate individuals to join our mission.
        </p>
      </div>

      {/* Company Culture */}
      <Card className="mb-12 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Why Work at RoboSemi?</h2>
              <p className="text-muted-foreground mb-6">
                We're not just building products; we're building the future. Join a team of 
                innovators, creators, and problem-solvers who are passionate about technology 
                and making a real impact in the world of automation.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>150+ Team Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Mumbai HQ</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>Fast Growing</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold text-sm">{benefit.title}</h3>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Job Listings */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
          <div className="space-y-4">
            {openPositions.map((job) => (
              <Card key={job.id} className={`cursor-pointer transition-all ${selectedJob === job.id ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}>
                <CardContent className="p-6" onClick={() => setSelectedJob(job.id)}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <p className="text-muted-foreground">{job.department}</p>
                    </div>
                    <Badge variant="outline">{job.type}</Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {job.experience}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job.type}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  {selectedJob === job.id && (
                    <div className="mt-4 pt-4 border-t">
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setApplicationData(prev => ({ ...prev, position: job.title }));
                        }}
                        className="btn-gradient"
                      >
                        Apply for this Position
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Apply Now</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={applicationData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={applicationData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={applicationData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="position">Position *</Label>
                  <Select value={applicationData.position} onValueChange={(value) => handleInputChange('position', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {openPositions.map((job) => (
                        <SelectItem key={job.id} value={job.title}>
                          {job.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Select value={applicationData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 years</SelectItem>
                      <SelectItem value="1-3">1-3 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="5-8">5-8 years</SelectItem>
                      <SelectItem value="8+">8+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="resume">Resume *</Label>
                  <div className="mt-1">
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {applicationData.resume ? applicationData.resume.name : 'Click to upload resume'}
                        </p>
                        <p className="text-xs text-gray-500">PDF, DOC, DOCX (max 5MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        required
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="coverLetter">Cover Letter</Label>
                  <Textarea
                    id="coverLetter"
                    placeholder="Tell us why you're interested in this position..."
                    value={applicationData.coverLetter}
                    onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full btn-gradient" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Company Values */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Our Values</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Innovation</h3>
              <p className="text-sm text-muted-foreground">We embrace new ideas and cutting-edge technology</p>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Collaboration</h3>
              <p className="text-sm text-muted-foreground">We work together to achieve extraordinary results</p>
            </div>
            <div className="text-center">
              <Award className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Excellence</h3>
              <p className="text-sm text-muted-foreground">We strive for the highest standards in everything we do</p>
            </div>
            <div className="text-center">
              <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Passion</h3>
              <p className="text-sm text-muted-foreground">We love what we do and it shows in our work</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
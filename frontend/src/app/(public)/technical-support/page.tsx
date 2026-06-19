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
  Wrench, 
  MessageSquare, 
  Phone, 
  Mail, 
  FileText, 
  Video,
  Download,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

const supportCategories = [
  'Product Installation',
  'Configuration Issues',
  'Compatibility Questions',
  'Performance Problems',
  'Hardware Troubleshooting',
  'Software Integration',
  'Documentation Request',
  'Other Technical Issues'
];

const commonIssues = [
  {
    title: 'Arduino Not Detected',
    description: 'Steps to resolve Arduino board detection issues',
    solution: 'Check USB cable, install drivers, verify COM port settings'
  },
  {
    title: 'Sensor Calibration',
    description: 'How to properly calibrate sensors for accurate readings',
    solution: 'Follow calibration procedure in documentation, check environmental conditions'
  },
  {
    title: 'Power Supply Issues',
    description: 'Troubleshooting power-related problems',
    solution: 'Verify voltage requirements, check connections, test with multimeter'
  },
  {
    title: 'Communication Errors',
    description: 'Resolving I2C, SPI, and UART communication issues',
    solution: 'Check wiring, verify addresses, ensure proper pull-up resistors'
  }
];

export default function TechnicalSupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    product: '',
    category: '',
    priority: 'medium',
    description: '',
    steps_taken: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(apiUrl('/technical-support'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Technical support request submitted! Our team will contact you within 24 hours.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          product: '',
          category: '',
          priority: 'medium',
          description: '',
          steps_taken: ''
        });
      } else {
        toast.error('Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting technical support request:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-6 mb-12">
        <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-4 py-2">
          Technical Support
        </Badge>
        <h1 className="heading-xl text-balance">
          Expert <span className="text-gradient">Technical Support</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
          Get professional technical assistance from our expert engineers. We're here to help you solve 
          any technical challenges and optimize your automation projects.
        </p>
      </div>

      {/* Support Options */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="card-hover text-center">
          <CardContent className="p-8 space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold">Live Chat Support</h3>
            <p className="text-muted-foreground">Instant help from our technical experts</p>
            <Button className="btn-gradient">Start Chat</Button>
          </CardContent>
        </Card>

        <Card className="card-hover text-center">
          <CardContent className="p-8 space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full">
                <Phone className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold">Phone Support</h3>
            <p className="text-muted-foreground">Direct line to our technical team</p>
            <Button variant="outline">+91 92880 72525</Button>
          </CardContent>
        </Card>

        <Card className="card-hover text-center">
          <CardContent className="p-8 space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-violet-100 rounded-full">
                <Video className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold">Video Support</h3>
            <p className="text-muted-foreground">Screen sharing for complex issues</p>
            <Button variant="outline">Schedule Call</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Support Request Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Submit Technical Support Request
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company/Organization</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product">Product/Component *</Label>
                  <Input
                    id="product"
                    placeholder="e.g., Arduino Uno R3"
                    value={formData.product}
                    onChange={(e) => handleInputChange('product', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Issue Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {supportCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="priority">Priority Level</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - General inquiry</SelectItem>
                    <SelectItem value="medium">Medium - Standard issue</SelectItem>
                    <SelectItem value="high">High - Production impact</SelectItem>
                    <SelectItem value="critical">Critical - System down</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Issue Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the technical issue you're experiencing..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="steps_taken">Steps Already Taken</Label>
                <Textarea
                  id="steps_taken"
                  placeholder="What troubleshooting steps have you already tried?"
                  value={formData.steps_taken}
                  onChange={(e) => handleInputChange('steps_taken', e.target.value)}
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full btn-gradient" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit Support Request'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Common Issues & Resources */}
        <div className="space-y-6">
          {/* Common Issues */}
          <Card>
            <CardHeader>
              <CardTitle>Common Technical Issues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {commonIssues.map((issue, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">{issue.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                  <p className="text-sm font-medium text-primary">{issue.solution}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Product Documentation
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Driver Downloads
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Video className="mr-2 h-4 w-4" />
                Video Tutorials
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Community Forum
              </Button>
            </CardContent>
          </Card>

          {/* Support Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Support Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Technical Support</p>
                  <p className="text-sm text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold">Emergency Support</p>
                  <p className="text-sm text-muted-foreground">24/7 for critical issues</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold">Email Support</p>
                  <p className="text-sm text-muted-foreground">technical@robosemi.in</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SLA Information */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Service Level Agreement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h4 className="font-semibold">Critical</h4>
              <p className="text-sm text-muted-foreground">1 hour response</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h4 className="font-semibold">High</h4>
              <p className="text-sm text-muted-foreground">4 hours response</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold">Medium</h4>
              <p className="text-sm text-muted-foreground">24 hours response</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold">Low</h4>
              <p className="text-sm text-muted-foreground">48 hours response</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
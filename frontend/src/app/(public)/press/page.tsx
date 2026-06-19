import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Calendar, ExternalLink, Award, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

const pressReleases = [
  {
    date: '2024-01-15',
    title: 'RoboSemi Announces Strategic Partnership with Leading IoT Platform',
    excerpt: 'Partnership aims to accelerate IoT adoption in manufacturing sector with integrated automation solutions.',
    category: 'Partnership',
    downloadUrl: '#'
  },
  {
    date: '2024-01-10',
    title: 'RoboSemi Crosses 50,000 Customer Milestone',
    excerpt: 'Company celebrates significant growth in customer base across 150+ countries worldwide.',
    category: 'Milestone',
    downloadUrl: '#'
  },
  {
    date: '2023-12-20',
    title: 'New AI-Powered Automation Suite Launched',
    excerpt: 'Revolutionary AI integration brings intelligent automation capabilities to small and medium enterprises.',
    category: 'Product Launch',
    downloadUrl: '#'
  },
  {
    date: '2023-12-05',
    title: 'RoboSemi Wins Innovation Excellence Award 2023',
    excerpt: 'Recognition for outstanding contribution to automation technology and customer satisfaction.',
    category: 'Award',
    downloadUrl: '#'
  }
];

const mediaKit = [
  {
    title: 'Company Logo Pack',
    description: 'High-resolution logos in various formats',
    fileSize: '2.5 MB',
    format: 'ZIP'
  },
  {
    title: 'Product Images',
    description: 'Professional product photography',
    fileSize: '15.2 MB',
    format: 'ZIP'
  },
  {
    title: 'Company Fact Sheet',
    description: 'Key statistics and company information',
    fileSize: '1.1 MB',
    format: 'PDF'
  },
  {
    title: 'Executive Bios',
    description: 'Leadership team biographies and photos',
    fileSize: '3.8 MB',
    format: 'PDF'
  }
];

const awards = [
  {
    year: '2023',
    title: 'Innovation Excellence Award',
    organization: 'Tech Innovation Council',
    description: 'Outstanding contribution to automation technology'
  },
  {
    year: '2023',
    title: 'Best Customer Service',
    organization: 'E-commerce Excellence Awards',
    description: 'Exceptional customer satisfaction and support'
  },
  {
    year: '2022',
    title: 'Startup of the Year',
    organization: 'Mumbai Tech Awards',
    description: 'Rapid growth and innovation in automation sector'
  },
  {
    year: '2022',
    title: 'Export Excellence Award',
    organization: 'Government of Maharashtra',
    description: 'Outstanding performance in international markets'
  }
];

export default function PressPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-6 mb-12">
        <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
          Press & Media
        </Badge>
        <h1 className="heading-xl text-balance">
          <span className="text-gradient">Press Center</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
          Latest news, press releases, and media resources from RoboSemi. 
          Stay updated with our company milestones and industry insights.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <Card className="text-center">
          <CardContent className="p-6">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">40%</div>
            <div className="text-sm text-muted-foreground">YoY Growth</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">50K+</div>
            <div className="text-sm text-muted-foreground">Customers</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">15+</div>
            <div className="text-sm text-muted-foreground">Awards</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <ExternalLink className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">150+</div>
            <div className="text-sm text-muted-foreground">Countries</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Press Releases */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Latest Press Releases</h2>
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline">{release.category}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(release.date).toLocaleDateString()}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{release.title}</h3>
                  <p className="text-muted-foreground mb-4">{release.excerpt}</p>
                  <div className="flex gap-2">
                    <Button size="sm">Read More</Button>
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Media Kit */}
          <Card>
            <CardHeader>
              <CardTitle>Media Kit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mediaKit.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                    <p className="text-xs text-muted-foreground">{item.format} • {item.fileSize}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Media Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold">Priya Sharma</p>
                <p className="text-sm text-muted-foreground">Head of Communications</p>
                <p className="text-sm">press@robosemi.in</p>
                <p className="text-sm">+91 92880 72525</p>
              </div>
              <div>
                <p className="font-semibold">Business Inquiries</p>
                <p className="text-sm">business@robosemi.in</p>
                <p className="text-sm">+91 87654 32109</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/about">About RoboSemi</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/careers">Careers</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/blog">Company Blog</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Awards Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">Awards & Recognition</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {awards.map((award, index) => (
            <Card key={index} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full">
                    <Award className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{award.title}</h3>
                      <Badge variant="outline">{award.year}</Badge>
                    </div>
                    <p className="text-sm text-primary font-medium mb-1">{award.organization}</p>
                    <p className="text-sm text-muted-foreground">{award.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <Card className="mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold">Stay Updated</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Subscribe to receive the latest press releases and company news directly in your inbox.
          </p>
          <Button size="lg" className="btn-gradient">
            Subscribe to Press Updates
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
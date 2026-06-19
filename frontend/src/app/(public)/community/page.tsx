'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Users, MessageSquare, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useState } from 'react';

const communityHighlights = [
  {
    title: 'RoboSemi Hackathon 2025',
    description: 'Join our annual hackathon to build innovative robotics solutions using microcontrollers, sensors, and IoT technology.',
    date: '2025-10-15',
    location: 'Virtual & Mumbai, India',
    link: '/events/hackathon-2025',
  },
  {
    title: 'STEM Workshop for Students',
    description: 'Hands-on workshops for students to learn about robotics, semiconductors, and programming.',
    date: '2025-09-20',
    location: 'RoboSemi HQ, Mumbai, India',
    link: '/events/stem-workshop',
  },
  {
    title: 'Webinar: Future of Semiconductors in Robotics',
    description: 'Industry experts discuss the role of advanced semiconductors in next-gen robotics.',
    date: '2025-08-10',
    location: 'Online',
    link: '/events/webinar-semiconductors',
  },
];

const forumCategories = [
  { name: 'Microcontrollers', description: 'Discuss Arduino, Raspberry Pi, and other microcontroller platforms.', icon: Sparkles },
  { name: 'Sensors & IoT', description: 'Explore sensor integration and IoT applications in robotics.', icon: Sparkles },
  { name: 'Programming', description: 'Share tips on coding for robotics and automation.', icon: Sparkles },
  { name: 'Hardware Design', description: 'Dive into circuit design and hardware prototyping.', icon: Sparkles },
];

export default function CommunityPage() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for newsletter subscription logic
    console.log('Subscribed with email:', email);
    setEmail('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-6 mb-12">
        <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-4 py-2">
          Community
        </Badge>
        <h1 className="heading-xl text-balance">
          Join the <span className="text-gradient">RoboSemi Community</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
          Connect with robotics and semiconductor enthusiasts, share knowledge, and collaborate on cutting-edge projects at RoboSemi.
        </p>
      </div>

      {/* Community Highlights */}
      <div className="mb-16">
        <div className="text-center space-y-6 mb-12">
          <h2 className="heading-lg">Community Highlights</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover upcoming events, workshops, and webinars to engage with our vibrant community.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {communityHighlights.map((highlight, index) => (
            <Card key={index} className="card-hover group">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(highlight.date), 'MMM dd, yyyy')}
                  <span className="mx-2">•</span>
                  {highlight.location}
                </div>
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                  {highlight.title}
                </h3>
                <p className="text-muted-foreground line-clamp-3">
                  {highlight.description}
                </p>
                <Button asChild variant="outline">
                  <Link href={highlight.link}>Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Discussion Forum Teaser */}
      <div className="mb-16">
        <div className="text-center space-y-6 mb-12">
          <h2 className="heading-lg">Discussion Forum</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Engage in discussions on robotics, semiconductors, and more in our community forum.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {forumCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={index} className="card-hover">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      <p className="text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  <Button asChild variant="outline">
                    <Link href="/community/forum">Join Discussion</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Newsletter Signup */}
      <Card className="mb-16 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-8 text-center space-y-6">
          <Users className="h-12 w-12 text-blue-600 mx-auto" />
          <div>
            <h3 className="text-2xl font-bold mb-4">Stay Connected</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Subscribe to our newsletter for the latest community updates, event announcements, and robotics resources.
            </p>
          </div>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="max-w-md"
              required
            />
            <Button type="submit" className="btn-gradient">
              Subscribe
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-8 text-center space-y-6">
          <MessageSquare className="h-12 w-12 text-blue-600 mx-auto" />
          <div>
            <h3 className="text-2xl font-bold mb-4">Get Involved</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Whether you're a student, professional, or enthusiast, join our community to collaborate, learn, and innovate in robotics and semiconductors.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-gradient" asChild>
              <Link href="/community/join">Join Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { apiUrl } from '@/utils/api-url';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MoreHorizontal, Mail, Users, TrendingUp, Download } from 'lucide-react';
import { format } from 'date-fns';

interface Subscriber {
  _id: string;
  email: string;
  name?: string;
  source: string;
  status: string;
  interests: string[];
  subscribedAt: string;
  emailsSent: number;
  emailsOpened: number;
  emailsClicked: number;
}

const statusColors = {
  active: 'bg-green-100 text-green-800',
  unsubscribed: 'bg-red-100 text-red-800',
  bounced: 'bg-yellow-100 text-yellow-800',
};

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(statusFilter && statusFilter !== 'all' && { status: statusFilter }),
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/newsletter?${params}`);
      if (response.ok) {
        const data = await response.json();
        setSubscribers(data.subscribers);
        setTotalPages(data.meta.pages);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, [page, statusFilter]);

  const stats = [
    {
      title: 'Total Subscribers',
      value: '25,432',
      change: '+12.5%',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Active Subscribers',
      value: '23,891',
      change: '+8.2%',
      icon: Mail,
      color: 'text-green-600',
    },
    {
      title: 'Open Rate',
      value: '24.8%',
      change: '+3.2%',
      icon: TrendingUp,
      color: 'text-purple-600',
    },
    {
      title: 'Click Rate',
      value: '4.2%',
      change: '+0.8%',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ];

  const exportSubscribers = async () => {
    try {
      const response = await fetch(apiUrl('/newsletter/export'));
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'subscribers.csv';
      a.click();
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Newsletter Management</h1>
          <p className="text-muted-foreground">
            Manage your email subscribers and campaigns
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportSubscribers} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Mail className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-green-600">
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`h-12 w-12 rounded-lg bg-muted flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Subscribers Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Subscribers</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search subscribers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                  <SelectItem value="bounced">Bounced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subscriber</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Subscribed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((subscriber) => (
                    <TableRow key={subscriber._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{subscriber.email}</p>
                          {subscriber.name && (
                            <p className="text-sm text-muted-foreground">{subscriber.name}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {subscriber.source}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[subscriber.status as keyof typeof statusColors]}>
                          {subscriber.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Sent: {subscriber.emailsSent}</div>
                          <div>Opened: {subscriber.emailsOpened}</div>
                          <div>Clicked: {subscriber.emailsClicked}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(subscriber.subscribedAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Send Email</DropdownMenuItem>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                            <DropdownMenuItem>Add Tags</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
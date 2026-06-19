import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Globe,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Target,
  Award
} from 'lucide-react';
import Link from 'next/link';

const financialHighlights = [
  {
    metric: 'Revenue Growth',
    value: '40%',
    period: 'YoY 2023',
    icon: TrendingUp,
    color: 'text-green-600'
  },
  {
    metric: 'Customer Base',
    value: '50K+',
    period: 'Active Customers',
    icon: Users,
    color: 'text-blue-600'
  },
  {
    metric: 'Market Presence',
    value: '150+',
    period: 'Countries',
    icon: Globe,
    color: 'text-purple-600'
  },
  {
    metric: 'Gross Margin',
    value: '65%',
    period: 'Q4 2023',
    icon: PieChart,
    color: 'text-orange-600'
  }
];

const reports = [
  {
    title: 'Annual Report 2023',
    description: 'Comprehensive overview of our financial performance and strategic initiatives',
    date: '2024-03-15',
    type: 'Annual Report',
    size: '2.5 MB'
  },
  {
    title: 'Q4 2023 Earnings Report',
    description: 'Quarterly financial results and business highlights',
    date: '2024-01-30',
    type: 'Quarterly Report',
    size: '1.8 MB'
  },
  {
    title: 'Investor Presentation Q4 2023',
    description: 'Strategic overview and market outlook presentation',
    date: '2024-01-30',
    type: 'Presentation',
    size: '5.2 MB'
  },
  {
    title: 'ESG Report 2023',
    description: 'Environmental, Social, and Governance performance report',
    date: '2024-02-15',
    type: 'ESG Report',
    size: '3.1 MB'
  }
];

const upcomingEvents = [
  {
    date: '2024-04-15',
    title: 'Q1 2024 Earnings Call',
    time: '10:00 AM IST',
    type: 'Earnings Call'
  },
  {
    date: '2024-05-20',
    title: 'Annual Shareholder Meeting',
    time: '2:00 PM IST',
    type: 'AGM'
  },
  {
    date: '2024-06-10',
    title: 'Automation Industry Conference',
    time: '9:00 AM IST',
    type: 'Conference'
  }
];

const keyMetrics = [
  { label: 'Total Revenue', value: '₹125 Cr', change: '+40%' },
  { label: 'EBITDA', value: '₹35 Cr', change: '+45%' },
  { label: 'Net Profit', value: '₹22 Cr', change: '+38%' },
  { label: 'Cash Flow', value: '₹28 Cr', change: '+25%' }
];

export default function InvestorsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-6 mb-12">
        <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
          Investor Relations
        </Badge>
        <h1 className="heading-xl text-balance">
          <span className="text-gradient">Investor Relations</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
          Transparent communication with our investors and stakeholders. 
          Access financial reports, performance metrics, and strategic updates.
        </p>
      </div>

      {/* Financial Highlights */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {financialHighlights.map((highlight, index) => {
          const Icon = highlight.icon;
          return (
            <Card key={index} className="card-hover">
              <CardContent className="p-6 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full">
                    <Icon className={`h-6 w-6 ${highlight.color}`} />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient">{highlight.value}</div>
                  <div className="text-sm font-semibold">{highlight.metric}</div>
                  <div className="text-xs text-muted-foreground">{highlight.period}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Financial Reports */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Financial Reports & Documents</h2>
          <div className="space-y-4">
            {reports.map((report, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline">{report.type}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(report.date).toLocaleDateString()}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
                  <p className="text-muted-foreground mb-4">{report.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Size: {report.size}</span>
                    <Button size="sm">
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
          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Key Financial Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {keyMetrics.map((metric, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{metric.label}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {metric.change}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{event.type}</Badge>
                    <span className="text-sm text-muted-foreground">{event.time}</span>
                  </div>
                  <h4 className="font-semibold">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Investor Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold">Amit Patel</p>
                <p className="text-sm text-muted-foreground">Head of Investor Relations</p>
                <p className="text-sm">investors@robosemi.in</p>
                <p className="text-sm">+91 92880 72525</p>
              </div>
              <div>
                <p className="font-semibold">Financial Queries</p>
                <p className="text-sm">finance@robosemi.in</p>
                <p className="text-sm">+91 87654 32109</p>
              </div>
            </CardContent>
          </Card>

          {/* Stock Information */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Company Status</p>
                <p className="font-semibold">Private Limited</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Exploring IPO opportunities
                </p>
              </div>
              <Button className="w-full" variant="outline">
                Subscribe to Updates
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Investment Highlights */}
      <Card className="mt-16">
        <CardHeader>
          <CardTitle className="text-center">Investment Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Market Leadership</h3>
              <p className="text-muted-foreground">
                Leading position in the automation components market with strong brand recognition
              </p>
            </div>
            <div className="text-center p-6">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Strong Growth</h3>
              <p className="text-muted-foreground">
                Consistent revenue growth driven by expanding customer base and market penetration
              </p>
            </div>
            <div className="text-center p-6">
              <Award className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Innovation Focus</h3>
              <p className="text-muted-foreground">
                Continuous investment in R&D and emerging technologies like AI and IoT
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Newsletter Signup */}
      <Card className="mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-8 text-center space-y-4">
          <BarChart3 className="h-12 w-12 text-primary mx-auto" />
          <h3 className="text-2xl font-bold">Stay Informed</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Subscribe to receive quarterly reports, earnings announcements, and important investor updates.
          </p>
          <Button size="lg" className="btn-gradient">
            Subscribe to Investor Updates
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
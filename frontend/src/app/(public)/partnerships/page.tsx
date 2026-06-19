import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Users, 
  Globe, 
  TrendingUp, 
  Award, 
  Target,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

const partnershipTypes = [
  {
    icon: Users,
    title: 'Technology Partners',
    description: 'Collaborate on innovative solutions and integrate cutting-edge technologies',
    benefits: ['Joint product development', 'Technical integration', 'Shared expertise', 'Market expansion'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Globe,
    title: 'Distribution Partners',
    description: 'Expand our global reach through strategic distribution partnerships',
    benefits: ['Market access', 'Local expertise', 'Sales support', 'Brand promotion'],
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: TrendingUp,
    title: 'Reseller Partners',
    description: 'Join our reseller network and grow your business with our products',
    benefits: ['Competitive margins', 'Training programs', 'Marketing support', 'Technical assistance'],
    color: 'from-purple-500 to-violet-500'
  },
  {
    icon: Award,
    title: 'Solution Partners',
    description: 'Develop comprehensive solutions for specific industry verticals',
    benefits: ['Co-marketing opportunities', 'Joint sales efforts', 'Solution certification', 'Revenue sharing'],
    color: 'from-orange-500 to-red-500'
  }
];

const currentPartners = [
  {
    name: 'TechCorp Industries',
    type: 'Technology Partner',
    description: 'Leading automation solutions for manufacturing',
    logo: '🏭'
  },
  {
    name: 'Global Electronics',
    type: 'Distribution Partner',
    description: 'Worldwide distribution network',
    logo: '🌐'
  },
  {
    name: 'Smart Solutions Ltd',
    type: 'Solution Partner',
    description: 'IoT and smart city solutions',
    logo: '🏙️'
  },
  {
    name: 'Innovation Labs',
    type: 'Technology Partner',
    description: 'R&D and product development',
    logo: '🔬'
  }
];

const benefits = [
  {
    icon: Target,
    title: 'Market Expansion',
    description: 'Access new markets and customer segments through strategic partnerships'
  },
  {
    icon: Users,
    title: 'Shared Expertise',
    description: 'Leverage combined knowledge and technical capabilities'
  },
  {
    icon: TrendingUp,
    title: 'Revenue Growth',
    description: 'Increase revenue through collaborative business opportunities'
  },
  {
    icon: Award,
    title: 'Innovation',
    description: 'Drive innovation through joint research and development'
  }
];

export default function PartnershipsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center space-y-6 mb-12">
        <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
          Strategic Partnerships
        </Badge>
        <h1 className="heading-xl text-balance">
          Building the Future <span className="text-gradient">Together</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
          Join our global network of partners and unlock new opportunities for growth, 
          innovation, and market expansion in the automation industry.
        </p>
      </div>

      {/* Partnership Types */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {partnershipTypes.map((type, index) => {
          const Icon = type.icon;
          return (
            <Card key={index} className="card-hover group relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              <CardContent className="relative p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${type.color} shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">{type.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{type.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold">Key Benefits:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {type.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Button className="btn-gradient group-hover:shadow-lg transition-shadow">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Why Partner With Us */}
      <div className="mb-16">
        <div className="text-center space-y-6 mb-12">
          <h2 className="heading-lg">Why Partner With RoboSemi?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We believe in the power of collaboration to drive innovation and create value for all stakeholders.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="card-hover text-center">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Current Partners */}
      <div className="mb-16">
        <div className="text-center space-y-6 mb-12">
          <h2 className="heading-lg">Our Trusted Partners</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're proud to work with industry leaders who share our vision for innovation and excellence.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentPartners.map((partner, index) => (
            <Card key={index} className="card-hover text-center">
              <CardContent className="p-6 space-y-4">
                <div className="text-4xl">{partner.logo}</div>
                <h3 className="font-semibold">{partner.name}</h3>
                <Badge variant="outline">{partner.type}</Badge>
                <p className="text-sm text-muted-foreground">{partner.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Partnership Process */}
      <Card className="mb-16">
        <CardHeader>
          <CardTitle className="text-center">Partnership Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">1</div>
              <h4 className="font-semibold mb-2">Initial Contact</h4>
              <p className="text-sm text-muted-foreground">Reach out to discuss partnership opportunities</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">2</div>
              <h4 className="font-semibold mb-2">Evaluation</h4>
              <p className="text-sm text-muted-foreground">Mutual assessment of partnership fit and potential</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">3</div>
              <h4 className="font-semibold mb-2">Agreement</h4>
              <p className="text-sm text-muted-foreground">Finalize partnership terms and agreements</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">4</div>
              <h4 className="font-semibold mb-2">Launch</h4>
              <p className="text-sm text-muted-foreground">Begin collaboration and joint initiatives</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-12 text-center space-y-8">
          <Heart className="h-16 w-16 text-primary mx-auto" />
          <div>
            <h3 className="text-3xl font-bold mb-4">Ready to Partner With Us?</h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Let's explore how we can work together to create innovative solutions 
              and drive mutual growth in the automation industry.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-gradient" asChild>
              <Link href="/contact">
                Start Partnership Discussion
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
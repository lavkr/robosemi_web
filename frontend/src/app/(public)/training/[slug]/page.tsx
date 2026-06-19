'use client';

import { apiUrl } from '@/utils/api-url';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
    Clock,
    User,
    Tag,
    ArrowLeft,
    Loader2,
    AlertCircle,
    Calendar,
    MapPin,
    Users,
    CheckCircle,
    BookOpen,
    Target,
    Phone,
    Mail,
    GraduationCap,
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
    createdBy: {
        _id: string;
        name: string;
    };
    createdAt: string;
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

export default function TrainingDetailPage() {
    const { slug } = useParams();
    const [training, setTraining] = useState<Training | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Registration states
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
    const [registrationError, setRegistrationError] = useState<string | null>(null);

    useEffect(() => {
        if (slug) {
            fetchTraining();
        }
    }, [slug]);

    const fetchTraining = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/trainings/${slug}`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Training not found');
                }
                throw new Error('Failed to fetch training');
            }

            const json = await response.json();
            setTraining(json.data ?? json);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!training) return;

        setRegistrationLoading(true);
        setRegistrationError(null);

        try {
            const response = await fetch(apiUrl('/trainings/register'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...registrationForm,
                    trainingId: training._id
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

            // Update training participant count locally
            setTraining(prev => prev ? {
                ...prev,
                currentParticipants: prev.currentParticipants + 1
            } : null);

        } catch (err) {
            setRegistrationError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setRegistrationLoading(false);
        }
    };

    const isTrainingFull = training && training.currentParticipants >= training.maxParticipants;
    const isTrainingExpired = training && new Date(training.startDate) < new Date();
    const spotsLeft = training ? training.maxParticipants - training.currentParticipants : 0;

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Loading training details...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
                        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                        <h3 className="font-semibold text-destructive mb-2">Error Loading Training</h3>
                        <p className="text-muted-foreground mb-4">{error}</p>
                        <div className="flex gap-2 justify-center">
                            <Link href="/training">
                                <Button variant="outline">Back to Trainings</Button>
                            </Link>
                            <Button
                                onClick={fetchTraining}
                                variant="outline"
                                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            >
                                Try Again
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!training) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">Training Not Found</h3>
                    <p className="text-muted-foreground mb-4">The training you&apos;re looking for doesn&apos;t exist.</p>
                    <Link href="/training">
                        <Button>Back to Trainings</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <Link href="/training" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Trainings
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <div className="relative overflow-hidden rounded-t-lg">
                            {training.image ? (
                                <img
                                    src={training.image}
                                    alt={training.title}
                                    className="w-full h-64 md:h-80 object-cover"
                                    onError={(e) => {
                                        const el = e.target as HTMLImageElement;
                                        el.style.display = 'none';
                                        const parent = el.parentElement;
                                        if (parent) {
                                            parent.className = 'relative overflow-hidden rounded-t-lg w-full h-64 md:h-80 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center';
                                            const placeholder = document.createElement('span');
                                            placeholder.textContent = '🤖';
                                            placeholder.style.fontSize = '80px';
                                            parent.appendChild(placeholder);
                                        }
                                    }}
                                />
                            ) : (
                                <div className="w-full h-64 md:h-80 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex flex-col items-center justify-center gap-4">
                                    <span className="text-8xl">🤖</span>
                                    <p className="text-white text-xl font-semibold opacity-80">{training.title}</p>
                                </div>
                            )}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <Badge className={categoryColors[training.category]}>
                                    {training.category}
                                </Badge>
                                <Badge className={modeColors[training.mode]}>
                                    {training.mode}
                                </Badge>
                            </div>
                        </div>

                        <CardHeader>
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex gap-2">
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {training.duration}
                                </div>
                            </div>
                            <CardTitle className="text-2xl md:text-3xl">{training.title}</CardTitle>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <GraduationCap className="h-4 w-4 mr-1" />
                                Instructor: {training.instructor}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-3">About This Training</h3>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {training.description}
                                </p>
                            </div>

                            {training.instructorBio && (
                                <div>
                                    <h3 className="font-semibold text-lg mb-3">About the Instructor</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {training.instructorBio}
                                    </p>
                                </div>
                            )}

                            {training.prerequisites.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-lg mb-3 flex items-center">
                                        <BookOpen className="h-5 w-5 mr-2 text-primary" />
                                        Prerequisites
                                    </h3>
                                    <ul className="space-y-2">
                                        {training.prerequisites.map((prereq, index) => (
                                            <li key={index} className="flex items-start text-muted-foreground">
                                                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                                                {prereq}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {training.learningOutcomes.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-lg mb-3 flex items-center">
                                        <Target className="h-5 w-5 mr-2 text-primary" />
                                        What You&apos;ll Learn
                                    </h3>
                                    <ul className="space-y-2">
                                        {training.learningOutcomes.map((outcome, index) => (
                                            <li key={index} className="flex items-start text-muted-foreground">
                                                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                                                {outcome}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {training.tags.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-lg mb-3">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {training.tags.map((tag, index) => (
                                            <Badge key={index} variant="secondary">
                                                <Tag className="h-3 w-3 mr-1" />
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Registration & Info */}
                <div className="space-y-6">
                    {/* Training Info Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Training Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Start Date
                                </span>
                                <span className="text-sm font-medium">
                                    {new Date(training.startDate).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                            {training.endDate && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground flex items-center">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        End Date
                                    </span>
                                    <span className="text-sm font-medium">
                                        {new Date(training.endDate).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground flex items-center">
                                    <Clock className="h-4 w-4 mr-2" />
                                    Duration
                                </span>
                                <span className="text-sm font-medium">{training.duration}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground flex items-center">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Location
                                </span>
                                <span className="text-sm font-medium">{training.location}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground flex items-center">
                                    <Users className="h-4 w-4 mr-2" />
                                    Participants
                                </span>
                                <span className="text-sm font-medium">
                                    {training.currentParticipants}/{training.maxParticipants}
                                </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Level</span>
                                <Badge className={categoryColors[training.category]}>
                                    {training.category}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Mode</span>
                                <Badge className={modeColors[training.mode]}>
                                    {training.mode}
                                </Badge>
                            </div>
                            <Separator />
                            <div className="text-center">
                                <span className="text-3xl font-bold text-primary">
                                    ₹{training.price.toLocaleString()}
                                </span>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {spotsLeft > 0 ? `${spotsLeft} spots left` : 'No spots available'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Registration Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                {registrationSuccess ? 'Registration Successful!' : 'Register Now'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {registrationSuccess ? (
                                <div className="text-center space-y-4">
                                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                                    <div>
                                        <h3 className="font-semibold">Registration Confirmed</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            We&apos;ve sent you a confirmation email with further details.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => setRegistrationSuccess(false)}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Register Another
                                    </Button>
                                </div>
                            ) : isTrainingFull ? (
                                <div className="text-center space-y-4">
                                    <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto" />
                                    <div>
                                        <h3 className="font-semibold">Training Full</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            This training has reached maximum capacity.
                                        </p>
                                    </div>
                                </div>
                            ) : isTrainingExpired ? (
                                <div className="text-center space-y-4">
                                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                                    <div>
                                        <h3 className="font-semibold">Training Started</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Registration for this training has closed.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleRegistration} className="space-y-4">
                                    {registrationError && (
                                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
                                            {registrationError}
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
                                        <Label htmlFor="notes">Additional Notes</Label>
                                        <Textarea
                                            id="notes"
                                            placeholder="Any special requirements or questions?"
                                            value={registrationForm.notes}
                                            onChange={(e) => setRegistrationForm(prev => ({ ...prev, notes: e.target.value }))}
                                            rows={3}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={registrationLoading}
                                        className="w-full btn-gradient"
                                    >
                                        {registrationLoading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Registering...
                                            </>
                                        ) : (
                                            `Register for ₹${training.price.toLocaleString()}`
                                        )}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    );
}

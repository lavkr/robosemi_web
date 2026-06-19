'use client';

import { apiUrl } from '@/utils/api-url';

import { useState, useEffect, use } from 'react';
import { notFound } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Eye, User, ArrowLeft, Share2, Bookmark, Heart, MessageCircle, Twitter, Facebook, Linkedin, Copy } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: {
    name: string;
    email: string;
  } | null;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  views: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: BlogPageProps) {
  const { data: session } = useSession();
  const resolvedParams = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [resolvedParams.slug]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/blog/${resolvedParams.slug}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data.data ?? data);
      } else if (response.status === 404) {
        notFound();
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || '';
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
    }
    setShowShareMenu(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
            <p className="text-gray-500">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation Bar */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild className="hover:bg-blue-50">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={`hover:bg-red-50 ${isLiked ? 'text-red-500' : ''}`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`hover:bg-blue-50 ${isBookmarked ? 'text-blue-500' : ''}`}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="hover:bg-green-50"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                {showShareMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-2 min-w-[160px]">
                    <Button variant="ghost" size="sm" onClick={() => handleShare('twitter')} className="w-full justify-start">
                      <Twitter className="h-4 w-4 mr-2" /> Twitter
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleShare('facebook')} className="w-full justify-start">
                      <Facebook className="h-4 w-4 mr-2" /> Facebook
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleShare('linkedin')} className="w-full justify-start">
                      <Linkedin className="h-4 w-4 mr-2" /> LinkedIn
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleShare('copy')} className="w-full justify-start">
                      <Copy className="h-4 w-4 mr-2" /> Copy Link
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <header className="mb-12">
            {/* Category and Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-3 py-1">
                {post.category}
              </Badge>
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="border-gray-300 hover:bg-gray-50">
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Meta Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{post.author?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">Author</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {post.publishedAt ? format(new Date(post.publishedAt), 'MMMM dd, yyyy') : 'Draft'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime} min read</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.views.toLocaleString()} views</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="relative h-64 md:h-96 lg:h-[500px] w-full mb-12 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}
          </header>

          {/* Content */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 mb-12">
            <div 
              className="prose prose-lg prose-blue max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Footer */}
          <footer className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{post.author?.name || 'Unknown Author'}</h3>
                  <p className="text-gray-600">Content Creator & Tech Enthusiast</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Published on {post.publishedAt ? format(new Date(post.publishedAt), 'MMMM dd, yyyy') : 'Draft'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="rounded-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Discuss
                </Button>
                <Button size="sm" className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  Follow Author
                </Button>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}
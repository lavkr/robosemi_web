import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Eye, User } from 'lucide-react';
import { format } from 'date-fns';

interface BlogCardProps {
  blog: {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    featuredImage?: string;
    author: {
      name: string;
    } | null;
    category: string;
    publishedAt: string;
    readTime: number;
    views: number;
  };
  viewMode?: 'grid' | 'list';
}

export default function BlogCard({ blog, viewMode = 'grid' }: BlogCardProps) {
  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <Link href={`/blog/${blog.slug}`}>
          <div className="flex flex-col md:flex-row">
            {blog.featuredImage && (
              <div className="relative h-48 md:h-32 md:w-48 flex-shrink-0">
                <Image
                  src={blog.featuredImage}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {blog.category}
                </Badge>
              </div>
              <h3 className="font-bold text-xl line-clamp-2 hover:text-blue-600 transition-colors mb-3">
                {blog.title}
              </h3>
              <p className="text-gray-600 line-clamp-2 mb-4">
                {blog.excerpt}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{blog.author?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{blog.publishedAt ? format(new Date(blog.publishedAt), 'MMM dd') : 'Draft'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{blog.readTime} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{blog.views}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-md">
      <Link href={`/blog/${blog.slug}`}>
        {blog.featuredImage && (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={blog.featuredImage}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
              {blog.category}
            </Badge>
          </div>
          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
            {blog.title}
          </h3>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">
            {blog.excerpt}
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{blog.author?.name || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{blog.publishedAt ? format(new Date(blog.publishedAt), 'MMM dd') : 'Draft'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{blog.readTime} min read</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Eye className="h-3 w-3" />
                <span>{blog.views} views</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
'use client';

import { apiUrl } from '@/utils/api-url';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Star } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Review {
  _id: string;
  userId: { _id: string; name: string };
  productId: { _id: string; name: string; images: string[] };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function SellerReviews() {
  const { data: session } = useSession();
  const user = session?.user;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchReviews();
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/seller/reviews?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review =>
    review.productId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0';

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reviews</h1>
        <p className="text-muted-foreground">Customer feedback on your products</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{reviews.length}</div>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{averageRating}</div>
              <div className="flex justify-center mt-1">
                {renderStars(Math.round(parseFloat(averageRating)))}
              </div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {reviews.filter(r => r.rating >= 4).length}
              </div>
              <p className="text-sm text-muted-foreground">Positive Reviews</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search reviews..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-6">
        {filteredReviews.map((review) => (
          <Card key={review._id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <img
                  src={review.productId.images[0] || '/placeholder.jpg'}
                  alt={review.productId.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{review.productId.name}</h3>
                      <p className="text-sm text-muted-foreground">by {review.userId.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <Badge variant="outline">{review.rating}/5</Badge>
                    </div>
                  </div>
                  <p className="text-sm mb-2">{review.comment}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredReviews.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                {reviews.length === 0 ? 'No reviews yet.' : 'No reviews match your search.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
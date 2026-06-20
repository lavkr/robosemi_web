'use client';

import Link from 'next/link';
import { Star, X } from 'lucide-react';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

interface Props {
  excludeId?: string;
}

export function RecentlyViewedSection({ excludeId }: Props) {
  const { items, clearAll } = useRecentlyViewed();

  const visible = items.filter((p) => p._id !== excludeId);

  if (visible.length === 0) return null;

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Recently Viewed</h2>
        <button
          onClick={clearAll}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-200">
        {visible.map((product) => {
          const finalPrice = product.discount
            ? product.price * (1 - product.discount / 100)
            : product.price;

          return (
            <Link
              key={product._id}
              href={`/products/${product._id}`}
              className="flex-shrink-0 w-44 bg-white rounded-xl border hover:shadow-md transition-shadow group"
            >
              {/* Image */}
              <div className="relative w-full h-36 rounded-t-xl overflow-hidden bg-gray-50">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo.png';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                )}
                {product.discount && product.discount > 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                    -{product.discount}%
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-xs text-gray-500 mb-0.5 truncate">{product.category}</p>
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight mb-2">
                  {product.name}
                </h3>

                {/* Rating */}
                {product.rating > 0 && (
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600">
                      {product.rating.toFixed(1)}
                      {product.reviewCount > 0 && (
                        <span className="text-gray-400"> ({product.reviewCount})</span>
                      )}
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-gray-900">
                    ₹{Math.round(finalPrice).toLocaleString()}
                  </span>
                  {product.discount && product.discount > 0 && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{product.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

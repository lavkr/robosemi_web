import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  author: mongoose.Types.ObjectId;
  category:
    | 'Technology'
    | 'Robotics'
    | 'IoT'
    | 'Automation'
    | 'Electronics'
    | 'Tutorials'
    | 'News';
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  views: number;
  readTime: number;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    content: { type: String, required: true },
    excerpt: { type: String, maxlength: 300 },
    featuredImage: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
      type: String,
      enum: ['Technology', 'Robotics', 'IoT', 'Automation', 'Electronics', 'Tutorials', 'News'],
      required: true,
    },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    publishedAt: { type: Date },
    views: { type: Number, default: 0 },
    readTime: { type: Number, default: 5 },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      keywords: { type: [String], default: [] },
    },
  },
  { timestamps: true },
);

blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ title: 'text', content: 'text' });

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

blogSchema.pre<IBlog>('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = generateSlug(this.title);
  }
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

const BlogModel: Model<IBlog> = mongoose.model<IBlog>('Blog', blogSchema);
export default BlogModel;

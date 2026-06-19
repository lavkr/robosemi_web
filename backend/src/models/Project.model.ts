import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  image: string;
  category: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  components: string[];
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    products: { type: [Schema.Types.ObjectId], ref: 'Product', default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
    seoTitle: { type: String },
    seoDescription: { type: String },
    tags: { type: [String], default: [] },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    estimatedTime: { type: String, required: true },
    components: { type: [String], default: [] },
  },
  { timestamps: true },
);

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

projectSchema.pre<IProject>('save', async function (next) {
  if (this.isNew && !this.slug) {
    const base = generateSlug(this.title);
    let slug = base;
    let counter = 1;
    while (await mongoose.models['Project']?.findOne({ slug })) {
      slug = `${base}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }
  next();
});

const ProjectModel: Model<IProject> = mongoose.model<IProject>('Project', projectSchema);
export default ProjectModel;

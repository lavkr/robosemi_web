import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ITraining extends Document {
  title: string;
  slug: string;
  description: string;
  image?: string;
  category: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  startDate: Date;
  endDate?: Date;
  price: number;
  instructor: string;
  instructorBio?: string;
  maxParticipants: number;
  currentParticipants: number;
  location: string;
  mode: 'online' | 'offline' | 'hybrid';
  prerequisites: string[];
  learningOutcomes: string[];
  createdBy: mongoose.Types.ObjectId;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const trainingSchema = new Schema<ITraining>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    image: { type: String },
    category: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    duration: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    price: { type: Number, required: true, min: 0 },
    instructor: { type: String, required: true },
    instructorBio: { type: String },
    maxParticipants: { type: Number, required: true },
    currentParticipants: { type: Number, default: 0 },
    location: { type: String, required: true },
    mode: { type: String, enum: ['online', 'offline', 'hybrid'], required: true },
    prerequisites: { type: [String], default: [] },
    learningOutcomes: { type: [String], default: [] },
    createdBy: { type: Schema.Types.ObjectId, required: true },
    isActive: { type: Boolean, default: true },
    seoTitle: { type: String },
    seoDescription: { type: String },
    tags: { type: [String], default: [] },
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

trainingSchema.pre<ITraining>('save', async function (next) {
  if (this.isNew && !this.slug) {
    const base = generateSlug(this.title);
    let slug = base;
    let counter = 1;
    while (await mongoose.models['Training']?.findOne({ slug })) {
      slug = `${base}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }
  next();
});

const TrainingModel: Model<ITraining> = mongoose.model<ITraining>('Training', trainingSchema);
export default TrainingModel;

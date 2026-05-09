import mongoose, { Schema } from 'mongoose';
import { IPackageDocument } from '../types';

// this schema defines the structure of a Package document in MongoDB, including fields for package details and validation rules. It also includes a pre-save hook to generate a unique packageId based on the count of existing packages.
const packageSchema = new Schema<IPackageDocument>(
  {
    packageId: {
      type: String,
      unique: true,
    },
    packageName: {
      type: String,
      required: [true, 'Package name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['General', 'Senior'],
    },
    numberOfClasses: {
      type: Schema.Types.Mixed,
      required: [true, 'Number of classes is required'],
      validate: {
        validator: (v: unknown) => [1, 4, 10, 'unlimited'].includes(v as number | string),
        message: 'Number of classes must be 1, 4, 10, or unlimited',
      },
    },
    classType: {
      type: String,
      required: [true, 'Class type is required'],
      enum: ['General', 'Special'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
  },
  { timestamps: true }
);

// pre-save hook to generate a unique packageId based on the count of existing packages
packageSchema.pre('save', async function () {
  if (this.packageId) return;
  const count = await mongoose.model('Package').countDocuments();
  this.packageId = `P${String(count + 1).padStart(5, '0')}`;
});

const Package = mongoose.model<IPackageDocument>('Package', packageSchema);

export default Package;

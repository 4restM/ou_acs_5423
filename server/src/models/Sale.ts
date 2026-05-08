import mongoose, { Schema } from 'mongoose';
import { ISaleDocument } from '../types';

const saleSchema = new Schema<ISaleDocument>(
  {
    saleId: {
      type: String,
      unique: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer is required'],
    },
    package: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
      required: [true, 'Package is required'],
    },
    paymentDate: {
      type: Date,
      required: [true, 'Payment date is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: ['cash', 'credit', 'check'],
    },
    validityStart: {
      type: Date,
      required: [true, 'Validity start date is required'],
    },
    validityEnd: {
      type: Date,
      required: [true, 'Validity end date is required'],
    },
    classesAwarded: {
      type: Number,
      required: true,
      min: [0, 'Classes awarded cannot be negative'],
    },
  },
  { timestamps: true },
);

saleSchema.pre('save', async function () {
  if (this.saleId) return;
  const count = await mongoose.model('Sale').countDocuments();
  this.saleId = `S${String(count + 1).padStart(5, '0')}`;
});

const Sale = mongoose.model<ISaleDocument>('Sale', saleSchema);

export default Sale;

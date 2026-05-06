import mongoose, { Schema } from 'mongoose';
import { ICustomerDocument } from '../types';

const customerSchema = new Schema<ICustomerDocument>(
  {
    customerId: {
      type: String,
      unique: true,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zip: { type: String, trim: true },
    },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    preferredCommunication: {
      type: String,
      enum: ['phone', 'email'],
      default: 'email',
    },
    classBalance: {
      type: Number,
      default: 0,
      min: [0, 'Class balance cannot be negative'],
    },
  },
  { timestamps: true },
);

customerSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

customerSchema.set('toJSON', { virtuals: true });
customerSchema.set('toObject', { virtuals: true });

customerSchema.pre('save', async function () {
  if (this.customerId) return;
  const count = await mongoose.model('Customer').countDocuments();
  this.customerId = `C${String(count + 1).padStart(5, '0')}`;
});

const Customer = mongoose.model<ICustomerDocument>('Customer', customerSchema);

export default Customer;

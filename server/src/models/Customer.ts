import mongoose, { Schema } from 'mongoose';
import { ICustomerDocument } from '../types';

// this schema defines the structure of a Customer document in MongoDB, including fields for customer details and validation
// rules. It also includes a pre-save hook to generate a unique customerId based on the count of existing customers.
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

// this model represents a Customer document in MongoDB
const Customer = mongoose.model<ICustomerDocument>('Customer', customerSchema);

export default Customer;

import mongoose, { Schema } from 'mongoose';
import { IInstructorDocument } from '../types';

const instructorSchema = new Schema<IInstructorDocument>(
  {
    instructorId: { type: String, unique: true },
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
  },
  { timestamps: true }
);

// Virtual property — not stored in the DB, computed on the fly
instructorSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Without these, virtuals don't show up in API responses
instructorSchema.set('toJSON', { virtuals: true });
instructorSchema.set('toObject', { virtuals: true });

const Instructor = mongoose.model<IInstructorDocument>(
  'Instructor',
  instructorSchema
);

export default Instructor;
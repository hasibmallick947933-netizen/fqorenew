const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    moduleNum: {
      type: String,
      default: 'Core Module 01',
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      default: 'Business Models',
      trim: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Executive', 'All Levels'],
      default: 'Executive',
    },
    duration: {
      type: String,
      default: '6.5 Hours Masterclass',
    },
    thumbnail: {
      type: String,
      default: '',
    },
    mediaUrl: {
      type: String,
      default: '/FQore_Trading_Blueprint.pdf',
    },
    syllabus: [
      {
        title: { type: String, required: true },
        description: { type: String, default: '' },
        duration: { type: String, default: '' },
      },
    ],
    deliverables: [
      {
        type: String,
        trim: true,
      },
    ],
    pricing: {
      starter: {
        price: { type: Number, default: 59 },
        features: [{ type: String }],
      },
      growth: {
        price: { type: Number, default: 99 },
        features: [{ type: String }],
      },
      premium: {
        price: { type: Number, default: 149 },
        features: [{ type: String }],
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

courseSchema.index({ active: 1, order: 1 });
courseSchema.index({ category: 1 });

module.exports = mongoose.model('Course', courseSchema);

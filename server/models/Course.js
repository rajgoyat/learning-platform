const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a course description'],
      trim: true,
    },
    concept: {
      type: String,
      required: [true, 'Please provide the course concept'],
      trim: true,
    },
    videoUrl: {
      type: String,
      trim: true,
      required: [true, 'Please provide a video URL for the course'],
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    teacherName: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Draft', 'Published'],
      default: 'Draft',
    },
    studentsEnrolled: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Course', courseSchema);

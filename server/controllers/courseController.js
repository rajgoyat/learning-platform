const Course = require('../models/Course');
const User = require('../models/User');

const buildCoursePayload = (course) => ({
  id: course._id,
  title: course.title,
  description: course.description,
  concept: course.concept,
  videoUrl: course.videoUrl,
  imageUrl: course.imageUrl,
  teacher: course.teacher,
  teacherName: course.teacherName,
  status: course.status,
  studentsEnrolled: course.studentsEnrolled,
  createdAt: course.createdAt,
  updatedAt: course.updatedAt,
});

exports.createCourse = async (req, res) => {
  try {
    const { title, description, concept, videoUrl, imageUrl, status } = req.body;

    if (!title || !description || !concept || !videoUrl) {
      return res.status(400).json({ message: 'Title, description, concept, and video URL are required' });
    }

    const teacher = await User.findById(req.userId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    if (teacher.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can create courses' });
    }

    const course = await Course.create({
      title,
      description,
      concept,
      videoUrl: videoUrl.trim(),
      imageUrl: imageUrl?.trim() || '',
      teacher: teacher._id,
      teacherName: teacher.name,
      status: status || 'Active',
    });

    res.status(201).json({
      success: true,
      course: buildCoursePayload(course),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses: courses.map(buildCoursePayload),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTeacherCourses = async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses: courses.map(buildCoursePayload),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      course: buildCoursePayload(course),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, concept, videoUrl, imageUrl, status } = req.body;

    // Find the course
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check authorization - only teacher who created course can update it
    if (course.teacher.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only update your own courses' });
    }

    // Validate required fields if provided
    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }
    if (description !== undefined && !description.trim()) {
      return res.status(400).json({ message: 'Description cannot be empty' });
    }
    if (concept !== undefined && !concept.trim()) {
      return res.status(400).json({ message: 'Concept cannot be empty' });
    }
    if (videoUrl !== undefined && !videoUrl.trim()) {
      return res.status(400).json({ message: 'Video URL cannot be empty' });
    }

    // Validate status if provided
    if (status !== undefined && !['Active', 'Draft', 'Published'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Active, Draft, or Published' });
    }

    // Build update object with only provided fields
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (concept !== undefined) updateData.concept = concept.trim();
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl.trim();
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl.trim();
    if (status !== undefined) updateData.status = status;

    // Update the course
    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course: buildCoursePayload(updatedCourse),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.publishCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the course
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check authorization
    if (course.teacher.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only publish your own courses' });
    }

    // Check if course has required fields to publish
    if (!course.title || !course.description || !course.concept || !course.videoUrl) {
      return res.status(400).json({ 
        message: 'Course must have title, description, concept, and video URL to publish' 
      });
    }

    // Update status to Published/Active
    const publishedCourse = await Course.findByIdAndUpdate(
      id,
      { status: 'Active' },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Course published successfully',
      course: buildCoursePayload(publishedCourse),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.teacher.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only delete your own courses' });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

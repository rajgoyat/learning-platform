const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createCourse,
  getAllCourses,
  getTeacherCourses,
  getCourseById,
  updateCourse,
  publishCourse,
  deleteCourse,
} = require('../controllers/courseController');

router.get('/', protect, getAllCourses);
router.get('/mine', protect, getTeacherCourses);
router.get('/:id', protect, getCourseById);
router.post('/', protect, createCourse);
router.patch('/:id', protect, updateCourse);
router.put('/:id/publish', protect, publishCourse);
router.delete('/:id', protect, deleteCourse);

module.exports = router;

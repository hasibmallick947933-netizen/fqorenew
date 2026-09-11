const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseBySlug,
  getAllCoursesAdmin,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public endpoints
router.get('/', getCourses);
router.get('/:slug', getCourseBySlug);

// Admin endpoints
router.get('/admin/all', protect, authorize('admin'), getAllCoursesAdmin);
router.post('/', protect, authorize('admin'), createCourse);
router.route('/:id')
  .put(protect, authorize('admin'), updateCourse)
  .delete(protect, authorize('admin'), deleteCourse);

module.exports = router;

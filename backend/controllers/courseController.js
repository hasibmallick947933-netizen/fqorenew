const Course = require('../models/Course');
const slugify = require('slugify');

// @desc    Get all active courses (Public)
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
  try {
    const { category, level } = req.query;
    const filter = { active: true };
    if (category) filter.category = category;
    if (level) filter.level = level;

    const courses = await Course.find(filter).sort({ order: 1, createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by slug
// @route   GET /api/courses/:slug
// @access  Public
exports.getCourseBySlug = async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug }).lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all courses including inactive (Admin)
// @route   GET /api/courses/admin/all
// @access  Private (Admin)
exports.getAllCoursesAdmin = async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ order: 1, createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Admin)
exports.createCourse = async (req, res, next) => {
  try {
    const {
      title,
      moduleNum,
      description,
      category,
      level,
      duration,
      thumbnail,
      mediaUrl,
      syllabus,
      deliverables,
      pricing,
      active,
      order,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide course title and description',
      });
    }

    let slug = slugify(title, { lower: true, strict: true });
    let existing = await Course.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const course = await Course.create({
      title,
      slug,
      moduleNum: moduleNum || 'Core Module',
      description,
      category: category || 'General',
      level: level || 'Executive',
      duration: duration || '5.0 Hours Masterclass',
      thumbnail: thumbnail || '',
      mediaUrl: mediaUrl || '/FQore_Trading_Blueprint.pdf',
      syllabus: Array.isArray(syllabus) ? syllabus : [],
      deliverables: Array.isArray(deliverables)
        ? deliverables
        : typeof deliverables === 'string'
        ? deliverables.split('\n').map((d) => d.trim()).filter(Boolean)
        : [],
      pricing: pricing || {
        starter: { price: 59, features: ['Core Course Dossier PDF', 'Web Reader Access'] },
        growth: { price: 99, features: ['Complete Course Suite', 'Excel Valuation Datasets', 'Case Study Autopsies'] },
        premium: { price: 149, features: ['All-Access Pass', 'Video Masterclasses', 'Direct Editorial Q&A'] },
      },
      active: active !== undefined ? Boolean(active) : true,
      order: Number(order) || 0,
    });

    res.status(201).json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Admin)
exports.updateCourse = async (req, res, next) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title, { lower: true, strict: true });
    }
    if (req.body.deliverables && typeof req.body.deliverables === 'string') {
      req.body.deliverables = req.body.deliverables.split('\n').map((d) => d.trim()).filter(Boolean);
    }

    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Admin)
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

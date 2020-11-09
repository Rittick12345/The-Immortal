const express = require('express');
const {
  getCourses,
  getCourse,
  addCourses,
  updateCourse,
  deleteCourse,
} = require('../controllers/courses');

const { protect } = require('../middleware/auth');

const advancedResults = require('../middleware/advancedResult');
const Course = require('../models/Course');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getCourses
  )
  .post(protect, addCourses);
router.route('/:id').get(getCourse).put(protect, updateCourse).delete(protect, deleteCourse);

module.exports = router;

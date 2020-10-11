const express = require('express');
const {
  getBootcamps,
  getBootcamp,
  createBootcamps,
  updateBootcamp,
  deleteBootcamp,
  getBootcampByRadius,
} = require('../controllers/bootcamps');

//setting the course router
const courseRouter = require('./courses');
const router = express.Router();

//adding the course router
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampByRadius);
router.route('/').get(getBootcamps).post(createBootcamps);
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);

module.exports = router;

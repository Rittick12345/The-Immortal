const express = require('express');
const {
  getBootcamps,
  getBootcamp,
  createBootcamps,
  updateBootcamp,
  deleteBootcamp,
  getBootcampByRadius,
  bootcampUploadPhoto,
} = require('../controllers/bootcamps');
const { protect } = require('../middleware/auth');

const advancedResult = require('../middleware/advancedResult');
const Bootcamp = require('../models/Bootcamp');
//setting the course router
const courseRouter = require('./courses');
const router = express.Router();

//adding the course router
router.use('/:bootcampId/courses', courseRouter);

router.route('/:id/photo').put(protect, bootcampUploadPhoto);

//get bootcamp by radious
router.route('/radius/:zipcode/:distance').get(getBootcampByRadius);

router
  .route('/')
  .get(advancedResult(Bootcamp, 'courses'), getBootcamps)
  .post(protect, createBootcamps);

router.route('/:id').get(getBootcamp).put(protect, updateBootcamp).delete(protect, deleteBootcamp);

module.exports = router;

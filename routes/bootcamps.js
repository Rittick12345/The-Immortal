const express = require('express');
const {
  getBootcamps,
  getBootcamp,
  createBootcamps,
  updateBootcamp,
  deleteBootcamp,
  getBootcampByRadius,
} = require('../controllers/bootcamps');
const router = express.Router();

router.route('/radius/:zipcode/:distance').get(getBootcampByRadius);
router.route('/').get(getBootcamps).post(createBootcamps);
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);

module.exports = router;

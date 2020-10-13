const mongoose = require('mongoose');
const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');

//routing                    /api/v1/bootcamps/:bootcampId/courses
//routing                    /api/v1/courses
//method                     GET
//access                     public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId }).populate('bootcamp');
    if (!query) {
      return next(
        new ErrorResponse(`The bootcamp id ${req.params.bootcampId} does not exists`, 400)
      );
    }
  } else {
    query = Course.find({}).populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }
  let courses = await query;
  res.status(200).json({ success: true, count: courses.length, data: courses });
});

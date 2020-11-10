const mongoose = require('mongoose');
const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResult');

//routing                    /api/v1/bootcamps/:bootcampId/courses
//routing                    /api/v1/courses
//method                     GET
//access                     public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const results = await Course.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//routing                    /api/v1/courses/:id
//method                     GET
//access                     public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    next(new ErrorResponse(`course not found with the id ${req.params.id}`, 404));
    return;
  }
  res.status(200).json({ success: true, data: course });
});

//routing                    /api/v1/bootcamps/:bootcampId/courses
//method                     POST
//access                     private
exports.addCourses = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    next(new ErrorResponse(`bootcamp not found with the id ${req.params.bootcampId}`, 400));
    return;
  }
  //only owner and admin can add a course
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `You ${req.user.id} are not authorized to add the course to bootcamp ${bootcamp.id}`,
        401
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({ success: true, data: course });
});

//routing                    /api/v1/courses/:id
//method                     PUT
//access                     private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    next(new ErrorResponse(`course not found with the id ${req.params.id}`, 404));
    return;
  }

  //only owner and admin can update a course
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`You ${req.user.id} are not authorized to update the course`, 401)
    );
  }
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: course });
});

//routing                    /api/v1/courses/:id
//method                     DELETE
//access                     private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    next(new ErrorResponse(`course not found with the id ${req.params.id}`, 404));
    return;
  }

  //only owner and admin can delete a course
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`You ${req.user.id} are not authorized to delete the course `, 401)
    );
  }
  course.remove();

  res.status(200).json({ success: true, data: course });
});

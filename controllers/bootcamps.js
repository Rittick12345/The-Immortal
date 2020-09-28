const mongoose = require('mongoose');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//routing                   /api/v1/bootcamps
//method                     GET
//access                     public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find({});
  res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
});
//routing                   /api/v1/bootcamp/:id
//method                     GET
//access                     public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(new ErrorResponse(`bootcamp not not be found with the id ${req.params.id}`, 404));
  }
  res.status(200).json({ success: true, data: bootcamp });
});
//routing                   /api/v1/bootcamps
//method                     POST
// access                    private

exports.createBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(200).json({ success: true, data: bootcamp });
});
//routing                   /api/v1/bootcamps/:id
//method                     PUT
//access                     private

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(new ErrorResponse(`bootcamp not found with id ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
    msg: `updating a bootcamp ${req.params.id}`,
  });
});

//routing                   /api/v1/bootcamps
//method                     DELETE
//access                     private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(new ErrorResponse(`bootcamp not found with id ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: {},
    msg: `deleting the bootcamp ${req.params.id}`,
  });
});

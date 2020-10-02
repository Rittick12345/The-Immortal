const mongoose = require('mongoose');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

//routing                   /api/v1/bootcamps
//method                     GET
//access                     public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  let queryStr = JSON.stringify(req.query);

  queryStr = queryStr.replace(/\b(gt|lt|gte|lte|in)\b/g, (match) => `$${match}`);

  query = Bootcamp.find(JSON.parse(queryStr));
  const bootcamps = await query;
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

//routing                   /api/v1/bootcamps/radius/:zipcode/:distance
//method                     GET
//access                     public

exports.getBootcampByRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  const loc = await geocoder.geocode(zipcode);

  //getting lat and lng of the given zipcode
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  const radius = distance / 3963; //earth's radius is 3963 miles
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

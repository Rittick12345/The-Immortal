const mongoose = require('mongoose');
const path = require('path');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

//routing                   /api/v1/bootcamps
//method                     GET
//access                     public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  let reqQuery = { ...req.query };

  //deleting the fields from request query
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach((params) => delete reqQuery[params]);

  //calculating the average cost with '$'
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|lt|gte|lte|in)\b/g, (match) => `$${match}`);

  query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

  //selecting certain fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  //sorting certain fields
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  //pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const bootcamps = await query;
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  res.status(200).json({ success: true, count: bootcamps.length, pagination, data: bootcamps });
});

//routing                   /api/v1/bootcamp/:id
//method                     GET
//access                     public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id).populate('courses');
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

//routing                   /api/v1/bootcamps/:id
//method                     DELETE
//access                     private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  console.log(req.params.id);
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(new ErrorResponse(`bootcamp not found with id ${req.params.id}`, 404));
  }
  bootcamp.remove();
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

//routing                   /api/v1/bootcamps/:id/photo
//method                     PUT
//access                     private

exports.bootcampUploadPhoto = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(new ErrorResponse(`bootcamp not found with id ${req.params.id}`, 404));
  }
  console.log(req.files);
  const file = req.files.file;
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`Max limit of photo is ${process.env.MAX_FILE_UPLOAD}`, 400));
  }
  file.name = `image_${req.params.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      return next(new ErrorResponse(`Internal server problem`, 500));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
  });
  res.status(200).json({ success: true, image: file.name });
});

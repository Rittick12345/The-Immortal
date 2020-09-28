const mongoose = require('mongoose');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');

//routing                   /api/v1/bootcamps
//method                     GET
//access                     public

exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find({});
    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (err) {
    next(err);
  }
};
//routing                   /api/v1/bootcamp/:id
//method                     GET
//access                     public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return next(new ErrorResponse(`bootcamp not not be found with the id ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    next(err);
  }
};
//routing                   /api/v1/bootcamps
//method                     POST
// access                    private

exports.createBootcamps = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    next(err);
  }
};
//routing                   /api/v1/bootcamps/:id
//method                     PUT
//access                     private

exports.updateBootcamp = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

//routing                   /api/v1/bootcamps
//method                     DELETE
//access                     private

exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return next(new ErrorResponse(`bootcamp not found with id ${req.params.id}`, 404));
    }
    res.status(200).json({
      success: true,
      data: {},
      msg: `deleting the bootcamp ${req.params.id}`,
    });
  } catch (err) {
    next(err);
  }
};

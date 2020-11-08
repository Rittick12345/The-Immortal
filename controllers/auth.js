const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//routing                   /api/v1/auth/register
//method                     POST
//access                     public
exports.register = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true });
});

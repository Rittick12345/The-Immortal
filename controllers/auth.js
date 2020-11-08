const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//routing                   /api/v1/auth/register
//method                     POST
//access                     public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({ name, password, email, role });
  const token = user.getSignedJwtToken(); //as we using methods, so it is on instance

  res.status(200).json({ success: true, token });
});

//routing                   /api/v1/auth/login
//method                     POST
//access                     public

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please include email and password', 400));
  }

  //finding the user from database
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  //matching entered password with database password
  const ismatch = await user.matchPassword(password);
  if (!ismatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const token = user.getSignedJwtToken(); //as we using methods, so it is on instance

  res.status(200).json({ success: true, token });
});

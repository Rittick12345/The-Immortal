const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { protect } = require('../middleware/auth');

//routing                   /api/v1/auth/register
//method                     POST
//access                     public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({ name, password, email, role });
  getTokenResponse(user, 200, res);
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

  getTokenResponse(user, 200, res);
});

//sending the token and setting the cookie from a middleware function
const getTokenResponse = asyncHandler((user, statuscode, res) => {
  //creating the token
  const token = user.getSignedJwtToken();

  const option = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 3600 * 1000),
    httpOnly: true,
  };
  if ((process.env.NODE_ENV = 'production')) {
    option.secure = true;
  }
  res.status(statuscode).cookie('token', token, option).json({ success: true, token });
});

//routing                   /api/v1/auth/me
//method                     GET
//access                     private

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ data: user });
});

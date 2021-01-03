const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { protect } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmails');
const crypto = require('crypto');

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

//routing                   /api/v1/auth/me
//method                     GET
//access                     private

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ data: user });
});

//routing                   /api/v1/auth/forgotpassword
//method                     POST
//access                     public

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse(`The user does not exist with this email`, 400));
  }
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });
  const url = `${req.protocol}//${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email for reset password request, so please visit the url ${url}`;
  try {
    await sendEmail({
      email: user.email,
      subject: `Reset password request`,
      message,
    });
  } catch (error) {
    console.log(error);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse(`Email could not be sent`, 500));
  }
  res.status(200).json({ success: true, data: 'Email sent' });
});

//routing                   /api/v1/auth/resetpassword/:resettoken
//method                     PUT
//access                     public

exports.resetPassword = asyncHandler(async (req, res, next) => {
  //mail and url has received so updating the new password
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  let user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
  if (!user) {
    return next(new ErrorResponse(`invalid reset token`, 400));
  }

  //set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  getTokenResponse(user, 200, res);
});

//routing                   /api/v1/auth/updatedetails
//method                     PUT
//access                     private

exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
});

/*//routing                   /api/v1/auth/updatepassword
//method                     PUT
//access                     private

exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
});*/

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

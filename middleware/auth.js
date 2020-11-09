const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  //extracting the token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  /*
    else if(req.cookies.token){
        token = req.cookies.token;
    }
    */
  if (!token) {
    return next(new ErrorResponse('you are unauthorized to access', 401));
  }
  //extracting the payload from token and verifying token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    console.log(error);
    return next(new ErrorResponse('you are unauthorized to access this route', 401));
  }
});

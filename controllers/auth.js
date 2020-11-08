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

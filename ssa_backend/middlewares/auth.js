const User = require('../modals/Users');
const B2BUser = require('../modals/B2BUser');
const B2CUser = require('../modals/B2CUser');
const CaptureError = require('../utils/CaptureError');
const TokenService = require('../utils/TokenService');
const httpStatus = require('../utils/configs/httpStatus');
const catchAsync = require('./catchAsync');

const auth = (userType) =>
  catchAsync(async (req, res, next) => {
    const phone = req.headers['x-user-phone'];
    const currentUserType = req.headers['x-user-type'] || userType;

    const secret = process.env.JWT_TOKEN_SECRET;
    let token = null;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader?.startsWith('Bearer')) token = authHeader.split(' ')[1];

    switch (currentUserType) {
      case 'b2b': {
        if (!token) {
          const message = 'Token not found in the request headers!';
          throw new CaptureError(message, httpStatus.BAD_REQUEST);
        }

        const payload = TokenService.verifyToken(token, secret);
        const user = await B2BUser.findById(payload._id);

        if (!user) {
          const message = 'User not found! Please login again';
          throw new CaptureError(message, httpStatus.BAD_REQUEST);
        }

        req.userType = 'b2b';
        req.user = user;

        break;
      }
      case 'b2c': {
        if (!token) {
          const message = 'Token not found in the request headers!';
          throw new CaptureError(message, httpStatus.BAD_REQUEST);
        }

        const payload = TokenService.verifyToken(token, secret);
        const user = await B2CUser.findById(payload._id);

        if (!user) {
          const message = 'User not found! Please login again';
          throw new CaptureError(message, httpStatus.BAD_REQUEST);
        }

        req.userType = 'b2c';
        req.user = user;

        break;
      }

      case 'basic': {
        if (!phone) {
          const message = 'Please provide phone number for the basic user.';
          throw new CaptureError(message, httpStatus.BAD_REQUEST);
        }

        const user = await User.findOne({ phone_number: phone });

        if (!user) {
          const message = 'User not found! Please login again';
          throw new CaptureError(message, httpStatus.BAD_REQUEST);
        }

        req.userType = 'basic';
        req.user = user;

        break;
      }

      default: {
        throw new CaptureError(
          'Please provide valid user type.',
          httpStatus.BAD_REQUEST
        );
      }
    }

    next();
  });

module.exports = auth;

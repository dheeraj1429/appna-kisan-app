const { isValidObjectId } = require('mongoose');
const catchAsync = require('../middlewares/catchAsync');
const CaptureError = require('../utils/CaptureError');
const httpStatus = require('../utils/configs/httpStatus');
const B2BUser = require('../modals/B2BUser');

/**
 * @author  Sam
 * @route   /b2b/user/:userId/approval
 * @method  PATCH
 * @access  Protected - (Not implemented)
 * @desc    Approve B2B user by setting 'is_approved' field to true.
 */
const approveB2bUser = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  if (!isValidObjectId(userId))
    throw new CaptureError('Invalid B2B user ID', httpStatus.BAD_REQUEST);

  const user = await B2BUser.updateOne(
    { _id: userId },
    { $set: { is_approved: true } }
  );

  if (!user.matchedCount) {
    const message = `User with id ${userId} not found`;
    throw new CaptureError(message, httpStatus.BAD_REQUEST);
  }

  if (!user.modifiedCount) {
    const message =
      'Could not approve this B2B user at this moment please try again later.';
    throw new CaptureError(message);
  }

  return res.json({
    success: true,
    message: 'B2B User verification has been complete now!',
  });
});

module.exports = {
  approveB2bUser,
};

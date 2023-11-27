const { isValidObjectId, default: mongoose } = require('mongoose');
const catchAsync = require('../middlewares/catchAsync');
const CaptureError = require('../utils/CaptureError');
const httpStatus = require('../utils/configs/httpStatus');
const B2BUser = require('../modals/B2BUser');

const getAllB2bUsers = catchAsync(async (req, res, next) => {
  const { page } = req.query
  if(!page) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Page number is required!'
    })
  }

  const DOCUMENT_LIMIT = 30;
  const countDocuments = await B2BUser.countDocuments()
  const allUsers = await B2BUser.find({}, { is_approved: 1, company_name: 1, owner_name: 1, email: 1, mobile: 1 }).skip(page * DOCUMENT_LIMIT)
  .limit(DOCUMENT_LIMIT);

    if (allUsers) {
      return res.status(httpStatus.OK).json({
        success: true,
        totalDocuments: countDocuments,
        totalPages: Math.ceil(countDocuments / DOCUMENT_LIMIT - 1),
        page: +page,
        data: allUsers,
      });
    }

    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'No document found!',
   });
})

const getSingleB2bUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params
  if(!userId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Please provide a user id'
    })
  }

  if(!mongoose.isValidObjectId(userId)) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Please provide a valid user id'
    })
  }

  const findUserDocuments = await B2BUser.findOne({_id: userId}, { password:0, updatedAt: 0, __v: 0 })
  if (findUserDocuments) {
    return res.status(httpStatus.OK).json({
      success: true,
      data: findUserDocuments,
    });
  }

  return res.status(httpStatus.BAD_REQUEST).json({
    success: false,
    message: 'No document found!',
 });
})

/**
 * @author  Sam
 * @route   /b2b/user/:userId/approval
 * @method  PATCH
 * @access  Protected - (Not implemented)
 * @desc    Approve B2B user by setting 'is_approved' field to true.
 */
const approveB2bUser = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const {is_approved} = req.body;

  if (!isValidObjectId(userId))
    throw new CaptureError('Invalid B2B user ID', httpStatus.BAD_REQUEST);

  const user = await B2BUser.updateOne(
    { _id: userId },
    { $set: { is_approved } }
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
  getAllB2bUsers,
  getSingleB2bUser,
  approveB2bUser,
};

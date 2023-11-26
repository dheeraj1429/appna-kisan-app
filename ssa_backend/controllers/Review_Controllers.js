const catchAsync = require('../middlewares/catchAsync');
const httpStatus = require('../utils/configs/httpStatus');
const CaptureError = require('../utils/CaptureError');
const Review = require('../modals/Review');
const { verifyReviewData } = require('../validations/review');
const Products = require('../modals/Products');

const createReview = catchAsync(async (req, res, next) => {
  const userType = req.userType;
  const user = req.user;

  const { data, error } = await verifyReviewData(req.body);
  if (error)
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: error.message,
      error,
    });

  const productExist = await Products.findOne({ _id: data.product });

  if (!productExist)
    throw new CaptureError('Product not found', httpStatus.NOT_FOUND);

  const reviewData = {
    ...data,
    user: user._id,
  };

  switch (userType) {
    case 'b2b': {
      reviewData.user_type = 'B2BUsers';

      break;
    }

    case 'b2c': {
      reviewData.user_type = 'B2CUsers';

      break;
    }

    case 'basic': {
      reviewData.user_type = 'Users';

      break;
    }

    default: {
      throw new CaptureError(
        'Something went wrong',
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  const newReview = new Review(reviewData);
  await newReview.save();

  return res.status(httpStatus.CREATED).json({
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Your review has been posted!',
    review: newReview,
  });
});

module.exports = { createReview };

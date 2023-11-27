const { isValidObjectId } = require('mongoose');
const User = require('../modals/Users');
const B2BUser = require('../modals/B2BUser');
const B2CUser = require('../modals/B2CUser');
const Products = require('../modals/Products');
const RewardOrder = require('../modals/RewardOrder');
const httpStatus = require('../utils/configs/httpStatus');
const CaptureError = require('../utils/CaptureError');
const catchAsync = require('../middlewares/catchAsync');
const withTransaction = require('../utils/withTransaction');
const generateOrderId = require('order-id')('key');

/**
 * @author  Sam
 * @route   /all/reward/products
 * @method  GET
 * @access  Public
 * @desc    Get list of products which can be bought using reward points.
 */
const getRewardPointsRedeemableProducts = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  const productsRes = await Products.aggregate([
    {
      $match: {
        product_collected_points: { $ne: null },
      },
    },
    {
      $facet: {
        count: [{ $count: 'count' }],
        products: [
          {
            $skip: (page - 1) * 10,
          },
          {
            $limit: pageSize,
          },
        ],
      },
    },
  ]);

  const products = productsRes?.[0]?.products || [];
  const totalResults = productsRes?.[0]?.count?.[0]?.count ?? 0;

  return res.json({
    success: true,
    statusCode: httpStatus.OK,
    page,
    pageSize,
    totalResults,
    products,
  });
});

/**
 * @author  Sam
 * @route   /app/cart/checkout/for/rewards/products
 * @method  POST
 * @access  Protected
 * @desc    Place a reward order.
 */
const cartCheckout = catchAsync(async (req, res, next) => {
  const userType = req.userType;
  const user = req.user;
  const productId = req.body.productId;

  if (!isValidObjectId(productId))
    throw new CaptureError('Invalid product id!', httpStatus.BAD_REQUEST);

  // Fetch product details.
  const product = await Products.findById(productId);

  if (!product)
    throw new CaptureError('Product not found!', httpStatus.NOT_FOUND);

  // Check if the product can be bought using reward points.
  if (!product.product_collected_points) {
    const message = 'This product can not be bought with rewards points!';
    throw new CaptureError(message, httpStatus.NOT_FOUND);
  }

  // Fetch the details of the user and check if he has enough reward points to buy the product.
  const userRewardPoints = user.reward_points ?? 0;
  if (userRewardPoints < product.product_collected_points) {
    const message = 'You do not have enough reward points to buy this product!';
    throw new CaptureError(message, httpStatus.BAD_REQUEST);
  }

  let order = {
    order_id: generateOrderId.generate(),
    buyer: user._id,
    reward_point_price: product.product_collected_points,
    product: {
      product_id: product.product_id,
      product_code: product.product_code,
      product_name: product.product_name,
      product_sub_category: product.product_subcategory,
      product_category: product.product_category,
      product_main_category: product.product_main_category,
      quantityBought: 1,
      b2b_user_product_price: product.b2b_user_product_price ?? null,
      b2c_user_product_price: product.b2c_user_product_price ?? null,
      product_images: product.product_images,
    },
  };

  const updateResult = await withTransaction(async (session) => {
    let updateRes = null;
    const updateQuery = [
      { _id: user._id },
      {
        $inc: {
          reward_points: -product.product_collected_points,
        },
      },
      { session },
    ];

    // Switch to the appropriate user. Deduct the reward points from the appropriate user.
    switch (userType) {
      case 'b2b': {
        order.buyer_type = 'B2BUsers';
        updateRes = await B2BUser.updateOne(...updateQuery);

        break;
      }

      case 'b2c': {
        order.buyer_type = 'B2CUsers';
        updateRes = await B2CUser.updateOne(...updateQuery);

        break;
      }

      case 'basic': {
        order.buyer_type = 'Users';
        updateRes = await User.updateOne(...updateQuery);

        break;
      }

      default: {
        throw new CaptureError(
          'Something went wrong',
          httpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }

    // Save the order.
    const newOrder = new RewardOrder(order);
    await newOrder.save({ session });

    return updateRes;
  });

  if (!updateResult?.modifiedCount) {
    const message = 'Could not place order! Please try again later';
    throw new CaptureError(message, httpStatus.INTERNAL_SERVER_ERROR);
  }

  return res.json({
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Order created successfully!',
    order,
  });
});

module.exports = { getRewardPointsRedeemableProducts, cartCheckout };

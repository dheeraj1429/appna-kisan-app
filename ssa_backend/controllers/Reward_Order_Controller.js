const catchAsync = require('../middlewares/catchAsync');
const Utils = require('../utils/Utils');
const httpStatus = require('../utils/configs/httpStatus');
const CaptureError = require('../utils/CaptureError');
const Products = require('../modals/Products');

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

module.exports = { getRewardPointsRedeemableProducts };

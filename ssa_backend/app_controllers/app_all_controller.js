const Brands_Schema = require('../modals/Brands');
const Order_Schema = require('../modals/Orders');
const Products_Schema = require('../modals/Products');
const Users_Schema = require('../modals/Users');
const Banners_Schema = require('../modals/Banners');
const Enquiry_Schema = require('../modals/Enquiry');
const Utils = require('../utils/Utils');
const { v4: uuidv4 } = require('uuid');
const generateOrderId = require('order-id')('key');
const { verifyB2BAccountData } = require('../validations/b2bUser');
const { verifyB2CAccountData } = require('../validations/b2cUser');
const catchAsync = require('../middlewares/catchAsync');
const httpStatus = require('../utils/configs/httpStatus');
const B2BUser = require('../modals/B2BUser');
const B2CUser = require('../modals/B2CUser');
const TokenService = require('../utils/TokenService');
const CaptureError = require('../utils/CaptureError');

// all brands screen api
const showAllBrands = async (req, res) => {
  try {
    const allBrands = await Brands_Schema.aggregate([
      {
        $group: {
          _id: '$main_category_name',
          categories: {
            $push: {
              category_id: '$_id',
              brandName: '$category_name',
              brandImage: '$category_image',
            },
          },
        },
      },
    ]).sort({ _id: 1 });
    console.log(allBrands);
    res.status(200).send(allBrands);
  } catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong !!');
  }
};

// brands for home screen
const brandsForHomeScreen = async (req, res) => {
  try {
    const allBrandsForHomeScreen = await Brands_Schema.aggregate([
      {
        $group: {
          _id: '$main_category_name',
          brands: {
            $push: {
              category_id: '$_id',
              brandName: '$category_name',
              brandImage: '$category_image',
            },
          },
        },
      },
      { $project: { _id: 1, brands: { $slice: ['$brands', 7] } } },
    ]).sort({ _id: 1 });
    console.log(allBrandsForHomeScreen);
    res.status(200).send(allBrandsForHomeScreen);
  } catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong !!');
  }
};

// get all brands for search suggestions
const getAllBrands = async (req, res) => {
  try {
    const allBrands = await Brands_Schema.aggregate([
      { $group: { _id: '$main_category_name' } },
    ]).sort({ _id: 1 });
    res.status(200).send(allBrands);
  } catch (err) {
    console.log(err);
    res.status(500).send('Something went wroog !!');
  }
};

// get brands sub category & related products
const brandsSubCategoryAndProducts = async (req, res) => {
  const brandId = req.query.brand_id;
  const brandName = req.query.brand_name;
  try {
    const findBrandSubcategory = await Brands_Schema.find({ _id: brandId })
      .sort({ createdAt: -1 })
      .slice({ subcategory: 7 })
      .limit(7);
    console.log(findBrandSubcategory);
    const findProducts = await Products_Schema.find({
      product_category: brandName,
    })
      .sort({ createdAt: -1 })
      .select(
        'product_id product_name new_arrival product_images product_main_category product_category product_subcategory product_variant product_description product_code'
      )
      .limit(10);
    console.log('PRODUCTS=>', findProducts);
    if (findProducts?.length <= 15) {
      const findMoreProducts = await Products_Schema.find({}).select(
        'product_id product_name new_arrival product_images product_main_category product_category product_subcategory product_variant product_description product_code'
      );
    }
    res
      .status(200)
      .send({ subcategory: findBrandSubcategory, products: findProducts });
  } catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong !!');
  }
};

// get product by id
const getProductById = async (req, res) => {
  const productId = req.params.product_id;
  try {
    if (!productId) {
      return res
        .status(404)
        .send({ status: false, message: 'product not found !!' });
    }

    const findProduct = await Products_Schema.findById(productId).select(
      'product_id color size product_name product_images product_main_category product_category product_subcategory product_variant product_description product_code cartoon_total_products'
    );
    if (!findProduct) {
      return res
        .status(404)
        .send({ status: false, message: 'product not found !!' });
    }
    res.status(200).send(findProduct);
  } catch (err) {
    console.log(er);
    res.status(500).send('Somwthing went wrong !!');
  }
};

// search in products api
const searchProducts = async (req, res) => {
  const search = req.query.search_by;
  const searchBySubCategory = req.query.subcategory;
  const searchByCategory = req.query.category;
  const searchByBrandCategory = req.query.brand_category?.trim();
  const productTag = req.query.product_tag;
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  console.log('REQUEST->', req.query);
  let result;
  let count;
  try {
    if (
      !search &&
      !searchBySubCategory &&
      !searchByCategory &&
      !searchByBrandCategory
    ) {
      res.status(404).send({ status: false, message: 'not found !!' });
      return;
    }
    // =========== SEARCH BY TEXT INPUT AND SELECTED PRODUCT TAG ===========
    if (search?.length && productTag) {
      const searchRegex = Utils.createRegex(search);
      result = await Products_Schema.find({
        product_name: { $regex: searchRegex },
        product_tag: productTag,
      })
        .select(
          'product_id product_name new_arrival product_images product_main_category product_category product_subcategory product_variant product_description product_code'
        )
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
      count = await Products_Schema.find({
        product_name: { $regex: searchRegex },
        product_tag: productTag,
      }).count();

      if (!result.length > 0) {
        result = await Products_Schema.find({
          product_code: { $regex: searchRegex },
          product_tag: productTag,
        })
          .select(
            'product_id product_name new_arrival product_images product_main_category product_category product_subcategory product_variant product_description product_code'
          )
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip((page - 1) * limit);
        count = await Products_Schema.find({
          product_code: { $regex: searchRegex },
          product_tag: productTag,
        }).count();
      }
      //    console.log("Result normal search=>",result)
      return res.status(200).send({ result, pages: Math.ceil(count / limit) });
    }
    // =========== SEARCH BY TEXT INPUT AND SELECTED PRODUCT TAG ===========

    // ========== SEARCH BY SUB CATEGORY AND SELECTED PRODUCT TAG ===========
    if (searchBySubCategory && productTag) {
      const searchBySubCategoryObj = JSON.parse(searchBySubCategory);
      // console.log('NEW OBJ',searchBySubCategoryObj)
      // const searchBySubCategoryRegex = Utils.createRegex(searchBySubCategoryObj?.sub_category);
      result = await Products_Schema.find({
        product_main_category: searchBySubCategoryObj.main_category,
        product_category: searchBySubCategoryObj.category,
        product_subcategory: searchBySubCategoryObj.sub_category,
        product_tag: productTag,
      })
        .select(
          'product_id product_name new_arrival product_images product_main_category product_category product_subcategory product_variant product_description product_code'
        )
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
      console.log('Result Sub category=>', result);
      count = await Products_Schema.find({
        product_main_category: searchBySubCategoryObj.main_category,
        product_category: searchBySubCategoryObj.category,
        product_subcategory: searchBySubCategoryObj.sub_category,
        product_tag: productTag,
      }).count();
      console.log('count', count);
      return res.status(200).send({ result, pages: Math.ceil(count / limit) });
    }
    // ========== SEARCH BY SUB CATEGORY AND SELECTED PRODUCT TAG ===========

    // ========== SEARCH BY CATEGORY AND SELECTED PRODUCT TAG ==========
    if (searchByCategory && productTag) {
      console.log('MAIN CATEGORY and productTag SEARCH');
      const searchByCategoryRegex = Utils.createRegex(searchByCategory);
      result = await Products_Schema.find({
        product_main_category: { $regex: searchByCategoryRegex },
        product_tag: productTag,
      })
        .select(
          'product_id product_name new_arrival product_images product_main_category product_category product_subcategory product_variant product_description product_code'
        )
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
      //    console.log("Result Category=>",result)
      count = await Products_Schema.find({
        product_main_category: searchByCategory,
        product_tag: productTag,
      }).count();
      // console.log("Count -> category=",count)
      return res.status(200).send({ result, pages: Math.ceil(count / limit) });
    }
    // ========== SEARCH BY CATEGORY AND SELECTED PRODUCT TAG ==========

    //==========  SEARCH BY BRAND CATEGORY AND SELECTED PRODUCT TAG ==========
    if (searchByBrandCategory && productTag) {
      console.log('CATEGORY and productTag SEARCH ');
      const searchByBrandCategoryRegex = Utils.createRegex(
        searchByBrandCategory
      );
      result = await Products_Schema.find({
        product_category: { $regex: searchByBrandCategoryRegex },
        product_tag: productTag,
      })
        .select(
          'product_id product_name new_arrival product_images product_main_category product_category product_subcategory product_variant product_description product_code'
        )
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
      count = await Products_Schema.find({
        product_category: searchByBrandCategory,
        product_tag: productTag,
      }).count();
      return res.status(200).send({ result, pages: Math.ceil(count / limit) });
    }
    //==========  SEARCH BY BRAND CATEGORY AND SELECTED PRODUCT TAG ==========

    //  SEARCH BY TEXT INPUT
    if (search?.length) {
      const searchRegex = Utils.createRegex(search);
      result = await Products_Schema.find({
        product_name: { $regex: searchRegex },
      })
        .select(
          'product_id product_name new_arrival product_images product_main_category product_category product_subcategory product_variant product_description product_code'
        )
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
      count = await Products_Schema.find({
        product_name: { $regex: searchRegex },
      }).count();

      if (!result.length > 0) {
        result = await Products_Schema.find({
          product_code: { $regex: searchRegex },
        })
          .select(
            'product_id product_name new_arrival product_images product_main_category product_category product_subcategory product_variant product_description product_code'
          )
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip((page - 1) * limit);
        count = await Products_Schema.find({
          product_code: { $regex: searchRegex },
        }).count();
      }
      //    console.log("Result normal search=>",result)
      return res.status(200).send({ result, pages: Math.ceil(count / limit) });
    }
    //  SEARCH BY SUB CATEGORY
    if (searchBySubCategory) {
      const searchBySubCategoryObj = JSON.parse(searchBySubCategory);
      // console.log("SUB CATEGORY SEARCH--->",'parent',searchBySubCategory?.main_category,"cat",searchBySubCategory?.category,searchBySubCategory?.sub_category)
      // console.log('NEW',JSON.parse(searchBySubCategory))
      console.log('NEW OBJ', searchBySubCategoryObj);
      const searchBySubCategoryRegex = Utils.createRegex(
        searchBySubCategoryObj?.sub_category
      );
      result = await Products_Schema.find({
        product_main_category: searchBySubCategoryObj.main_category,
        product_category: searchBySubCategoryObj.category,
        product_subcategory: searchBySubCategoryObj.sub_category,
      })
        .select(
          'product_id product_name new_arrival product_images product_main_category product_category product_subcategory product_variant product_description product_code'
        )
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
      console.log('Result Sub category=>', result);
      count = await Products_Schema.find({
        product_main_category: searchBySubCategoryObj.main_category,
        product_category: searchBySubCategoryObj.category,
        product_subcategory: searchBySubCategoryObj.sub_category,
      }).count();
      console.log('count', count);
      return res.status(200).send({ result, pages: Math.ceil(count / limit) });
    }
    //  SEARCH BY CATEGORY
    if (searchByCategory) {
      console.log('MAIN CATEGORY SEARCH');
      const searchByCategoryRegex = Utils.createRegex(searchByCategory);
      result = await Products_Schema.find({
        product_main_category: { $regex: searchByCategoryRegex },
      })
        .select(
          'product_id product_name new_arrival product_images product_main_category product_category product_subcategory product_variant product_description product_code'
        )
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
      //    console.log("Result Category=>",result)
      count = await Products_Schema.find({
        product_main_category: searchByCategory,
      }).count();
      // console.log("Count -> category=",count)
      return res.status(200).send({ result, pages: Math.ceil(count / limit) });
    }
    //  SEARCH BY BRAND CATEGORY
    if (searchByBrandCategory) {
      console.log('CATEGORY SEARCH');
      const searchByBrandCategoryRegex = Utils.createRegex(
        searchByBrandCategory
      );
      result = await Products_Schema.find({
        product_category: { $regex: searchByBrandCategoryRegex },
      })
        .select(
          'product_id product_name new_arrival product_images product_main_category product_category product_subcategory product_variant product_description product_code'
        )
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
      //    console.log("Result Category=>",result)
      count = await Products_Schema.find({
        product_category: searchByBrandCategory,
      }).count();
      // console.log("Count -> category=",count)
      return res.status(200).send({ result, pages: Math.ceil(count / limit) });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('something went wrong !!');
  }
};

// FILTER FOR SEARCH PRODUCTS
const filterForProducts = async (req, res) => {
  const searchBySubCategory = req.query.subcategory;
  // console.log("searchBySubCategory",searchBySubCategory)
  try {
    if (searchBySubCategory) {
      const searchBySubCategoryObj = JSON.parse(searchBySubCategory);
      const getAllProductTags = await Products_Schema.aggregate([
        {
          $match: {
            product_main_category: searchBySubCategoryObj?.main_category,
            product_category: searchBySubCategoryObj?.category,
            product_subcategory: searchBySubCategoryObj?.sub_category,
          },
        },
        { $group: { _id: '$product_tag' } },
      ]).sort({ _id: 1 });
      // console.log("INSIDE",getAllProductTags)
      return res.status(200).send(getAllProductTags);
    }
    const getAllProductTags = await Products_Schema.aggregate([
      { $group: { _id: '$product_tag' } },
    ]).sort({ _id: 1 });
    // console.log("OUT SIDE",getAllProductTags)
    res.status(200).send(getAllProductTags);
  } catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong !!');
  }
};

// GET NEW ARRIVALS PRODUCTS
const getNewArrivalProducts = async (req, res) => {
  const searchForNewArrival = req.query.category;
  const brandCategory = req.query.brand_category;
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  // console.log(searchForNewArrival)
  let result;
  let count;
  try {
    //  SEARCH FOR NEW ARRIVALS
    const searchRegex = Utils.createRegex(searchForNewArrival);
    const searchRegexBrandCategory = Utils.createRegex(brandCategory);

    if (searchForNewArrival?.length && brandCategory != undefined) {
      result = await Products_Schema.find({
        product_main_category: { $regex: searchRegex },
        product_category: { $regex: searchRegexBrandCategory },
        new_arrival: true,
      })
        .select(
          'product_id product_name product_images new_arrival product_main_category product_category product_subcategory product_variant product_description product_code'
        )
        .sort({ updatedAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
      //    console.log("Result Category=>",result)
      count = await Products_Schema.find({
        product_main_category: searchForNewArrival,
        product_category: { $regex: searchRegexBrandCategory },
        new_arrival: true,
      }).count();
      // console.log("Count -> category=",count)
      return res.status(200).send({ result, pages: Math.ceil(count / limit) });
    } else {
      result = await Products_Schema.find({
        product_main_category: { $regex: searchRegex },
        new_arrival: true,
      })
        .select(
          'product_id product_name product_images new_arrival product_main_category product_category product_subcategory product_variant product_description product_code'
        )
        .sort({ updatedAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
      //    console.log("Result Category=>",result)
      count = await Products_Schema.find({
        product_main_category: searchForNewArrival,
        new_arrival: true,
      }).count();
      // console.log("Count -> category=",count)
      res.status(200).send({ result, pages: Math.ceil(count / limit) });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('something went wrong !!');
  }
};

// get category for new arrivals filter
const getBrandCategory = async (req, res) => {
  const brandName = req.params.brand_name;
  try {
    if (!brandName)
      return res
        .status(404)
        .send({ status: false, message: 'not found brands !!' });
    const findBrand = await Brands_Schema.find({
      main_category_name: brandName,
    }).select(' category_name ');
    if (!findBrand)
      return res
        .status(404)
        .send({ status: false, message: 'not found brands !!' });
    res
      .status(200)
      .send({ status: true, result: findBrand, message: 'success !!' });
  } catch (err) {}
};

// Cart Checkout
const cartCheckout = async (req, res) => {
  // console.log(req.body);
  try {
    const getOrdersCount = await Order_Schema.find().count();
    // console.log("order_00"+(getOrdersCount+1))
    const ordersCustomId = 'order_00' + (getOrdersCount + 1);
    const getOrderId = 'order-' + generateOrderId.generate(); //ordersCustomId
    console.log(getOrderId);
    const create = new Order_Schema({
      order_id: getOrderId,
      customer_phone_number: parseInt(req.body.customer_phone_number),
      customer_id: req.body.customer_id,
      customer_name: req.body.customer_name?.toLowerCase(),
      customer_email: req.body.customer_email?.toLowerCase(),
      order_status: 'pending',
      products: req.body.products,
      shipping_address: req.body.shipping_address,
      state: req.body?.state,
      pincode: parseInt(req.body?.pincode),
      customer_gst: req.body?.customer_gst,
      customer_business: req.body?.customer_business,
      transport_detail: req.body?.transport_detail,
    });
    const result = await create.save();
    const updateUser = await Users_Schema.findOneAndUpdate(
      { user_id: req.body?.customer_id },
      {
        $set: {
          gst_number: req.body?.customer_gst,
          pincode: parseInt(req.body?.pincode),
          state: req.body?.state,
          address: req.body.shipping_address,
          user_business: req.body?.customer_business,
          email: req.body?.customer_email?.toLowerCase(),
        },
      }
    );

    res
      .status(200)
      .send({ status: true, message: 'order created successfully !!' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong !!');
  }
};

// ========== USER AUTHENTICATION FLOW =============
// check user is exists or not
const checkExistingUser = async (req, res) => {
  const phoneNumber = req.params.phone_number;
  try {
    if (!phoneNumber) {
      return res
        .status(404)
        .send({ status: false, message: 'user not found !!' });
    }
    const findUser = await Users_Schema.findOne({
      phone_number: parseInt(phoneNumber),
    });
    // for sign up
    if (!findUser) {
      return res
        .status(200)
        .send({ user_exists: false, message: 'user not found !!' });
    }
    // for sign in
    res.status(200).send({
      user_exists: true,
      user_id: findUser.user_id,
      message: 'user found success !!',
    });
  } catch (err) {
    console.log(err);
    res.state(500).send('Something went wrong !!');
  }
};

// creating new user
const createUser = async (req, res) => {
  const { phone_number, username, user_id } = req.body;
  const convertPhone = phone_number.split(' ');
  const phoneNumber = convertPhone[1];
  try {
    const findUserPhone = await Users_Schema.findOne({
      phone_number: phoneNumber,
    });
    if (findUserPhone) {
      return res.send('User Already Exists !!');
    }
    const getUserId = uuidv4();
    // console.log(getUserId);
    const create = new Users_Schema({
      user_id: getUserId,
      username: username?.toLowerCase(),
      phone_number: parseInt(phoneNumber),
      joining_date: new Date().toUTCString(),
    });
    const result = await create.save();
    const findUser = await Users_Schema.findOne({
      phone_number: parseInt(phoneNumber),
    }).select('user_id username phone_number profile');
    if (!findUser) {
      return res.status(404).send('unauthenticated !!');
    }
    res.status(200).send({
      status: true,
      user: findUser,
      message: 'created user success !!',
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong');
  }
};
const loginUser = async (req, res) => {
  const { phone_number } = req.params;
  const convertPhone = phone_number.split(' ');
  const phoneNumber = convertPhone[1];
  console.log(phoneNumber, phone_number, convertPhone);
  try {
    if (!phoneNumber) {
      return res.status(404).send('unauthenticated !!');
    }
    const findUser = await Users_Schema.findOne({
      phone_number: parseInt(phoneNumber),
    }).select('user_id username phone_number profile');
    if (!findUser) {
      return res.status(404).send('unauthenticated !!');
    }
    res.status(200).send({ status: true, user: findUser });
  } catch (err) {
    console.log(err);
    res.status(500).send('something went wrong !!');
  }
};

// ========== USER AUTHENTICATION FLOW =============

// get user by user id
const getUserById = async (req, res) => {
  const userId = req.params.user_id;
  try {
    if (!userId)
      return res
        .status(404)
        .send({ status: false, message: 'not found user !!' });
    const findUser = await Users_Schema.findOne({ user_id: userId });
    if (!findUser)
      return res
        .status(404)
        .send({ status: false, message: 'not found user !!' });
    res.status(200).send({ status: true, message: 'success', user: findUser });
  } catch (err) {
    console.log(err);
    res.status(500).send('something went wrong !!');
  }
};

// edit users by id
const editUserByID = async (req, res) => {
  const userId = req.params.user_id;
  console.log('USER ID=>', userId, 'REQUEST BODY', req.body);
  try {
    if (!userId) {
      return res.send('please provide a user id');
    }
    const findUser = await Users_Schema.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          username: req.body.username,
          gst_number: req.body?.gst_number,
          pincode: parseInt(req.body?.pincode),
          transport_detail: req.body?.transport_detail,
          state: req.body?.state,
          address: req.body.shipping_address,
          user_business: req.body?.customer_business,
          email: req.body?.customer_email?.toLowerCase(),
        },
      }
    );
    console.log(findUser);
    if (!findUser) {
      return res.send('user not found');
    }
    res.status(200).send({
      status: true,
      user: {
        _id: findUser._id,
        user_id: findUser.user_id,
        username: findUser.username,
        phone_number: findUser.phone_number,
      },
      message: 'user updated successfully !!',
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong !!');
  }
};

// get all orders
const getAllOrdersByUserId = async (req, res) => {
  const { customer_id } = req.params;
  console.log(customer_id, 'CUSTOMER ID');
  // const phoneNumber = parseInt(phone_number);
  try {
    if (!customer_id) {
      return res.status(404).send('orders not found !!');
    }
    const findOrders = await Order_Schema.find({
      customer_id: customer_id,
    }).sort({ createdAt: -1 });
    res.status(200).send(findOrders);
  } catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong !!');
  }
};

// get all banners
const getAllHomeScreenbanner = async (req, res) => {
  try {
    const findAll = await Banners_Schema.find({})
      .select('image_url selected_category category_chain')
      .sort({ createdAt: -1 });
    res.status(200).send(findAll);
  } catch (err) {
    console.log(err);
    res.status(500).send('something went wrong !!');
  }
};

// cancel order by order id
const cancelOrderById = async (req, res) => {
  const orderId = req.params.order_id;
  console.log('orderId', orderId);
  try {
    if (!orderId) {
      return res.status(404).send({ status: false, message: 'not found !!' });
    }
    const findOrder = await Order_Schema.findByIdAndUpdate(orderId, {
      $set: { order_status: 'cancelled' },
    });
    if (!findOrder) {
      return res.status(404).send({ status: false, message: 'not found !!' });
    }
    res
      .status(200)
      .send({ status: true, message: 'order cancelled success !!' });
  } catch (err) {
    console.log(err);
    res.status(500).send('something went wrong !! ');
  }
};

// send message for order enquiry
const sendMessageEnquiry = async (req, res) => {
  console.log(req.body);
  try {
    const create = new Enquiry_Schema({
      order_id: req.body?.order_id,
      user_id: req.body?.user_id,
      username: req.body.username,
      message: req.body.message,
      phone_number: req.body.phone_number,
    });
    const result = await create.save();
    res
      .status(200)
      .send({ status: true, message: 'you message has been received !!' });
  } catch (err) {
    console.log(err);
    res.status(500).send('something went wrong !!');
  }
};

const editUserProfilePicture = async (req, res) => {
  const user_id = req.params?.user_id;
  console.log('user_id', user_id);
  console.log('user_id', req.body);
  try {
    if (!user_id) {
      return res.status(404).send({ status: false, message: 'not found!!' });
    }
    const findUser = await Users_Schema.findById(user_id);
    if (!findUser) {
      return res.status(404).send({ status: false, message: 'not found!!' });
    }
    const updatedUser = await Users_Schema.findByIdAndUpdate(user_id, {
      $set: { profile: req.body },
    });
    console.log(updatedUser);
    res.status(200).send({
      status: true,
      previousProfile: findUser?.profile,
      message: 'user profile updated sccuess!!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('something went wrong !!');
  }
};

const getUserProfilePicture = async (req, res) => {
  const user_id = req.params?.user_id;
  try {
    if (!user_id) {
      return res.status(404).send({ status: false, message: 'not found!!' });
    }
    const findUser = await Users_Schema.findById(user_id);
    if (!findUser) {
      return res.status(404).send({ status: false, message: 'not found!!' });
    }
    res.status(200).send({
      status: true,
      profile: findUser?.profile,
      message: 'user profile updated sccuess!!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('something went wrong !!');
  }
};

/**
 * @author  Sam
 * @route   /api/app/create/user/b2b
 * @access  Public
 * @desc    Create a B2B user and set its isApproved to false.
 */
const createB2BAccount = catchAsync(async (req, res, next) => {
  // Verify the incoming data.
  const { data: userData, error } = await verifyB2BAccountData(req.body);

  if (error)
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: error.message,
      error,
    });

  const newB2BUser = new B2BUser(userData);
  await newB2BUser.save();

  const savedUser = newB2BUser.toObject();
  delete savedUser.password;

  const tokenPayload = {
    _id: savedUser._id,
    userType: 'B2B',
    isApproved: savedUser.is_approved,
  };

  const tokenSecret = process.env.JWT_TOKEN_SECRET;
  const accessToken = TokenService.signToken(tokenPayload, tokenSecret);

  res.header('x-b2b-access-token', accessToken);

  return res.status(httpStatus.CREATED).json({
    success: true,
    statusCode: httpStatus.CREATED,
    user: savedUser,
    accessToken,
  });
});

/**
 * @author  Sam
 * @route   /api/app/create/user/b2c
 * @access  Public
 * @desc    Create a B2C user.
 */
const createB2CAccount = catchAsync(async (req, res, next) => {
  // Verify the incoming data.
  const { data: userData, error } = await verifyB2CAccountData(req.body);

  if (error)
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: error.message,
      error,
    });

  const newB2CUser = new B2CUser(userData);
  await newB2CUser.save();

  const savedUser = newB2CUser.toObject();
  delete savedUser.password;

  const tokenPayload = {
    _id: savedUser._id,
    name: savedUser.name,
    userType: 'B2C',
  };

  const tokenSecret = process.env.JWT_TOKEN_SECRET;
  const accessToken = TokenService.signToken(tokenPayload, tokenSecret);

  res.header('x-b2c-access-token', accessToken);

  return res.status(httpStatus.CREATED).json({
    success: true,
    statusCode: httpStatus.CREATED,
    user: savedUser,
    accessToken,
  });
});

/**
 * @author  Sam
 * @route   /app/login/user/b2b/b2c
 * @access  Public
 * @desc    Login B2B and B2C user by returning appropriate tokens.
 */
const loginB2bAndB2cUser = catchAsync(async (req, res, next) => {
  const { email, mobile, password, userType } = req.body;

  if (!email && !mobile) {
    const message = 'Please provide either email or phone!';
    throw new CaptureError(message, httpStatus.BAD_REQUEST);
  }

  if (!password)
    throw new CaptureError('Please provide password', httpStatus.BAD_REQUEST);

  if (userType !== 'B2B' && userType !== 'B2C') {
    const message = 'Please provide correct user type';
    throw new CaptureError(message, httpStatus.BAD_REQUEST);
  }

  let user = null;

  if (userType === 'B2B') {
    user = await B2BUser.findOne({ $or: [{ email }, { mobile }] });
  } else if (userType === 'B2C') {
    user = await B2CUser.findOne({ $or: [{ email }, { mobile }] });
  }

  if (!user)
    throw new CaptureError('Email or Mobile not found', httpStatus.NOT_FOUND);

  if (!(await user.isCorrectPassword(password))) {
    const message = 'You entered wrong password!';
    throw new CaptureError(message, httpStatus.BAD_REQUEST);
  }

  let payload = null;
  let accessToken = null;
  const secret = process.env.JWT_TOKEN_SECRET;

  if (userType === 'B2B') {
    payload = {
      _id: user._id,
      userType: 'B2B',
      isApproved: user.is_approved,
    };
    accessToken = TokenService.signToken(payload, secret);

    res.header('x-b2b-access-token', accessToken);
  } else if (userType === 'B2C') {
    payload = {
      _id: user._id,
      name: user.name,
      userType: 'B2C',
    };
    accessToken = TokenService.signToken(payload, secret);

    res.header('x-b2c-access-token', accessToken);
  }

  return res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    user: {
      _id: user._id,
      email: user.email,
      mobile: user.mobile,
    },
    accessToken,
  });
});

exports.showAllBrands = showAllBrands;
exports.brandsForHomeScreen = brandsForHomeScreen;
exports.getAllBrands = getAllBrands;
exports.brandsSubCategoryAndProducts = brandsSubCategoryAndProducts;
exports.getProductById = getProductById;
exports.searchProducts = searchProducts;
exports.cartCheckout = cartCheckout;
exports.checkExistingUser = checkExistingUser;
exports.createUser = createUser;
exports.loginUser = loginUser;
exports.getAllOrdersByUserId = getAllOrdersByUserId;
exports.getAllHomeScreenbanner = getAllHomeScreenbanner;
exports.cancelOrderById = cancelOrderById;
exports.sendMessageEnquiry = sendMessageEnquiry;
exports.editUserByID = editUserByID;
exports.getUserById = getUserById;
exports.getNewArrivalProducts = getNewArrivalProducts;
exports.getBrandCategory = getBrandCategory;
exports.filterForProducts = filterForProducts;
exports.editUserProfilePicture = editUserProfilePicture;
exports.getUserProfilePicture = getUserProfilePicture;
exports.createB2BAccount = createB2BAccount;
exports.createB2CAccount = createB2CAccount;
exports.loginB2bAndB2cUser = loginB2bAndB2cUser;

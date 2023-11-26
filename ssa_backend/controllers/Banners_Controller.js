const catchAsync = require('../middlewares/catchAsync');
const Banners_Schema = require('../modals/Banners');
const Brands_Schema = require('../modals/Brands');
const httpStatus = require('../utils/configs/httpStatus');

// get all banners
const getAllbanners = async (req, res) => {
  try {
    const findAll = await Banners_Schema.find({}).sort({ createdAt: -1 });
    const findCategory = await Brands_Schema.find().select('category_name');
    const findSubCategory = await Brands_Schema.find().select('subcategory');
    const bannerLinkCate = [];
    // console.log("findSubCategory==>>>>>",findSubCategory);
    findSubCategory?.map((allSub) => {
      // console.log("valuevaluevaluevaluevalue===>>>>",allSub)
      allSub?.subcategory?.map((inner) => {
        // console.log("inner===>>>>",inner)
        bannerLinkCate?.push({
          main_category: inner?.parent_main_category,
          category: inner?.parent_category,
          sub_category: inner?.name,
        });
        // bannerLinkCate?.push(inner?.name)
      });
    });
    console.log('bannerLinkCate===>>>', bannerLinkCate);
    res.status(200).send({ allbanners: findAll, category: bannerLinkCate });
    // res.status(200).send({allbanners:findAll,category:findCategory});
  } catch (err) {
    console.log(err);
    res.status(500).send('something went wrong !!');
  }
};

// add new banners
const addNewBanner = async (req, res) => {
  console.log(req.body);
  try {
    const create = new Banners_Schema({
      image_name: req.body?.image_name,
      image_url: req.body?.image_url,
      path: req.body?.path,
      selected_category: req.body?.selected_category?.toLowerCase(),
    });
    const result = await create.save();
    res.status(200).send({ status: true, message: 'banner add success !!' });
  } catch (err) {
    console.log(err);
    res.status(500).send('something went wrong !!');
  }
};

// change banner
const changeBanner = async (req, res) => {
  const bannerId = req.params.banner_id;
  try {
    if (!bannerId) {
      return res
        .status(404)
        .send({ status: false, message: 'not found banner !!' });
    }
    const previousImage = await Banners_Schema.findById(bannerId);
    if (!previousImage) {
      return res
        .status(404)
        .send({ status: false, message: 'not found banner !!' });
    }
    const findBanner = await Banners_Schema.findByIdAndUpdate(bannerId, {
      $set: req.body,
    });
    if (!findBanner) {
      return res
        .status(404)
        .send({ status: false, message: 'not found banner !!' });
    }
    res.status(200).send({
      status: true,
      previous: previousImage,
      message: 'Update banner success !!',
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('something went wrong !!');
  }
};

// link banner to category
const updateBannerLinkCategory = async (req, res) => {
  const bannerId = req.params.banner_id;
  console.log(bannerId, req.body);
  try {
    if (!bannerId) {
      return res
        .status(404)
        .send({ status: false, message: 'not found banner !!' });
    }
    const checkBanner = await Banners_Schema.findById(bannerId);
    if (!checkBanner) {
      return res
        .status(404)
        .send({ status: false, message: 'not found banner !!' });
    }
    const findBanner = await Banners_Schema.findByIdAndUpdate(bannerId, {
      $set: req.body,
    });
    if (!findBanner) {
      return res
        .status(404)
        .send({ status: false, message: 'not found banner !!' });
    }
    res.status(200).send({ status: true, message: 'Update banner success !!' });
  } catch (err) {
    console.log(err);
    res.status(500).send('something went wrong !!');
  }
};

// delete banner
const deleteBanner = async (req, res) => {
  const bannerId = req.params.banner_id;
  console.log('bannerId', bannerId);
  try {
    const findAndDelete = await Banners_Schema.findByIdAndDelete(bannerId);
    res.status(200).send({ status: true, message: 'banner delete success !!' });
  } catch (err) {
    console.log(err);
    res.status(500).send('something went wrong !!');
  }
};

const getLinkBannerCategory = async (req, res) => {
  const { main_category } = req.params;
  try {
    // const findCategory = await Brands_Schema.aggregate([
    //     {$match:{main_category_name:main_category}},
    //     {$project:{category_name:1}}
    // ]).sort({_id:1})
    const findCategory = await Brands_Schema.find().select('category_name');

    // console.log("FIND CATEGORY==>",findCategory)
    return res.status(200).send(findCategory);
  } catch (err) {
    console.log(err);
    res.status(500).send('something went wrong !!');
  }
};

const getRewardsBanner = catchAsync(async (req, res, next) => {
  const banners = await Banners_Schema.find({ bannerType: 'rewards' });

  return res.json({
    success: true,
    statusCode: httpStatus.OK,
    banners: banners || [],
  });
});

exports.getAllbanners = getAllbanners;
exports.addNewBanner = addNewBanner;
exports.changeBanner = changeBanner;
exports.deleteBanner = deleteBanner;
exports.updateBannerLinkCategory = updateBannerLinkCategory;
exports.getLinkBannerCategory = getLinkBannerCategory;
exports.getRewardsBanner = getRewardsBanner;

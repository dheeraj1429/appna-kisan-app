const catchAsync = require('../middlewares/catchAsync');
const Users_Schema = require('../modals/Users');
const Utils = require('../utils/Utils');
const { v4: uuidv4 } = require('uuid');
const httpStatus = require('../utils/configs/httpStatus');
const CaptureError = require('../utils/CaptureError');

// creating new user
const createUser = async (req, res) => {
  const {
    firstname,
    gst_number,
    pincode,
    state,
    country,
    username,
    lastname,
    profile,
    phone_number,
    address,
    location,
    email,
    password,
    user_type,
  } = req.body;
  try {
    const findUserPhone = await Users_Schema.findOne({
      phone_number: phone_number,
    });
    if (findUserPhone) {
      return res.send('User Already Exists !!');
    }
    const findUser = await Users_Schema.findOne({ email: email });
    if (findUser) {
      return res.send('User Already Exists !!');
    }
    // creating user id
    // const getUserCount = await Users_Schema.find({}).count();
    // const getUserId = "user00"+(getUserCount+1);
    const getUserId = uuidv4();
    console.log(getUserId);
    // const currentDate = new Date().toUTCString()
    // const hashedPassword = await Utils.Hashing_Password(password)
    const create = new Users_Schema({
      user_id: getUserId,
      // firstname:firstname?.toLowerCase(),
      // lastname:lastname?.toLowerCase(),
      username: username?.toLowerCase(),
      // profile:profile,
      phone_number: phone_number,
      email: email,
      joining_date: new Date().toUTCString(),
      pincode: pincode,
      gst_number: gst_number,
      state: state?.toLowerCase(),
      country: country?.toLowerCase(),
      // password:hashedPassword,
      address: address,
      // user_type:user_type?.toLowerCase()
    });
    const result = await create.save();
    res
      .status(200)
      .send({ result: result, message: 'created user successfully !!' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong');
  }
};

// Login user with email or phone number
const loginUser = async (req, res) => {
  const { email, phone_number, password } = req.body;
  try {
    let findUserPhone;
    const findUserEmail = await Users_Schema.findOne({ email: email });
    if (!findUserEmail) {
      findUserPhone = await Users_Schema.findOne({
        phone_number: phone_number,
      });
      if (!findUserPhone) {
        return res.send('Invalid Username or password !!');
      }
    }

    let isValidPassword = false;
    if (findUserEmail) {
      try {
        isValidPassword = await Utils.compare_Password(
          password,
          findUserEmail.password
        );
      } catch (err) {
        console.log(err);
        res.send('Something went wrong !!');
      }
      if (!isValidPassword) {
        return res.send('Invalid Username or password !!');
      }
      if (isValidPassword) {
        const token = await Utils.create_Jwt(
          { id: findUserEmail._id, user_type: findUserEmail.user_type },
          process.env.JWT_TOKEN_SECRET
        );
        res.cookie('jwt', token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, //5 hrs
        });
        return res.status(200).send('Logged in Success !!');
      }
    }
    if (findUserPhone) {
      try {
        isValidPassword = await Utils.compare_Password(
          password,
          findUserPhone.password
        );
      } catch (err) {
        console.log(err);
        res.send('Something went wrong !!');
      }
      if (!isValidPassword) {
        return res.send('Invalid Username or password !!');
      }
      if (isValidPassword) {
        const token = await Utils.create_Jwt(
          { id: findUserPhone._id, user_type: findUserPhone.user_type },
          process.env.JWT_TOKEN_SECRET
        );
        res.cookie('jwt', token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, //5 hrs
        });
        return res.status(200).send('Logged in Success !!');
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong !!');
  }
};

// logout user
const logoutUser = async (req, res) => {
  res.cookie('jwt', '', { maxAge: 0 });
  res.status(200).send('Logout Success !!');
};

//getting all users
const getAllUser = async (req, res) => {
  try {
    const getAllUserCount = await Users_Schema.find({}).count();
    const alluser = await Users_Schema.find({}).sort({ createdAt: -1 });
    res.status(200).json({ alluser: alluser, user_count: getAllUserCount });
  } catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong !!');
  }
};

// get user by id (who's logged in)
const getUserById = async (req, res) => {
  const cookie = req.cookies['jwt'];
  try {
    if (!cookie) {
      return res.send('Unauthenticated !!');
    }
    const verifyJwt = await Utils.verifying_Jwt(
      cookie,
      process.env.JWT_TOKEN_SECRET
    );
    if (!verifyJwt) {
      return res.send('Unauthenticated !!');
    }
    const findUser = await Users_Schema.findById(verifyJwt.id, '-password');
    if (!findUser) {
      return res.send('Unauthenticated !!');
    }
    res.status(200).send(findUser);
  } catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong !!');
  }
};

// get user by id
const getUser = async (req, res) => {
  const userId = req.params.user_id;
  try {
    if (!userId)
      return res
        .status(404)
        .send({ status: false, message: 'user not found !!' });
    const findUser = await Users_Schema.findById(userId);
    if (!findUser)
      return res
        .status(404)
        .send({ status: false, message: 'user not found !!' });
    res.status(200).send(findUser);
  } catch (err) {
    console.log(err);
    res.status(500).send('something went wrong !!');
  }
};

// edit users by id
const editUserByID = async (req, res) => {
  const userId = req.params.user_id;
  try {
    if (!userId) {
      return res.send('please provide a user id');
    }
    if (req.body.password) {
      const hashedNewPassword = await Utils.Hashing_Password(req.body.password);
      const find = await Users_Schema.findByIdAndUpdate(userId, {
        password: hashedNewPassword,
      });
      if (!find) {
        return res.send('User not found');
      }
      return res.status(200).send('Password Updated success');
    }
    const findUser = await Users_Schema.findByIdAndUpdate(userId, {
      $set: req.body,
    });
    if (!findUser) {
      return res.send('user not found');
    }
    res.status(200).send('user updated successfully !!');
  } catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong !!');
  }
};

// search in users
const searchInUsers = async (req, res) => {
  const searchValue = req.query.search;
  const searchRegex = Utils.createRegex(searchValue);
  let result;
  // console.log("SEARCH===",searchValue)
  try {
    // result = await Users_Schema.find({user_id:{$regex:searchRegex}})

    // if(!result.length > 0){
    result = await Users_Schema.find({
      username: { $regex: searchRegex },
    }).sort({ createdAt: -1 });
    if (!result.length > 0) {
      result = await Users_Schema.find({ email: { $regex: searchRegex } }).sort(
        { createdAt: -1 }
      );
    }
    // }
    const numberField = parseInt(searchValue);
    // console.log(numberField)
    if (numberField) {
      // console.log(numberField)
      result = await Users_Schema.find({
        phone_number: numberField,
      }).sort({ createdAt: -1 });
      return res.status(200).send(result);
    }

    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong');
  }
};

// API FOR  FILTER IS USERS
const filterForUsers = async (req, res) => {
  const { by_status, date_from, date_to, recentDays } = req.query;
  let result;
  console.log(
    'by_status,date_from,date_to,recentDays',
    by_status,
    date_from,
    date_to,
    recentDays
  );
  try {
    // console.log("date====",Utils.convertDate(date_from),"-----",Utils.convertDate(date_to))
    const endDate = new Date(`${date_to}`);
    // seconds * minutes * hours * milliseconds = 1 day
    const dayTime = 60 * 60 * 24 * 1000;
    let increaseEndDateByOne = new Date(endDate.getTime() + dayTime);
    // console.log("INCREASED DATE",increaseEndDateByOne)

    // filter users by todays date and by their status
    let user_status;
    if (date_from && date_to && by_status) {
      if (by_status != 'all') {
        user_status = by_status == 'verified' ? true : false;
        result = await Users_Schema.aggregate([
          {
            $match: {
              verified: user_status,
              createdAt: {
                $lte: Utils.convertDate(increaseEndDateByOne),
                $gte: Utils.convertDate(date_from),
              },
            },
          },
          { $project: { password: 0 } },
        ]).sort({ createdAt: -1 });
        return res.status(200).send(result);
      }
    } else {
      result = await Users_Schema.find(
        { verified: user_status },
        '-password'
      ).sort({ createdAt: -1 });
      // return res.status(200).send(result)
    }

    if (date_from && date_to) {
      result = await Users_Schema.aggregate([
        {
          $match: {
            createdAt: {
              $lte: Utils.convertDate(increaseEndDateByOne),
              $gte: Utils.convertDate(date_from),
            },
          },
        },
        { $project: { password: 0 } },
      ]).sort({ createdAt: -1 });
      console.log('RESULT NEW----', result);
      return res.status(200).send(result);
    }
    if (by_status != 'all') {
      let user_status = by_status === 'verified' ? true : false;
      result = await Users_Schema.find(
        { verified: user_status },
        '-password'
      ).sort({ createdAt: -1 });
      return res.status(200).send(result);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong !!');
  }
};

// delete Users
const deleteUsers = async (req, res) => {
  // console.log("body=>",req.body)
  // console.log("body=>",req.body?.length)
  try {
    if (req.body?.length) {
      const deleteSelected = await Users_Schema.deleteMany({
        _id: {
          $in: req.body,
        },
      });
      if (!deleteSelected) {
        return res
          .status(200)
          .send({ message: 'image not deleted', status: false });
      }
      return res
        .status(200)
        .send({ message: 'image delete success', status: true });
    }
    res.status(200).send({ message: 'image not deleted', status: false });
  } catch (err) {
    console.log(err);
    res.status(200).send({ message: 'image not deleted', status: false });
  }
};

/**
 * @author  Sam
 * @route   /user/get/user/info
 * @method  GET
 * @access  Protected
 * @desc    Get user info from the appropriate collection based on user type and return the response.
 */
const getUserInfo = catchAsync(async (req, res, next) => {
  const userType = req.userType;
  const user = req.user;

  let userData = null;

  switch (userType) {
    case 'b2b': {
      userData = {
        _id: user._id,
        name: user.owner_name,
        company_name: user.company_name,
        email: user.email,
        phone: user.mobile,
        avatar: user.avatar?.image_url ?? null,
      };

      break;
    }

    case 'b2c': {
      userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.mobile,
        avatar: user.avatar?.image_url ?? null,
      };

      break;
    }

    case 'basic': {
      userData = {
        _id: user._id,
        user_id: user.user_id,
        name: user.username,
        email: user.email,
        phone: user.phone_number,
        avatar: user.avatar?.image_url ?? null,
      };

      break;
    }

    default: {
      throw new CaptureError(
        'Something went wrong',
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  return res.json({
    success: true,
    statusCode: httpStatus.OK,
    userType,
    user: userData,
  });
});

exports.getAllUser = getAllUser;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.loginUser = loginUser;
exports.logoutUser = logoutUser;
exports.editUserByID = editUserByID;
exports.searchInUsers = searchInUsers;
exports.filterForUsers = filterForUsers;
exports.deleteUsers = deleteUsers;
exports.getUser = getUser;
exports.getUserInfo = getUserInfo;

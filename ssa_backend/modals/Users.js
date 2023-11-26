const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Users_Schema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    // firstname:{
    //     type:String,
    //     required:true,
    // },
    // lastname:{
    //     type:String,
    // },
    username: {
      type: String,
    },
    profile: {
      image_name: { type: String },
      image_url: { type: String },
      path: { type: String },
    },
    email: {
      type: String,
      // required:true,
      // unqiue:true
    },
    user_business: {
      type: String,
    },
    password: {
      type: String,
      default: null,
    },
    phone_number: {
      type: Number,
      required: true,
      unqiue: true,
    },
    // user_type:{
    //     type:String,
    //     required:true
    // },
    orders: {
      type: Number,
      required: true,
      default: 0,
    },
    transport_detail: {
      type: String,
    },
    joining_date: {
      type: Date,
      required: true,
    },
    // location:{
    //     type:String,
    //     required:true
    // },
    gst_number: { type: String },
    pincode: { type: Number },
    state: { type: String },
    country: { type: String },
    address: { type: String },
    reward_points: {
      type: Number,
      default: 0,
    },

    // address: [
    //     {
    //       pincode: { type: Number },
    //       state: { type: String },
    //       city: { type: String },
    //       street: { type: String },
    //       landmark: { type: String },
    //       house_no: { type: String },
    //       mobile_no: { type: Number },
    //     },
    //   ],
  },
  { timestamps: true }
);

Users_Schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const SALT = 12; // See the utils file. 12 is used there as salt.
  const salt = await bcrypt.genSalt(parseInt(SALT));
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('Users', Users_Schema);

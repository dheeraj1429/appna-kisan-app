const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const B2B_User_Schema = new mongoose.Schema(
  {
    is_approved: {
      type: Boolean,
      required: true,
      default: false,
    },
    company_name: {
      type: String,
      required: true,
    },
    owner_name: {
      type: String,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    pan: {
      number: { type: String, default: null },
      images: [
        {
          image_name: { type: String },
          image_url: { type: String },
          path: { type: String },
        },
      ],
    },
    aadhaar: {
      number: { type: String, default: null },
      images: [
        {
          image_name: { type: String },
          image_url: { type: String },
          path: { type: String },
        },
      ],
    },
    gstNo: {
      number: { type: String, default: null },
      images: [
        {
          image_name: { type: String },
          image_url: { type: String },
          path: { type: String },
        },
      ],
    },
    address: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

B2B_User_Schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const SALT = 12; // See the utils file. 12 is used there as salt.
  const salt = await bcrypt.genSalt(parseInt(SALT));
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

B2B_User_Schema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

B2B_User_Schema.statics.comparePasswords = async function (password, hash) {
  return bcrypt.compare(password, hash);
};

module.exports = mongoose.model('B2BUsers', B2B_User_Schema);

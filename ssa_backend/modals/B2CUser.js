const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const B2C_User_Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

B2C_User_Schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const SALT = 12; // See the utils file. 12 is used there as salt.
  const salt = await bcrypt.genSalt(parseInt(SALT));
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

B2C_User_Schema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

B2C_User_Schema.statics.comparePasswords = async function (password, hash) {
  return bcrypt.compare(password, hash);
};

module.exports = mongoose.model('B2CUsers', B2C_User_Schema);

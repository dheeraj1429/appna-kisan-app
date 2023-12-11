const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// All global function

// signing JWT
function create_Jwt(payload, key) {
  const token = jwt.sign(payload, key);
  return token;
}

// verifing JWT
function verifying_Jwt(token, key) {
  const verify_token = jwt.verify(token, key);
  return verify_token;
}

// Creating hash password
function Hashing_Password(password) {
  const createHash = bcrypt.hash(password, 12);
  return createHash;
}

//comparing hashed password
function compare_Password(password, hashedPassword) {
  const checkPassword = bcrypt.compare(password, hashedPassword);
  return checkPassword;
}

// creating regex
function createRegex(value) {
  let createdRegex = new RegExp(value?.toLowerCase(), "i");

  return createdRegex;
}

// get previous date
function getDateXDaysAgo(numOfDays, date = new Date()) {
  const daysAgo = new Date(date.getTime());

  daysAgo.setDate(date.getDate() - numOfDays);

  return daysAgo;
}

// CONVERT DATE
function convertDate(date) {
  let currentDate = new Date(date).toJSON().slice(0, 10);
  const customDate = new Date(currentDate);
  return customDate;
}

module.exports = {
  convertDate,
  create_Jwt,
  verifying_Jwt,
  getDateXDaysAgo,
  Hashing_Password,
  compare_Password,
  createRegex,
};

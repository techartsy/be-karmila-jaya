require('dotenv').config();
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const generateToken = (user) => {
  const { id, username, role, email }= user;
  return jwt.sign(
    { id, username, role, email },
    secretKey
  );
};

const verifyToken = (access_token) => {
  return jwt.verify(access_token, secretKey);
};

module.exports = { generateToken, verifyToken };

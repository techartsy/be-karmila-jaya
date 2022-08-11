const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

const hashPass = (password) => {
  return bcrypt.hashSync(password, salt);
};

const comparePass = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

module.exports = { hashPass, comparePass };

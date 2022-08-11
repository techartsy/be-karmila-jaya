'use strict';
const {
  Model
} = require('sequelize');
const { hashPass } = require('../src/utils/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Admin.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate(admin) {
        admin.password = hashPass(admin.password)
      }
    },
    sequelize,
    modelName: 'Admin',
  });
  return Admin;
};
const joi = require('joi');
const { Admin } = require('../../models');
const { generateToken } = require('../utils/jwt');
const { comparePass } = require('../utils/bcrypt');
const { hashPass } = require('../utils/bcrypt');
const exclude = ["password", "createdAt", "updatedAt"];

exports.createAdmin = async (req, res) => {
  try {
    const { username } = req.body;
    const data = req.body;
    const scheme = joi.object({
      username: joi.string().min(5).required(),
      password: joi.string().min(5).required(),
      role: joi.string().required(),
      email: joi.string().email().required(),
    });
    const { error } = scheme.validate(data);
    if (error) {
      return res.status(400).json({
        status: "Validation Failed",
        message: error.details[0].message,
      });
    };
    const userCheck = await Admin.findOne({
      where: {
        username,
      },
    });
    if (userCheck) {
      return res.status(400).json({
        status: "Failed",
        message: "Username already Registered",
      });
    }
    const dataAdmin = await Admin.create(data);
    const token = generateToken(dataAdmin);
    res.status(201).send({
      message: 'Success',
      token
    });
  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: 'Internal server error',
    });
  }
}

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    Admin.findOne({ where: { username } }).then((admin) => {
      if (!admin || !comparePass(password, admin.password)) {
        res.status(400).send({
          status: "Failed",
          message: "Invalid Username or Password",
        });
      } else {
        const access_token = generateToken(admin);
        res.status(200).json({ access_token });
      }
    });
  } catch (err) {
    res.status(500).send({
      status: 'Error',
      message: 'Internal server error',
    });
  };
};

exports.changePassword = async (req,res) => {
  try {
    const { userData } = req;
    const { oldPassword, password } = req.body;
    const data = req.body;
    const scheme = joi.object({
      oldPassword: joi.string().min(5).required(),
      password: joi.string().min(5).required(),
    });
    const { error } = scheme.validate(data);
    if (error) {
      return res.status(400).json({
        status: "Validation Failed",
        message: error.details[0].message,
      });
    }
    const userExisted = await Admin.findOne({
      where: {
        id: userData.id,
      }
    });

    if (!userExisted) {
      return res.status(404).send({
        status: 'Error',
        message: 'User Not Found',
      });
    }

    if (!comparePass(oldPassword, userExisted.password)) {
      return res.status(400).send({
        status: 'Error',
        message: 'Invalid Existing Password',
      });
    }

    const updatedData = await Admin.update({ password: hashPass(password) }, {
      where: {
        id: userData.id,
      }
    });

    res.status(200).send({
      status: 'Success',
      message: 'Data Updated',
    });
  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: 'Internal server error',
    });
  }
}

exports.getAllAdmin = async (req, res) => {
  try {
    const dataAdmin = await Admin.findAll({
      attributes: {
        exclude: exclude,
      },
    });
    res.status(200).send({
      status: 'Success',
      message: 'Success Get Data',
      data: dataAdmin,
    });
  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: 'Internal server error',
    });
  }
}

exports.removeAdmin = async (req, res, cb) => {
  try {
    const { idAdmin } = req.body;
    const userExisted = await Admin.findOne({
      where: {
        id: idAdmin,
      }
    });

    if (!userExisted) {
      return res.status(404).send({
        status: 'Error',
        message: 'User Not Found',
      })
    }

    await Admin.destroy({
      where: {
        id: idAdmin,
      }
    });

    cb && cb();

  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: 'Internal server error',
    });
  }
}

exports.getAdminById = async (req, res) => {
  try {
    const { id, username, email } = req.userData;
    const profile = {
      id,
      username,
      email
    }
    res.status(200).send({
      status: 'Success',
      data: {
        profile,
      }
    })
  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: 'Internal server error',
    });
  }
}

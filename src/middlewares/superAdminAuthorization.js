const Admin = require('../../models').Admin;
const { verifyToken } = require('../utils/jwt');

const superAdminAuhorization = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header.replace("Bearer ", "");
    const decoded = verifyToken(token);
    const { id } = decoded;

    const adminData = await Admin.findOne({
      where: {
        id,
      },
    });

    if (!adminData) {
      res.status(404).send({
        status: 'Error',
        message: 'User Unregistered'
      });
    } else if (decoded.role !== '1') {
      res.status(403).send({
        status: 'Error',
        message: 'Forbidden Access'
      });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}

module.exports = superAdminAuhorization;

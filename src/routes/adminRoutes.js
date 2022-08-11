const express = require('express');
const { createAdmin, login, changePassword, getAllAdmin, getAdminById } = require('../controllers/adminController');
const superAdminAuhorization = require('../middlewares/superAdminAuthorization');
const authentication = require('../middlewares/authentication');
const router = express.Router();

router.post('/register', superAdminAuhorization, createAdmin);
router.post('/login', login);

router.use(authentication);
router.get('/', superAdminAuhorization, getAllAdmin);
router.put('/change-password', changePassword);
router.get('/get-profile', getAdminById)

module.exports = router;

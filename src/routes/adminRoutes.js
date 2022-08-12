const express = require('express');
const { createAdmin, login, changePassword, getAllAdmin, getAdminById } = require('../controllers/adminController');
const { uploadFile } = require('../middlewares/uploadFile');
const superAdminAuhorization = require('../middlewares/superAdminAuthorization');
const authentication = require('../middlewares/authentication');
const router = express.Router();

router.post('/register', superAdminAuhorization, createAdmin);
router.post('/login', login);
router.post('/test', uploadFile('photo'), () => {
  console.log('test');
});

router.use(authentication);
router.get('/', superAdminAuhorization, getAllAdmin);
router.put('/change-password', changePassword);
router.get('/get-profile', getAdminById);

module.exports = router;

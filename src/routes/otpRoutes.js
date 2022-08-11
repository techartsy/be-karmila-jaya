const express = require('express');
const router = express.Router();
const { request, verify, removeOTP } = require('../controllers/otpController');
const { removeAdmin } = require('../controllers/adminController');
const authentication = require('../middlewares/authentication');
const superAdminAuthorization = require('../middlewares/superAdminAuthorization');

router.use(authentication);
router.get('/request', request);
router.post('/verify', verify);
router.post('/verify-remove', superAdminAuthorization, verify, (req, res) => {
  removeAdmin(req, res, () => {
    removeOTP(req, res);
  });
});

module.exports = router;

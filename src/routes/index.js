const express = require('express');
const router = express.Router();
const adminRoutes = require('./adminRoutes');
const otpRoutes = require('./otpRoutes');

router.use('/admin', adminRoutes);
router.use('/otp', otpRoutes);

module.exports = router;

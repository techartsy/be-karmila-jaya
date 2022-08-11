const moment = require('moment');
const nodemailer = require("nodemailer");
const otpGenerator = require('otp-generator');
const joi = require('joi');
const { Otp } = require('../../models');
const { encryptData, decryptData } = require('../utils/encryption');

exports.sendEmail = (email, otp) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "techartsy.indonesia@gmail.com",
      pass: "jszyosbsluemwwgy",
    },
  });

  let mailOptions = {
    from: "techartsy.indonesia@gmail.com",
    to: email,
    subject: "Change Password Request",
    html: `
    <div>
      <p>Masukan kode OTP di bawah pada kolom OTP.</p>
      <p><strong>${otp}</strong></p>
      <p>Kode OTP hanya berlaku selama 5 menit. Selalu jaga kerahasiaan data Anda.<p>
      <p>Abaikan jika anda tidak melakukan permintaan kode ini.</p><br/>
      <p>Terima Kasih.</p>
    </div>`
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log(err, "error");
    } else {
      console.log("email sent!");
    }
  });
};

exports.request = async (req, res) => {
  try {
    const otpValue = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false });
    const expiryTime = moment().add(5, 'minutes').format('MM/DD/YYYY HH:mm:ss')
    const otpData = {
      value: otpValue,
      expiryTime,
    };
    this.sendEmail(req.userData.email, otpValue);
    const otp = await Otp.create(otpData);
    const otpToken = encryptData({id: otp.id});
    if (otp) {
      res.status(200).send({
        status: 'Success',
        data: { otpToken },
      });
    }
  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: 'Internal Server Error',
    })
  }
};

exports.verify = async (req, res, cb) => {
  try {
    const { otp, otpToken } = req.body;
    const data =  req.body;
    const scheme = joi.object({
      otp: joi.string().min(6).required(),
      otpToken: joi.string().required(),
      idAdmin: joi.string(),
    });
    const { error } = scheme.validate(data);
    if (error) {
      return res.status(400).json({
        status: "Bad Request",
        message: error.details[0].message,
      });
    }

    const decryptedToken = decryptData(otpToken);

    const otpResponse = await Otp.findOne({
      where: {
        id: decryptedToken.id,
      },
    })

    if (!otpResponse) {
      return res.status(404).send({
        status: 'Error',
        message: 'OTP Unrecognized'
      });
    }

    const currentTime = moment().format('MM/DD/YYYY HH:mm:ss');
    const minutesExpiryTime = moment(otpResponse.expiryTime.split(' ')[1].split(':'), "HH:mm:ss");
    const minutesCurrentTime = moment(currentTime.split(' ')[1].split(':'), "HH:mm:ss");
    const expiryDuration = minutesExpiryTime.diff(minutesCurrentTime, 'minutes');

    if (expiryDuration < 0) {
      return res.status(400).send({
        status: 'Error',
        message: 'Expired OTP',
      });
    }

    if (otpResponse.value !== otp) {
      return res.status(400).send({
        status: 'Error',
        message: 'Invalid OTP',
      })
    }

    if (req.body.idAdmin) {
      return cb();
    }

    await Otp.destroy({
      where: {
        id: decryptedToken.id
      }
    });

    res.status(200).send({
      status: 'Success',
      message: 'OTP Sent'
    });

  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: 'Internal Server Error',
    });
  }
};

exports.removeOTP = async (req, res) => {
  try {
    const { otpToken } = req.body;
    const decryptedToken = decryptData(otpToken);
    await Otp.destroy({
      where: {
        id: decryptedToken.id
      }
    });

    res.status(200).send({
      status: 'success',
      message: 'User Deleted'
    })

  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: 'Internal Server Error',
    });
  }
}

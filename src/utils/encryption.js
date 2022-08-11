const CryptoJS = require("crypto-js");

exports.encryptData = (data) => {
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    process.env.CRYPTO_SECRET_KEY
  ).toString();
  return ciphertext;
};

exports.decryptData = (data) => {
  const bytes = CryptoJS.AES.decrypt(data, process.env.CRYPTO_SECRET_KEY);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};

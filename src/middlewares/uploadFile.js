const multer = require('multer');

exports.uploadFile = (imageFile) => {
  const storage = multer.diskStorage({
    destination: function (req, res, cb) {
      cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '')}`);
    },
  });

  const fileFilter = function (req, file, cb) {
    if (file.fieldname === imageFile) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        req.fileValidationError = {
          message: 'Only image files are allowed!',
        };
        return cb(new Error('Only image files are allowed!'), false);
      };
    };
    cb(null, true);
  };

  const sizeInMb = 10;
  const maxSize = sizeInMb * 1024 * 1024;

  //generate multer instance for upload file

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: maxSize },
  }).any(imageFile);

  // let upload;
  // if (imageFile) {
  //   upload = multer({
  //     storage,
  //     fileFilter,
  //     limits: {
  //       fileSize: maxSize,
  //     },
  //   }).single(imageFile);
  // } else {
  //   upload = multer({
  //     storage,
  //     fileFilter,
  //     limits: {
  //       fileSize: maxSize,
  //     },
  //   }).any(imageFile);
  // };

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }

      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).send({
            message: 'Max File Size in 10MB',
          });
        }
        return res.status(400).send(err);
      }
      return next();
    });
  };
};

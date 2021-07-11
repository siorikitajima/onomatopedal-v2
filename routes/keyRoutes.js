const express = require('express');
const router = express.Router();
const keyController = require('../controllers/keyController');
const authController = require('../controllers/authController');
const multer = require('multer');
const path = require('path');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const accessKeyIdS3 = require('../secKey3');
const secretAccessKeyS3 = require('../secKey4');

const s3 = new AWS.S3({
    accessKeyId: accessKeyIdS3,
    secretAccessKey: secretAccessKeyS3
});

//////////// Multer ////////////

const upload = multer({
    limits: { fileSize: 500000 },
    fileFilter: async (req, file, cb) => {
      if (file.mimetype !== 'audio/mpeg') {
        return cb(new Error('goes wrong on the mimetype'), false);
      }
        cb(null, true);
    },
    storage: multerS3({
      s3: s3,
      bucket: 'opv2-heroku',
      acl: "public-read",
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
          let ext = path.extname(file.originalname);
              cb(null, `${req.user.name}/${req.body.newname || req.body.sample}${ext}`);
      }
    }),
  });

//////////// Key routes ////////////

router.get('/keys', authController.checkAuthenticated, keyController.key_index);
router.post('/keys', (req, res, next) => {
  const uploadMiddleware = upload.single('soundfile');
  uploadMiddleware(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.send("<script> alert('Oops! The sample file size must be under 500KB'); window.location =  'keys'; </script>"); }
    else if (err) {
      return res.send("<script> alert('Oops! The file type must be MP3'); window.location =  'keys'; </script>"); }
    else {
        // console.log("File response", req.file);
        next(); }
  })}, keyController.key_update);
router.get('/samples', authController.checkAuthenticated, keyController.samples_get);
router.post('/samples', authController.checkAuthenticated, keyController.samples_post);
router.delete('/sample', keyController.sample_delete);
router.post('/new-samples', (req, res, next) => {
  const uploadMiddleware = upload.single('newfile');
  uploadMiddleware(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.send("<script> alert('Oops! The sample file size must be under 300KB'); window.location =  'samples'; </script>"); }
    else if (err) {
      return res.send("<script> alert('Oops! The file type must be MP3'); window.location =  'samples'; </script>"); }
    else {
        // console.log("File response", req.file);
        next(); }
  })}, keyController.sample_new);

module.exports = router;
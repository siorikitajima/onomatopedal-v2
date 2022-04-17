const express = require('express');
const router = express.Router();
const keyController = require('../controllers/keyController');
const sampleController = require('../controllers/sampleController');
const authController = require('../controllers/authController');
const multer = require('multer');
const path = require('path');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID_S3,
  secretAccessKey: process.env.SECRET_ACCESS_KEY_S3
});

//////////// Multer ////////////

const upload = multer({
    limits: { fileSize: 3000000 },
    fileFilter: async (req, file, cb) => {
      if (file.mimetype !== 'audio/mpeg') {
        return cb(new Error('goes wrong on the mimetype'), false);
      }
        cb(null, true);
    },
    storage: multerS3({
      s3: s3,
      bucket: 'opv2',
      acl: "public-read",
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
          let ext = path.extname(file.originalname);
              cb(null, `${req.user.username}/samples/${req.body.newname || req.body.sample || req.body.samplep }${ext}`);
      }
    }),
  });

//////////// Key routes ////////////

router.get('/keys', authController.checkAuthenticated, keyController.key_get);
router.post('/keys', (req, res, next) => {
  const uploadMiddleware = upload.single('soundfile');
  uploadMiddleware(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.send("<script> alert('Oops! The sample file size must be under 3MB'); window.location =  'keys'; </script>"); }
    else if (err) {
      return res.send("<script> alert('Oops! The file type must be MP3'); window.location =  'keys'; </script>"); }
    else {
        // console.log("File response", req.file);
        next(); }
  })}, keyController.key_post);

router.get('/pads', authController.checkAuthenticated, keyController.pad_get);
router.post('/pads', (req, res, next) => {
    const uploadMiddleware = upload.single('soundfilep');
    uploadMiddleware(req, res, function(err) {
      if (err instanceof multer.MulterError) {
        return res.send("<script> alert('Oops! The sample file size must be under 3MB'); window.location =  'keys'; </script>"); }
      else if (err) {
        return res.send("<script> alert('Oops! The file type must be MP3'); window.location =  'keys'; </script>"); }
      else {
          next(); }
    })}, keyController.pad_post);

  router.post('/keys-group', keyController.key_group_post);
  router.post('/pads-group', keyController.pad_group_post);
    
router.get('/samples', authController.checkAuthenticated, sampleController.samples_get);
router.post('/samples', authController.checkAuthenticated, sampleController.samples_post);
router.delete('/sample', sampleController.sample_delete);
router.post('/new-samples', (req, res, next) => {
  const uploadMiddleware = upload.single('newfile');
  uploadMiddleware(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.send("<script> alert('Oops! The sample file size must be under 3MB'); window.location =  'samples'; </script>"); }
    else if (err) {
      return res.send("<script> alert('Oops! The file type must be MP3'); window.location =  'samples'; </script>"); }
    else {
        // console.log("File response", req.file);
        next(); }
  })}, sampleController.sample_new);

module.exports = router;
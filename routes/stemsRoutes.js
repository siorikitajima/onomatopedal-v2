const express = require('express');
const router = express.Router();
const stemsController = require('../controllers/stemsController');
const authController = require('../controllers/authController');
const multer = require('multer');
const path = require('path');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
// const atob = require('atob');

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID_S3,
  secretAccessKey: process.env.SECRET_ACCESS_KEY_S3
});

//////////// Multer ////////////

let upload = multer({
  limits: { fileSize: 5000000 },
  fileFilter: async (req, file, cb) => {
    if (file.mimetype !== 'audio/mpeg') {
      return cb(new Error('goes wrong on the mimetype'), false);
    }
      cb(null, true);
  },
    storage: multerS3({
      s3: s3,
      acl: "public-read",
      bucket: 'opv2-versioning',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        let ext = path.extname(file.originalname);
        cb(null, `${req.user.username}/${file.fieldname}${ext}`)
      }
    })
  });

//////////// Routes ////////////

router.get('/studio', authController.checkAuthenticated, stemsController.studio_get);

router.post('/studio', stemsController.studio_post);

router.get('/stems', authController.checkAuthenticated, stemsController.stems_get);

router.post('/stem1', (req, res) => {
  const uploadMiddleware = upload.single('stem1');
  uploadMiddleware(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.send("<script> alert('Oops! The stem file size must be under 5MB'); window.location =  'stems'; </script>"); }
    else if (err) {
      return res.send("<script> alert('Oops! The file type must be MP3'); window.location =  'stems'; </script>"); }
    else {
      let val = Math.floor(1000 + Math.random() * 9000);
      res.redirect(`/stems?ver=${val}`); }
  })});
router.post('/stem2', (req, res) => {
  const uploadMiddleware = upload.single('stem2');
  uploadMiddleware(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.send("<script> alert('Oops! The stem file size must be under 5MB'); window.location =  'stems'; </script>"); }
    else if (err) {
      return res.send("<script> alert('Oops! The file type must be MP3'); window.location =  'stems'; </script>"); }
    else {
      let val = Math.floor(1000 + Math.random() * 9000);
      res.redirect(`/stems?ver=${val}`); }
  })});
router.post('/stem3', (req, res) => {
  const uploadMiddleware = upload.single('stem3');
  uploadMiddleware(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.send("<script> alert('Oops! The stem file size must be under 5MB'); window.location =  'stems'; </script>"); }
    else if (err) {
      return res.send("<script> alert('Oops! The file type must be MP3'); window.location =  'stems'; </script>"); }
    else {
      let val = Math.floor(1000 + Math.random() * 9000);
      res.redirect(`/stems?ver=${val}`); }
  })});

router.delete('/stem1', stemsController.stem_delete_1);
router.delete('/stem2', stemsController.stem_delete_2);
router.delete('/stem3', stemsController.stem_delete_3);

router.get('/preview', authController.checkAuthenticated, stemsController.preview_get);

router.get('/mobilepreview', authController.checkAuthenticated, stemsController.mobilepreview_get);

router.post('/animation', authController.checkAuthenticated, stemsController.animation_post);

module.exports = router;
const express = require('express');
const router = express.Router();
const stemsController = require('../controllers/stemsController');
const authController = require('../controllers/authController');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const accessKeyIdS3 = require('../secKey3');
const secretAccessKeyS3 = require('../secKey4');

const s3 = new AWS.S3({
    accessKeyId: accessKeyIdS3,
    secretAccessKey: secretAccessKeyS3
});

//////////// Multer ////////////

let upload = multer({
    storage: multerS3({
      s3: s3,
      acl: "public-read",
      bucket: 'opv2-heroku',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, `${req.user.name}/${file.fieldname}.mp3`)
      }
    })
  })

//////////// Stem routes ////////////

router.get('/stems', authController.checkAuthenticated, stemsController.stems_get);

router.post('/stem1', upload.single(`stem1`), (req, res) => {
    res.redirect('/stems');});
router.post('/stem2', upload.single(`stem2`), (req, res) => {
    res.redirect('/stems');});
router.post('/stem3', upload.single(`stem3`), (req, res) => {
    res.redirect('/stems');});

router.delete('/stem1', stemsController.stem_delete_1);
router.delete('/stem2', stemsController.stem_delete_2);
router.delete('/stem3', stemsController.stem_delete_3);

router.get('/preview', authController.checkAuthenticated, stemsController.preview_get);

module.exports = router;
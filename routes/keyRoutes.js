const express = require('express');
const router = express.Router();
const keyController = require('../controllers/keyController');
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
      bucket: 'opv2-heroku',
      acl: "public-read",
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
            cb(null, `${req.user.name}/${req.body.newname || req.body.sample}.mp3`);
      }
    })
  })

//////////// Key routes ////////////

router.get('/keys', authController.checkAuthenticated, keyController.key_index);
router.post('/keys', authController.checkAuthenticated, upload.single('soundfile'), keyController.key_update);
router.get('/samples', authController.checkAuthenticated, keyController.samples_get);
router.post('/samples', authController.checkAuthenticated, keyController.samples_post);
router.delete('/sample', keyController.sample_delete);
router.post('/new-samples', authController.checkAuthenticated, upload.single('newfile'), keyController.sample_new);

module.exports = router;
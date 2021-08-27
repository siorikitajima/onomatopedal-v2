const express = require('express');
const router = express.Router();
const frontController = require('../controllers/frontController');
const featController = require('../controllers/featController');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const metaFetcher = require('meta-fetcher');
const authController = require('../controllers/authController');

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID_S3,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_S3
});

// Public

router.get('/v2/:onomoid', frontController.v2pedal_get);

router.get('/v1/:onomoid', frontController.v1pedal_get);

router.get('/v1', frontController.v1list_get);

router.get('/about', (req, res) => {
    res.render('about', { title: 'About', nav:'about' })
});

router.get('/feat/:featid', featController.feat_single_get);
router.get('/feat', featController.feat_get);

// Editor's CMS
router.get('/edit/:featid', authController.checkAuthenticated, featController.editor_get);
router.post('/edit/:featid', featController.editor_post);
router.post('/publish/:featid', featController.publish_post);
router.get('/featList', authController.checkAuthenticated, featController.featList_get);
router.post('/featList', featController.featList_post);
router.delete('/featDelete', featController.featList_delete);
router.post('/featRename', authController.checkAuthenticated, featController.featList_rename);

router.post('/featimage', (req, res) => {
    let filename;
    let upload = multer({
        limits: { fileSize: 5000000 },
        storage: multerS3({
          s3: s3,
          bucket: 'opv2-heroku',
          acl: "public-read",
          metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
          },
          key: function (req, file, cb) {
            filename = `featured/${file.originalname}`
            cb(null, `featured/${file.originalname}`);
          }
        })
      });
      const uploadMiddleware = upload.single('image');
      uploadMiddleware(req, res, function(err) {
        if (err) {
          console.log(err);
          return res.send("<script> alert('Oops! There was errors'); window.location =  'studio'; </script>");
         }
        else {
          return res.send({
            success: 1,
            file: {
              url: `https://opv2-heroku.s3.us-west-1.amazonaws.com/${filename}`,
            } 
        })}
      });
});

router.get('/fetchUrl', async (req, res) => {
    let params = req.query.url;
    const result = await metaFetcher(params);
        return res.send({
            success: 1,
            meta: {
                title: result.metadata.title,
                description: result.metadata.description,
                image: {
                    url: result.metadata.banner
                }
            } 
        })
    });

module.exports = router;
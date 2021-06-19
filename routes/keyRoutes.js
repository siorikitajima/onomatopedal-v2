const express = require('express');
const router = express.Router();
const keyController = require('../controllers/keyController');
const authController = require('../controllers/authController');
const multer = require('multer');

//////////// Multer ////////////

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, `public/sound/${req.user.name}/`)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
let upload = multer({storage});

//////////// Key routes ////////////

router.get('/keys', authController.checkAuthenticated, keyController.key_index);
router.post('/keys', authController.checkAuthenticated, upload.single('soundfile'), keyController.key_update);
router.get('/samples', authController.checkAuthenticated, keyController.samples_get);
router.post('/samples', authController.checkAuthenticated, keyController.samples_post)

module.exports = router;
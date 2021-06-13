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
        cb(null, `${req.body.key}.mp3`);
    }
});
let upload = multer({storage});

//////////// Key routes ////////////

router.get('/keys', authController.checkAuthenticated, keyController.key_index);
router.post('/keys', upload.single('soundfile'), keyController.key_update);
router.get('/keyEditor-:thekey', keyController.key_render);

module.exports = router;
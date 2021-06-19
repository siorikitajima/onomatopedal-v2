const express = require('express');
const router = express.Router();
const stemsController = require('../controllers/stemsController');
const authController = require('../controllers/authController');
const multer = require('multer');

//////////// Multer ////////////

let storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, `public/sound/${req.user.name}/`)
  },
  filename: function (req, file, cb) {
      console.log(file);
      cb(null, `${file.fieldname}.mp3`)
  }
});
let upload = multer({storage});

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
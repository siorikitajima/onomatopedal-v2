const express = require('express');
const router = express.Router();
const stemsController = require('../controllers/stemsController');
const prevController = require('../controllers/prevController');
const authController = require('../controllers/authController');

//////////// Routes ////////////

router.get('/studio', authController.checkAuthenticated, prevController.studio_get);
router.post('/studio', prevController.studio_post);

router.get('/stems', authController.checkAuthenticated, stemsController.stems_get);
router.post('/stem1', stemsController.stem_post(0));
router.post('/stem2', stemsController.stem_post(1));
router.post('/stem3', stemsController.stem_post(2));
router.post('/stem4', stemsController.stem_post(3));

router.delete('/stem1', stemsController.stem_delete(0));
router.delete('/stem2', stemsController.stem_delete(1));
router.delete('/stem3', stemsController.stem_delete(2));
router.delete('/stem4', stemsController.stem_delete(3));

router.get('/preview', authController.checkAuthenticated, prevController.preview_get);
router.get('/mobilepreview', authController.checkAuthenticated, prevController.mobilepreview_get);
router.post('/animation', authController.checkAuthenticated, prevController.animation_post);
router.get('/previewanima/:aniid-:newcol-:newtempo', authController.checkAuthenticated, prevController.previewanima);

module.exports = router;
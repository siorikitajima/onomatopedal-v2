const express = require('express');
const router = express.Router();
const stemsController = require('../controllers/stemsController');
const frontController = require('../controllers/frontController');
const authController = require('../controllers/authController');


router.get('/v2demo', authController.checkAuthenticated, frontController.v2demo_get);

module.exports = router;
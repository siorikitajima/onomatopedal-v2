const express = require('express');
const router = express.Router();
const frontController = require('../controllers/frontController');

router.get('/v2demo', frontController.v2demo_get);

module.exports = router;
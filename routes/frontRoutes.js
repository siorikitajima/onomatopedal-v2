const express = require('express');
const router = express.Router();
const frontController = require('../controllers/frontController');

router.get('/v2demo', frontController.v2demo_get);

router.get('/v1/:onomoid', frontController.v1pedal_get);

router.get('/v1', frontController.v1list_get);

router.get('/about', (req, res) => {
    res.render('about', { title: 'About', nav:'about' })
});

module.exports = router;
const express = require('express');
const router = express.Router();
const frontController = require('../controllers/frontController');

router.get('/v2demo', frontController.v2demo_get);

router.get('/v1/:onomoid', frontController.v1pedal_get);

router.get('/v1', frontController.v1list_get);

router.get('/feat/:featid', (req, res) => {
    var featid = req.params.featid;
    res.render('sample', { title: 'Sample', nav:'feat-single', featid: featid })
});

router.get('/feat', (req, res) => {
    res.render('feat', { title: 'Featured', nav:'feat' })
});

router.get('/about', (req, res) => {
    res.render('about', { title: 'About', nav:'about' })
});

module.exports = router;
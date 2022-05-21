const express = require('express');
const router = express.Router();
const sampleTestController = require('../controllers/sampleTestController');
const fs = require('fs');

router.get('/sample-test', (req, res) => {
    let rawdata = fs.readFileSync('./json/pitches.json');
    let pitches = JSON.parse(rawdata);
    res.render('sampleTest', { 
        title: 'Test', 
        nav:'test',
        pitches: pitches
    });
})
router.post('/sample-test', sampleTestController.sample_test);

module.exports = router;
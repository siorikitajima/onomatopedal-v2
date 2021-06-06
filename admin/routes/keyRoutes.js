const express = require('express');
const router = express.Router();
const keyController = require('../controllers/keyController');

router.get('/keys', keyController.key_index);
router.post('/keys', keyController.key_update);
router.get('/keyEditor-:thekey', keyController.key_render);

module.exports = router;
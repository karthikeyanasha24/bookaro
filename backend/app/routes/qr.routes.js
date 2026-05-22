const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/qrFlyerController');

router.get('/:token', ctrl.trackQr);

module.exports = router;

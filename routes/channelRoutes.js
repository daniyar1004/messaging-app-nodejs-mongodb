const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channelController');

router.get('/channels', channelController.getAllChannels);
router.post('/channels', channelController.createChannel);

module.exports = router;

const Channel = require('../models/channel');

exports.getAllChannels = async (req, res) => {
    try {
        const channels = await Channel.find().populate('users');
        res.json(channels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createChannel = async (req, res) => {
    try {
        const newChannel = await Channel.create(req.body);
        res.json(newChannel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

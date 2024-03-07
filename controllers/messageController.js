const Message = require('../models/message');

exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find().populate('user').populate('channel');
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createMessage = async (req, res) => {
    try {
        const newMessage = await Message.create(req.body);
        res.json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' },
    reactions: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            type: { type: String, enum: ['like', 'dislike'], required: true },
        },
    ],
    sentAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);

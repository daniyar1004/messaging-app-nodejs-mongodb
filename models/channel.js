const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Channel', channelSchema);

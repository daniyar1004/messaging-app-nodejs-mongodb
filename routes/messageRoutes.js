const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const Channel = require('../models/channel');

// Route to send a message from one user to another
router.post('/send-message', async (req, res) => {
    try {
        const { senderId, receiverId, content } = req.body;

        // You may want to add more validation or error handling here

        const newMessage = await Message.create({
            sender: senderId,
            receiver: receiverId,
            content,
        });

        res.status(201).json({ message: 'Message sent successfully', newMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/send-channel-message', async (req, res) => {
    try {
        const { senderId, content, channelId } = req.body;

        // Check if the sender is a member of the channel
        const isMember = await Channel.exists({ _id: channelId, users: senderId });

        if (!isMember) {
            return res.status(403).json({ error: 'Sender is not a member of the channel' });
        }


        const newMessage = await Message.create({
            sender: senderId,
            content,
            channel: channelId,
        });

        res.status(201).json({ message: 'Message sent to channel successfully', newMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/react-message', async (req, res) => {
    try {
        const { userId, messageId, reactionType } = req.body;

        // Check if the message exists
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        // Check if the user is allowed to react to the message
        const isMember = message.channel
            ? await Channel.exists({ _id: message.channel, users: userId })
            : message.sender.equals(userId);

        if (!isMember) {
            return res.status(403).json({ error: 'User is not allowed to react to the message' });
        }

        // Check if the user has already reacted to the message
        const existingReactionIndex = message.reactions.findIndex(
            (react) => react.userId.equals(userId)
        );

        if (existingReactionIndex !== -1) {
            // If the user has already reacted, update the existing reaction
            message.reactions[existingReactionIndex].type = reactionType;
        } else {
            // If the user has not reacted, add a new reaction
            message.reactions.push({ userId, type: reactionType });
        }

        await message.save();

        res.status(200).json({ message: 'Reaction added successfully', updatedMessage: message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/search-messages', async (req, res) => {
    try {
        const { content } = req.query;

        const messages = await Message.find({ content: { $regex: content, $options: 'i' } })
            .sort({ createdAt: 'asc' });

        res.json({ messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get messages between two users
router.get('/get-messages', async (req, res) => {
    try {
        const { senderId, receiverId } = req.query;


        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ],
        }).sort({ createdAt: 'asc' });

        res.json({ messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

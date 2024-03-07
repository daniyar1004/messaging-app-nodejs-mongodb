const User = require('../models/user');

exports.registerUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        req.session.userId = newUser._id; // Set the user ID in the session
        res.json({ user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Authentication failed. Incorrect password.' });
        }

        req.session.userId = user._id; // Set the user ID in the session
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const secretKey = "hmztpal353842";
const options = { expiresIn: "1d" };

router.post("/register", async (req, res) => {
    try {
        const user = new User(req.body);
        user._id = uuidv4();
        user.createdDate = new Date();

        const checkUserEmail = await User.findOne({ email: user.email });

        if (checkUserEmail != null) {
            res.status(400).json({ message: "Email already exists" });
        }
        else {
            await user.save();
            const token = jwt.sign({}, secretKey, options);
            let model = {
                user: user,
                token: token
            }
            res.status(201).json(model);
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
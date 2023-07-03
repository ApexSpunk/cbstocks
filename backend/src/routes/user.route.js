const User = require('../models/user');
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express.Router();


// app.post('/register', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const getuser = await User.findOne({ email });
//         if (getuser) {
//             return res.status(400).json({ message: 'User already exists' });
//         }
//         const user = await User.create({ email, password });
//         return res.status(201).send({ message: 'User Registered Successfully' });
//     } catch (error) {
//         return res.status(404).send({ error: 'Something went wrong' });
//     }
// });


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: 'User does not exist' });
        }
        if (user.password !== password) {
            return res.status(400).send({ message: 'Password is incorrect' });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1w' });
        return res.status(200).send({ message: 'Login successful', token });
    } catch (error) {
        return res.status(404).send({ message: 'Something went wrong' });
    }
});

module.exports = app;
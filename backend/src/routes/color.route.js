const express = require('express');
const app = express.Router();
const Color = require('../models/color');

app.get('/', async (req, res) => {
    try {
        const colors = await Color.find();
        res.send({ success: true, colors });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.post('/', async (req, res) => {
    const { name, code } = req.body;
    try {
        const color = new Color({ name, code });
        await color.save();
        res.send({ success: true, color });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, code } = req.body;
    try {
        const color = await Color.findByIdAndUpdate(id, { name, code }, { new: true });
        res.send({ success: true, color });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const color = await Color.findByIdAndDelete(id);
        res.send({ success: true, color });
    } catch (error) {
        res.send({ success: false, error });
    }
});

module.exports = app;


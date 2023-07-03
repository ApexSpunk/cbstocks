const express = require('express');
const app = express.Router();
const Tags = require('../models/tags');
const middleware = require('../config/middleware');

app.get('/', async (req, res) => {
    try {
        const tags = await Tags.find();
        res.send({ success: true, tags });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.post('/', middleware, async (req, res) => {
    const { name } = req.body;
    try {
        const tag = new Tags({ name });
        await tag.save();
        res.send({ success: true, tag });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.delete('/:id', middleware, async (req, res) => {
    const { id } = req.params;
    try {
        const tag = await Tags.findByIdAndDelete(id);
        res.send({ success: true, tag });
    } catch (error) {
        res.send({ success: false, error });
    }
});

module.exports = app;


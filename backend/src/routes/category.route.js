const express = require('express');
const app = express.Router();
const Category = require('../models/category');

app.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.send({ success: true, categories });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.post('/', async (req, res) => {
    const { name, image } = req.body;
    try {
        const category = new Category({ name, image });
        await category.save();
        res.send({ success: true, category });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, image } = req.body;
    try {
        const category = await Category.findByIdAndUpdate(id, { name, image }, { new: true });
        res.send({ success: true, category });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findByIdAndDelete(id);
        res.send({ success: true, category });
    } catch (error) {
        res.send({ success: false, error });
    }
});



module.exports = app;
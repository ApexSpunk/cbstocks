const express = require('express');
const app = express.Router();
const Page = require('../models/page');
const Image = require('../models/image');

app.get('/', async (req, res) => {
    try {
        const pages = await Page.find();
        res.send({ success: true, pages });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const page = await Page.findOne({ slug: id })
        const images = await Image.find({ search: page.search }).sort({ downloads: -1, likes: -1, views: -1 }).limit(10).populate({ path: 'category', select: { name: 1, image: 1, likes: 1 } }).populate({ path: 'colors', select: { name: 1, code: 1 } }).populate({ path: 'tags', select: { name: 1 } });
        res.send({ success: true, page, images });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.post('/', async (req, res) => {
    const { title, slug, content, metaTitle, metaDescription, metaKeywords, status, search } = req.body;
    try {
        const page = await Page.create({ title, slug, content, metaTitle, metaDescription, metaKeywords, status, search });
        res.send({ success: true, page });
    } catch (error) {
        res.send({ success: false, error });
    }
});


app.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, slug, content, metaTitle, metaDescription, metaKeywords, status, search } = req.body;
    try {
        const page = await Page.findByIdAndUpdate(id, { title, slug, content, metaTitle, metaDescription, metaKeywords, status, search }, { new: true });
        res.send({ success: true, page });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const page = await Page.findByIdAndDelete(id);
        res.send({ success: true, page });
    } catch (error) {
        res.send({ success: false, error });
    }
});

module.exports = app;
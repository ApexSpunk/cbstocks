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
const keywords = ['cb backgrounds', 'hd cb backgrounds', '4k cb backgrounds', 'new cb backgrounds', 'latest cb backgrounds', 'tech rapid cb backgrounds', 'neon cb backgrounds']
await Image.updateMany({}, { $set: { keywords } });
res.send({ success: true });
    // const { id } = req.params;
    // try {
    //     const page = await Page.findOne({ slug: id })
    //     res.send({ success: true, page });
    // } catch (error) {
    //     res.send({ success: false, error });
    // }
});

app.post('/', async (req, res) => {
    const { title, slug, content, metaTitle, metaDescription, metaKeywords, status } = req.body;
    try {
        const page = await Page.create({ title, slug, content, metaTitle, metaDescription, metaKeywords, status });
        res.send({ success: true, page });
    } catch (error) {
        res.send({ success: false, error });
    }
});


app.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, slug, content, metaTitle, metaDescription, metaKeywords, status } = req.body;
    try {
        const page = await Page.findByIdAndUpdate(id, { title, slug, content, metaTitle, metaDescription, metaKeywords, status }, { new: true });
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
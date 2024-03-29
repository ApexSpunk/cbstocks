const express = require('express');
const app = express.Router();
const Category = require('../models/category');
const multer = require('multer');
const randomstring = require('randomstring');
const slugify = require('slugify');
const path = require('path');
const middleware = require('../config/middleware');
const Image = require('../models/image');


const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        let { name } = req.body; // Get the title from the request body
        const { originalname } = file;
        const randomChars = randomstring.generate({
            length: 6,
            charset: 'alphanumeric',
            capitalization: 'lowercase',
        });
        const slug = slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g }) + '-' + randomChars;
        cb(null, slug + path.extname(originalname)); // Use the slug as the filename
    },
    destination: function (req, file, cb) {
        cb(null, 'image/');
    }
});
const upload = multer({ storage: storage });


app.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.send({ success: true, categories });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.get('/:slug', async (req, res) => {
    const { slug } = req.params;
    let { page, limit } = req.query;
    if (!page) page = 1;
    if (!limit) limit = 60;
    try {
        const category = await Category.findOne({ slug });
        if (!category) return res.send({ success: false, message: 'Category not found' });
        const images = await Image.find({ category: category._id }).skip((page - 1) * limit).limit(limit);
        images.map(image => {
            image.image.url = `https://images.techrapid.in/image/${image.image.url}`;
            return image;
        });
        res.send({ success: true, images });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.post('/', middleware, upload.any('image'), async (req, res) => {
    const { name } = req.body;
    const files = req.files;
    try {
        const image = files.map(file => {
            const { filename } = file;
            return filename;
        });
        const category = await Category.create({ name, image });
        res.send({ success: true, category });
    } catch (error) {
        res.send({ success: false, error });
    }
});


app.patch('/:id', middleware, async (req, res) => {
    const { id } = req.params;
    const { name, image, slug } = req.body;
    try {
        const category = await Category.findByIdAndUpdate(id, { name, image, slug }, { new: true });
        res.send({ success: true, category });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.delete('/:id', middleware, async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findByIdAndDelete(id);
        res.send({ success: true, category });
    } catch (error) {
        res.send({ success: false, error });
    }
});



module.exports = app;
const express = require('express');
const app = express.Router();
const Category = require('../models/category');
const multer = require('multer');
const randomstring = require('randomstring');
const slugify = require('slugify');
const path = require('path');


const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        let { name } = req.body; // Get the title from the request body
        const { originalname } = file;
        const randomChars = randomstring.generate({
            length: 6,
            charset: 'alphanumeric',
            capitalization: 'lowercase',
        });
        name = "category" + name;
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

app.post('/', upload.any('image'), async (req, res) => {
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
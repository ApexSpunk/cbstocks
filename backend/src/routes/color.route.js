const express = require('express');
const app = express.Router();
const Color = require('../models/color');
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
        const colors = await Color.find();
        res.send({ success: true, colors });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.post('/', upload.any('image'), async (req, res) => {
    const { name, code } = req.body;
    const files = req.files;
    console.log(files);
    try {
        const image = files.map(file => {
            const { filename } = file;
            return filename;
        });
        const color = new Color({ name, code, image });
        await color.save();
        res.send({ success: true, color });
    } catch (error) {
        console.log(error);
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


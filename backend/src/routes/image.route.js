const express = require('express');
const app = express.Router();
const Image = require('../models/image');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const path = require('path');

app.get('/', async (req, res) => {
    try {
        const images = await Image.find();
        res.send({ success: true, images });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.post('/upload', upload.array('images'), async (req, res) => {
    const { category, tags } = req.body;
    const files = req.files;
    try {
        const images = files.map(file => {
            const { filename, originalname } = file;
            const image = new Image({ name: originalname, path: filename, category, tags });
            image.save();
            return image;
        });
        res.send({ success: true, images });
    } catch (error) {
        res.send({ success: false, error });
    }
});


app.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, category, tags } = req.body;
    try {
        const image = await Image.findByIdAndUpdate(id, { name, category, tags }, { new: true });
        res.send({ success: true, image });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const image = await Image.findByIdAndDelete(id);
        fs.unlinkSync(path.join(__dirname, `../uploads/${image.path}`));
        res.send({ success: true, image });
    } catch (error) {
        res.send({ success: false, error });
    }
});


module.exports = app;
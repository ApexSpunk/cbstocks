const express = require('express');
const app = express.Router();
const Image = require('../models/image');
const multer  = require('multer');
// make mime type unchanged after uploading
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage });



const fs = require('fs');
const path = require('path');

app.get('/', async (req, res) => {
    let { page, limit, category, color, tag, search } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const query = {};
    if (category) {
        query.category = category;
    }
    if (color) {
        query.color = color;
    }
    if (tag) {
        query.tags = tag;
    }
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }
    try {
        const images = await Image.find(query).skip(skip).limit(limit);
        const updatedImages = images.map(image => {
            image.path = `https://cb.techrapid.in/uploads/${image.path}`;
            return image;
        });
        res.send({ success: true, images: updatedImages });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const image = await Image.findOne({ _id: id });
        res.send({ success: true, image });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.post('/upload', upload.array('images'), async (req, res) => {
    const { name, category, tags, colors } = req.body;
    const files = req.files;
    try {
        const images = files.map(file => {
            const { filename, originalname } = file;
            const image = new Image({ name: name || originalname, path: filename, category, tags, colors });
            image.save();
            return image;
        });
        res.send({ success: true, images });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.post('/like/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const image = await Image.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });
        res.send({ success: true, image });
    } catch (error) {
        res.send({ success: false, error });
    }
});



app.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, category, tags, colors } = req.body;
    try {
        const image = await Image.findByIdAndUpdate(id, { name, category, tags, colors }, { new: true });
        res.send({ success: true, image });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const image = await Image.findByIdAndDelete(id);
        fs.unlink(path.join(__dirname, `../uploads/${image.path.split('/').pop()}`), (err) => {
            if (err) {
                console.error(err)
                return
            }
        }
        );
        res.send({ success: true, image });
    } catch (error) {
        res.send({ success: false, error });
    }
});


module.exports = app;
const express = require('express');
const app = express.Router();
const Image = require('../models/image');
const multer = require('multer');
const cors = require('cors');
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    }
});
const upload = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024, fieldSize: 100 * 1024 * 1024 } });
const allowedOrigins = ['http://localhost:3000', 'https://cbstocks.netlify.app', 'https://cbstocks.netlify.app/'];
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};


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
        query.colors = { $in: [color] };
    }
    if (tag) {
        query.tags = { $in: [tag] };
    }
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }
    try {
        const images = await Image.find(query).sort({ downloads: -1, likes: -1, views: -1 }).skip(skip).limit(limit).populate({ path: 'category', select: { name: 1, image: 1, likes: 1 } }).populate({ path: 'colors', select: { name: 1, code: 1 } }).populate({ path: 'tags', select: { name: 1 } });
        images.map(image => {
            image.path = `https://cb.techrapid.in/uploads/${image.path}`;
            return image;
        });
        res.send({ success: true, images });
    } catch (error) {
        console.log(error);
        res.send({ success: false, error });
    }
});

app.post('/download/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const image = await Image.findByIdAndUpdate(id, { $inc: { downloads: 1 } }, { new: true });
        res.send({ success: true, message: 'Downloaded' });
    } catch (error) {
        console.log(error);
    }
});


app.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const image = await Image.findOne({ _id: id }).populate({ path: 'category', select: { name: 1, image: 1, likes: 1 } }).populate({ path: 'colors', select: { name: 1, code: 1 } }).populate({ path: 'tags', select: { name: 1 } });
        image.views = image.views + 1;
        await image.save();
        image.path = `https://cb.techrapid.in/uploads/${image.path}`;
        res.send({ success: true, image });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.post('/upload', cors(corsOptions), upload.any('images'), async (req, res) => {
    const { name, category, tags, colors } = req.body;
    const files = req.files;
    try {
        const images = files.map(file => {
            const { filename, originalname } = file;
            const image = new Image({ name: name || originalname, path: filename, category, tags, colors });
            image.save().then(image => {
                image.path = `https://cb.techrapid.in/uploads/${image.path}`;
            });
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
        const image = await Image.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true }).populate({ path: 'category', select: { name: 1, image: 1, likes: 1 } }).populate({ path: 'colors', select: { name: 1, code: 1 } }).populate({ path: 'tags', select: { name: 1 } });
        res.send({ success: true, image });
    } catch (error) {
        res.send({ success: false, error });
    }
});



app.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, category, tags, colors } = req.body;
    try {
        const image = await Image.findByIdAndUpdate(id, { name, category, tags, colors }, { new: true }).populate({ path: 'category', select: { name: 1, image: 1, likes: 1 } }).populate({ path: 'colors', select: { name: 1, code: 1 } }).populate({ path: 'tags', select: { name: 1 } });
        res.send({ success: true, image });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const image = await Image.findByIdAndDelete(id);
        fs.unlinkSync(path.join(__dirname, `../../uploads/${image.path}`));
        res.send({ success: true, image });
    } catch (error) {
        console.log(error);
        res.send({ success: false, error });
    }
});


module.exports = app;
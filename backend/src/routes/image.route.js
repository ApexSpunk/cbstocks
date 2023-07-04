const express = require('express');
const app = express.Router();
const Image = require('../models/image');
const multer = require('multer');
const cors = require('cors');
const sizeOf = require('image-size');
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const randomstring = require('randomstring');
const { unlink } = require('fs').promises;
const middleware = require('../config/middleware');
const Tag = require('../models/tags');
const Category = require('../models/category');

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        const { title } = req.body; // Get the title from the request body
        const { originalname } = file;
        const randomChars = randomstring.generate({
            length: 6,
            charset: 'alphanumeric',
            capitalization: 'lowercase',
        });
        const slug = slugify(title, { lower: true, remove: /[*+~.()'"!:@]/g }) + '-' + randomChars;
        cb(null, slug + path.extname(originalname)); // Use the slug as the filename
    },
    destination: function (req, file, cb) {
        cb(null, 'image/');
    }
});


const upload = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024, fieldSize: 100 * 1024 * 1024 } });

app.get('/', async (req, res) => {
    let { page, limit, category, color, tag, search, type, tagname } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const query = {};

    if (category) {
        query.category = { name: { $regex: category, $options: 'i' } };
    }
    if (color) {
        query.colors = { $in: [color] };
    }
    if (tag) {
        query['tags.name'] = { $regex: tag, $options: 'i' };
    }
    if (tagname) {
        query['tags.name'] = { $regex: tagname, $options: 'i' };
    }
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { 'image.url': { $regex: search, $options: 'i' } },
            { 'category.name': { $regex: search, $options: 'i' } },
            { 'tags.name': { $regex: search, $options: 'i' } },
            { altText: { $regex: search, $options: 'i' } },
            { slug: { $regex: search, $options: 'i' } },
            { keywords: { $regex: search, $options: 'i' } },
        ];
    }



    if (type === 'admin') {
        const images = await Image.find()
        images.map(image => {
            image.image.url = `https://images.techrapid.in/image/${image.image.url}`;
            return image;
        });
        res.send({ success: true, images });
    }
    try {
        const images = await Image.find(query).sort({ downloads: -1, likes: -1, views: -1 }).skip(skip).limit(limit).populate({ path: 'category', select: { name: 1, image: 1, likes: 1 } }).populate({ path: 'colors', select: { name: 1, code: 1 } }).populate({ path: 'tags', select: { name: 1 } });
        images.map(image => {
            image.image.url = `https://images.techrapid.in/image/${image.image.url}`;
            return image;
        });
        res.send({ success: true, images });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.get('/sitemap', async (req, res) => {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    try {
        const images = await Image.find().select('slug updatedAt').skip(skip).limit(limit);

        res.send({ success: true, images });
    } catch (error) {
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
        const image = await Image.findOne({ slug: id }).populate({ path: 'category', select: { name: 1, image: 1, likes: 1 } }).populate({ path: 'colors', select: { name: 1, code: 1 } }).populate({ path: 'tags', select: { name: 1 } });
        image.views = image.views + 1;
        image.updatedAt = Date.now();
        await image.save();
        image.path = `https://images.techrapid.in/image/${image.path}`;
        res.send({ success: true, image });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.post('/upload', middleware, upload.any('images'), async (req, res) => {
    let { title, description, uploadedBy, altText, category, tags, colors, keywords } = req.body;
    const files = req.files;
    if (keywords) {
        var newTitle = title + ' ' + keywords.split(',').map(keyword => keyword.trim())[Math.floor(Math.random() * keywords.split(',').map(keyword => keyword.trim()).length)];
    } else {
        var newTitle = title
    }
    try {
        const images = files.map(file => {
            const { filename } = file;
            const dimensions = sizeOf(file.path);
            const randomChars = randomstring.generate({
                length: 6,
                charset: 'alphanumeric',
                capitalization: 'lowercase',
            });
            const image = {
                title: newTitle,
                description,
                image: {
                    url: filename,
                    size: `${dimensions.width}x${dimensions.height}`,
                    fileSize: `${(file.size / 1024).toFixed(2)} KB`,
                    resolution: dimensions.width * dimensions.height > 3840 * 2160 ? '8k' : dimensions.width * dimensions.height > 1920 * 1080 ? '4k' : dimensions.width * dimensions.height > 1280 * 720 ? '2k' : '1080',
                },
                category,
                tags,
                colors,
                uploadedBy,
                altText: title,
                slug: slugify(newTitle, { lower: true, remove: /[*+~.()'"!:@]/g }) + '-' + randomChars,
                keywords,
            };
            return image;
        });
        const imagesSaved = await Image.insertMany(images);
        res.send({ success: true, images: imagesSaved });
    } catch (error) {
        await Promise.all(files.map(file => unlink(file.path))); // Delete the files if there's an error
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



app.patch('/:id', middleware, async (req, res) => {
    const { id } = req.params;
    const { name, category, tags, colors } = req.body;
    try {
        const image = await Image.findByIdAndUpdate(id, { name, category, tags, colors }, { new: true }).populate({ path: 'category', select: { name: 1, image: 1, likes: 1 } }).populate({ path: 'colors', select: { name: 1, code: 1 } }).populate({ path: 'tags', select: { name: 1 } });
        res.send({ success: true, image });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.delete('/:id', middleware, async (req, res) => {
    const { id } = req.params;
    try {
        const image = await Image.findByIdAndDelete(id);
        fs.unlinkSync(path.join(__dirname, `../../image/${image?.image?.url}`));
        res.send({ success: true, image });
    } catch (error) {
        res.send({ success: false, error });
    }
});


module.exports = app;
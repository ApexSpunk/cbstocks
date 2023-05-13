const express = require('express');
const app = express.Router();
const Category = require('../models/category');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage });


app.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        categories.map(category => {
            category.image = `https://images.techrapid.in/${category.image}`;
        });
        res.send({ success: true, categories });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.post('/', upload.single('image'), async (req, res) => {
    const { name } = req.body;
    const { path } = req.file;
    try {
        const category = await Category.create({ name, image: path });
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
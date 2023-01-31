const express = require('express');
const connect = require('./config/connect');
require('dotenv').config();
const PORT = process.env.PORT;
const cors = require('cors');
const categoryRoute = require('./routes/category.route');
const imageRoute = require('./routes/image.route');
const colorRoute = require('./routes/color.route');
const sharp = require('sharp');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/category', categoryRoute);
app.use('/image', imageRoute);
app.use('/color', colorRoute);

app.get('/', (req, res) => {
    res.send({ message: 'Welcome to cbstocks' });
});

app.get('/test', (req, res) => {
    res.send({ message: 'Welcome to cbstockssdfds' });
});

// use sharp to resize image and make uploads folder public and accessible
app.use('/uploads', express.static('uploads'));
app.use('/resized', express.static('resized'));
app.get('/resize', async (req, res) => {
    const { width, height, filename } = req.query;
    const path = `uploads/${filename}`;
    const resizedPath = `resized/${filename}`;
    await sharp(path)
        .resize(width, height)
        .toFile(resizedPath);
    res.send({ success: true, path: resizedPath });
});




app.listen(PORT, () => {
    connect()
    console.log(`Server is running on port ${PORT}`);
});



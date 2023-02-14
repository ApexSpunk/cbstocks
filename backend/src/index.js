const express = require('express');
const connect = require('./config/connect');
require('dotenv').config();
const PORT = process.env.PORT;
const cors = require('cors');
const categoryRoute = require('./routes/category.route');
const imageRoute = require('./routes/image.route');
const colorRoute = require('./routes/color.route');
const tagRoute = require('./routes/tags.route');
const sharp = require('sharp');

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

const app = express();
app.use(express.json());
app.use(cors());
app.use('/category', categoryRoute);
app.use('/image', imageRoute);
app.use('/color', colorRoute);
app.use('/tags', tagRoute);
app.options('/upload', cors(corsOptions));

app.get('/', (req, res) => {
    res.send({ message: 'Welcome to cbstocks' });
});

app.get('/test', (req, res) => {
    res.send({ message: 'Welcome to cbstockssdfds' });
});


app.get('/uploads/:image', async (req, res) => {
    const { image } = req.params;
    const { width, height } = req.query;
    const path = `uploads/${image}`;
    try {
        if (width && height) {
            const buffer = await sharp(path).resize(parseInt(width), parseInt(height)).toBuffer();
            res.set('Content-Type', 'image/jpeg');
            res.send(buffer);
        } else if (width) {
            const buffer = await sharp(path).resize(parseInt(width)).toBuffer();
            res.set('Content-Type', 'image/jpeg');
            return res.send(buffer);
        } else {
            const buffer = await sharp(path).toBuffer();
            res.set('Content-Type', 'image/jpeg');
            return res.send(buffer);
        }
    } catch (error) {
        res.send({ success: false, error });
    }
});



app.listen(PORT, () => {
    connect()
    console.log(`Server is running on port ${PORT}`);
});



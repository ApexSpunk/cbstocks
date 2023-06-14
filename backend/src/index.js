const express = require('express');
const connect = require('./config/connect');
require('dotenv').config();
const PORT = process.env.PORT;
const cors = require('cors');
const categoryRoute = require('./routes/category.route');
const imageRoute = require('./routes/image.route');
const colorRoute = require('./routes/color.route');
const tagRoute = require('./routes/tags.route');
const pageRoute = require('./routes/page.route');
const sharp = require('sharp');
const corsOptions = {
    origin: '*',
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use(cors());
app.use('/category', categoryRoute);
app.use('/images', imageRoute);
app.use('/color', colorRoute);
app.use('/tags', tagRoute);
app.use('/page', pageRoute);

app.get('/', (req, res) => {
    res.send({ message: 'Welcome to Techrapid' });
});

app.get('/image/:image', async (req, res) => {
    const { image } = req.params;
    res.sendFile(`${__dirname}/image/${image}`);
    // const { width, height } = req.query;
    // const path = `image/${image}`;
    // try {
    //     if (width && height) {
    //         const buffer = await sharp(path).resize(parseInt(width), parseInt(height)).toBuffer();
    //         res.set('Content-Type', 'image/jpeg');
    //         res.send(buffer);
    //     } else if (width) {
    //         const buffer = await sharp(path).resize(parseInt(width)).toBuffer();
    //         res.set('Content-Type', 'image/jpeg');
    //         return res.send(buffer);
    //     } else {
    //         const buffer = await sharp(path).toBuffer();
    //         res.set('Content-Type', 'image/jpeg');
    //         return res.send(buffer);
    //     }
    // } catch (error) {
    //     res.send({ success: false, error });
    // }
});



app.listen(PORT, () => {
    connect()
    console.log(`Server is running on port ${PORT}`);
});



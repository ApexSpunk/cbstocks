const express = require('express');
const connect = require('./config/connect');
require('dotenv').config();
const PORT = process.env.PORT;
const cors = require('cors');
const categoryRoute = require('./routes/category.route');
const imageRoute = require('./routes/image.route');
const colorRoute = require('./routes/color.route');


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



app.listen(PORT, () => {
    connect()
    console.log(`Server is running on port ${PORT}`);
});



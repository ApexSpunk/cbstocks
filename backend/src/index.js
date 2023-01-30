const express = require('express');
const connect = require('./config/connect');
require('dotenv').config();
const PORT = process.env.PORT;
const cors = require('cors');
const categoryRoute = require('./routes/category.route');


const app = express();
app.use(express.json());
app.use(cors());
app.use('/category', categoryRoute);

app.get('/', (req, res) => {
    res.send({ message: 'Welcome to cbstocks' });
});


app.listen(PORT, async () => {
    await connect()
    console.log(`Server is running on port ${PORT}`);
});



const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const connect = async () => {
    return await mongoose.connect("mongodb+srv://ApexSpunk:masai6X@masai.21uwirt.mongodb.net/mock12?retryWrites=true&w=majority");
};

module.exports = connect;

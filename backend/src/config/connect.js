const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const connect = async () => {
    return await mongoose.connect("mongodb+srv://techRapid:8Q8Xjz1oCG6umB1c@masai.21uwirt.mongodb.net/cbstocks?retryWrites=true&w=majority");
};

module.exports = connect;

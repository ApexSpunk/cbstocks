const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: Array, required: true },
    likes: { type: Number, default: 0 },
    slug: { type: String, required: true, unique: true },
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;

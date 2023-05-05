const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: { url: String, size: String, fileSize: String, resolution: String }, required: true },
    likes: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    colors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Color' }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    altText: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    keywords: [{ type: String }],
}, { timestamps: true });

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
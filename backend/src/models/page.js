const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    metaKeywords: { type: String, required: true },
    status: { type: String, required: true, enum: ['active', 'inactive'], default: 'active' },
    search: { type: String, required: true },
}, { timestamps: true });

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;
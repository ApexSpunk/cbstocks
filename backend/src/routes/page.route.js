const express = require('express');
const app = express.Router();
const Page = require('../models/page');
const middleware = require('../config/middleware');

app.get('/', async (req, res) => {
    try {
        const pages = await Page.find();
        res.send({ success: true, pages });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const page = await Page.findOne({
        $or: [{ slug: id }, { subDomain: id }]
      });
  
      if (page) {
        res.send({ success: true, page });
      } else {
        res.send({ success: true, page: null });
      }
    } catch (error) {
      res.send({ success: false, error });
    }
  });

app.post('/', middleware, async (req, res) => {
    const { title, slug, content, metaTitle, metaDescription, metaKeywords, status, search, subDomain } = req.body;
    try {
        const page = await Page.create({ title, slug, content, metaTitle, metaDescription, metaKeywords, status, search, subDomain });
        res.send({ success: true, page });
    } catch (error) {
        res.send({ success: false, error });
    }
});


app.patch('/:id', middleware, async (req, res) => {
    const { id } = req.params;
    const { title, slug, content, metaTitle, metaDescription, metaKeywords, status, search } = req.body;
    try {
        const page = await Page.findByIdAndUpdate(id, { title, slug, content, metaTitle, metaDescription, metaKeywords, status, search }, { new: true });
        res.send({ success: true, page });
    } catch (error) {
        res.send({ success: false, error });
    }
});

app.delete('/:id', middleware, async (req, res) => {
    const { id } = req.params;
    try {
        const page = await Page.findByIdAndDelete(id);
        res.send({ success: true, page });
    } catch (error) {
        res.send({ success: false, error });
    }
});

module.exports = app;
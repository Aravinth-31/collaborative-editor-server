const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const { getDateInfo } = require('../utils/functions');

router.get('/all', async (req, res) => {
    try {
        const documents = await Document.find();
        if (documents) {
            res.status(200).json({ success: true, documents });
        } else {
            res.status(500).json({ success: false });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const document = await Document.findById(id);
        if (document) {
            res.status(200).json({ success: true, document });
        } else {
            res.status(500).json({ success: false });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, content = "" } = req.body;
        const document = await Document.create({ content, title, ...getDateInfo() });
        if (document) {
            res.status(200).json({ success: true, document });
        } else {
            res.status(500).json({ success: false });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { content = "" } = req.body;
        const { id } = req.params;
        const document = await Document.findByIdAndUpdate(id, { content });
        if (document) {
            res.status(200).json({ success: true, document });
        } else {
            res.status(500).json({ success: false });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;

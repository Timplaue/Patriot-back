// routes/mapEvents.js
const express = require('express');
const router = express.Router();
const MapEvent = require('../server/models/MapEvent');

// Получение всех проверенных событий
router.get('/', async (req, res) => {
    try {
        const events = await MapEvent.find({ verified: true });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Добавление нового события (с проверкой данных)
router.post('/', async (req, res) => {
    const event = new MapEvent({
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        coordinates: req.body.coordinates,
        source: req.body.source
    });

    try {
        const newEvent = await event.save();
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
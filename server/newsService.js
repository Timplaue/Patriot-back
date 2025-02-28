const express = require('express');
const News = require('./models/News');

const router = express.Router();

// Получить все новости
router.get('/', async (req, res) => {
    try {
        const news = await News.find().sort({ createdAt: -1 }); // Сортировка по дате
        res.json(news);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при получении новостей', error: err });
    }
});

module.exports = router;

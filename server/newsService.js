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

router.get('/:id', async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) {
            return res.status(404).json({ message: 'Новость не найдена' });
        }
        res.json(news);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при получении новости', error: err });
    }
});

module.exports = router;

const express = require('express');
const Event = require('./models/Events');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware для проверки авторизации
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Не авторизован. Пожалуйста, войдите в систему." });

    jwt.verify(token, 'yourSecretKey', (err, user) => { // Используем тот же секретный ключ
        if (err) return res.status(403).json({ message: "Неверный или просроченный токен." });
        req.user = user;
        next();
    });
};

// Получить все мероприятия
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: -1 }); // Сортировка по дате (новые мероприятия сверху)
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при получении мероприятий', error: err });
    }
});

// Получить ближайшее мероприятие
router.get('/next', async (req, res) => {
    try {
        const event = await Event.findOne({ date: { $gte: new Date() } }).sort({ date: 1 }); // Ближайшее мероприятие
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при получении ближайшего мероприятия', error: err });
    }
});

module.exports = router;
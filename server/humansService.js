const express = require('express');
const Humans = require('./models/Humans'); // Путь к вашей модели Humans

const router = express.Router();

// Роут для получения всех данных о людях с фильтрацией по имени, фамилии, и году рождения
router.get('/', async (req, res) => {
    const { name, surname, patronymic, date } = req.query;  // Получаем параметры запроса из URL

    try {
        const filter = {};

        // Фильтрация по имени, фамилии и году
        if (name) filter.name = new RegExp(name, 'i');
        if (surname) filter.surname = new RegExp(surname, 'i');
        if (patronymic) filter.patronymic = new RegExp(patronymic, 'i');
        if (date) filter.date = new RegExp(date, 'i');

        const humans = await Humans.find(filter);
        res.status(200).json(humans);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении данных людей', error: error.message });
    }
});

module.exports = router;

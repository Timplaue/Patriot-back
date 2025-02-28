// forumService.js
const express = require('express');
const ForumPost = require('./models/ForumPosts');
const jwt = require('jsonwebtoken'); // Для проверки токена
const User = require('./models/User'); // Для проверки пользователя (если нужно)

const router = express.Router();

// Мiddleware для проверки авторизации
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Не авторизован' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Неверный токен' });
        req.user = user;
        next();
    });
};

// Получить все сообщения форума
router.get('/', async (req, res) => {
    try {
        const posts = await ForumPost.find().populate('author', 'username').sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при получении сообщений', error: err });
    }
});

// Создать сообщение на форуме
router.post('/', authenticateToken, async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Заполните все поля' });
    }

    try {
        const newPost = new ForumPost({
            author: req.user.id,
            title,
            content
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при создании сообщения', error: err });
    }
});

module.exports = router;

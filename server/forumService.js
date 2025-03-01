const express = require("express");
const ForumPost = require("./models/ForumPosts");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

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

// Получить все сообщения форума с пагинацией
router.get("/", async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Страница и лимит для пагинации
    try {
        const posts = await ForumPost.find()
            .populate("author", "username")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const totalPosts = await ForumPost.countDocuments();
        res.json({
            posts,
            totalPages: Math.ceil(totalPosts / limit),
            currentPage: Number(page)
        });
    } catch (err) {
        res.status(500).json({ message: "Ошибка при получении сообщений", error: err.message });
    }
});

// Создать сообщение на форуме
router.post("/", authenticateToken, async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: "Заполните все поля." });
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
        res.status(500).json({ message: "Ошибка при создании сообщения", error: err.message });
    }
});

// Получить пост по ID (для отображения более подробной информации или комментариев)
router.get("/:id", async (req, res) => {
    try {
        const post = await ForumPost.findById(req.params.id).populate("author", "username");

        if (!post) {
            return res.status(404).json({ message: "Пост не найден." });
        }

        res.json(post);
    } catch (err) {
        res.status(500).json({ message: "Ошибка при получении поста", error: err.message });
    }
});

module.exports = router;

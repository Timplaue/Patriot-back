const express = require("express");
const ForumPost = require("./models/ForumPosts");
const Comment = require("./models/Comment"); // Модель для комментариев
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Настройка Multer для загрузки изображений
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Папка для сохранения изображений
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Уникальное имя файла
    },
});

const upload = multer({ storage });

// Middleware для проверки авторизации
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Не авторизован. Пожалуйста, войдите в систему." });

    jwt.verify(token, "yourSecretKey", (err, user) => {
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
            .populate("author", "username avatar") // Данные автора
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const totalPosts = await ForumPost.countDocuments();
        res.json({
            posts,
            totalPages: Math.ceil(totalPosts / limit),
            currentPage: Number(page),
        });
    } catch (err) {
        console.error("Ошибка при получении сообщений:", err);
        res.status(500).json({ message: "Ошибка при получении сообщений", error: err.message });
    }
});

// Создать сообщение на форуме с возможностью загрузки изображений
router.post("/", authenticateToken, upload.array("images", 5), async (req, res) => {
    const { title, content } = req.body;

    // Проверка обязательных полей
    if (!title || !content) {
        return res.status(400).json({ message: "Заполните все поля: заголовок и содержание." });
    }

    try {
        const images = req.files?.map((file) => file.path); // Пути к загруженным изображениям

        const newPost = new ForumPost({
            author: req.user.id,
            title,
            content,
            images,
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        console.error("Ошибка при создании сообщения:", err);
        res.status(500).json({ message: "Ошибка при создании сообщения", error: err.message });
    }
});

// Получить пост по ID с комментариями
router.get("/:id", async (req, res) => {
    try {
        const post = await ForumPost.findById(req.params.id)
            .populate("author", "username avatar") // Данные автора
            .populate({
                path: "comments",
                populate: { path: "author", select: "username avatar" }, // Данные авторов комментариев
            });

        if (!post) {
            return res.status(404).json({ message: "Пост не найден." });
        }

        res.json(post);
    } catch (err) {
        console.error("Ошибка при получении поста:", err);
        res.status(500).json({ message: "Ошибка при получении поста", error: err.message });
    }
});

// Добавить комментарий к посту
router.post("/:id/comment", authenticateToken, upload.array("images", 3), async (req, res) => {
    const { content } = req.body;

    // Проверка обязательных полей
    if (!content) {
        return res.status(400).json({ message: "Комментарий не может быть пустым." });
    }

    try {
        const images = req.files?.map((file) => file.path); // Пути к загруженным изображениям

        const newComment = new Comment({
            author: req.user.id,
            post: req.params.id,
            content,
            images,
        });

        await newComment.save();

        // Добавляем комментарий в пост
        await ForumPost.findByIdAndUpdate(req.params.id, {
            $push: { comments: newComment._id },
        });

        res.status(201).json(newComment);
    } catch (err) {
        console.error("Ошибка при добавлении комментария:", err);
        res.status(500).json({ message: "Ошибка при добавлении комментария", error: err.message });
    }
});

// Обновить рейтинг поста
router.post("/:id/rate", authenticateToken, async (req, res) => {
    const { rating } = req.body;

    // Проверка корректности рейтинга
    if (rating === undefined || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Рейтинг должен быть от 1 до 5." });
    }

    try {
        const post = await ForumPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Пост не найден." });
        }

        // Обновляем рейтинг (простая реализация)
        post.rating = (post.rating + rating) / 2; // Пример: среднее значение
        await post.save();

        res.json(post);
    } catch (err) {
        console.error("Ошибка при обновлении рейтинга:", err);
        res.status(500).json({ message: "Ошибка при обновлении рейтинга", error: err.message });
    }
});

module.exports = router;
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const secretKey = 'yourSecretKey';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ message: 'Токен отсутствует' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Ошибка аутентификации' });
        }
        req.userId = decoded.id;
        next();
    });
};

router.post('/register', async (req, res) => {
    const { name, surname, birthDate, username, password } = req.body;

    if (!name || !surname || !birthDate || !username || !password) {
        return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            surname,
            birthDate,
            username,
            password: hashedPassword,
        });
        await user.save();
        res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
    } catch (error) {
        console.error("Ошибка в /api/auth/register:", error.message);
        res.status(500).json({ message: 'Ошибка регистрации' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Пользователь не найден' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Неправильный пароль' });
        }

        const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка авторизации' });
    }
});

router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        res.json({
            name: user.name,
            surname: user.surname,
            birthDate: user.date,
            username: user.username,
            avatarUrl: user.avatarUrl,
            registrationDate: user.registrationDate,
        });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении профиля' });
    }
});

router.post('/upload-avatar', verifyToken, upload.single('avatar'), async (req, res) => {
    try {
        const avatarUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        await User.findByIdAndUpdate(req.userId, { avatarUrl });
        res.json({ avatarUrl });
    } catch (error) {
        console.error("Ошибка загрузки аватара:", error);
        res.status(500).json({ message: 'Ошибка загрузки аватара' });
    }
});

module.exports = router;

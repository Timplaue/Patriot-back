const mongoose = require('mongoose');
const MapEvent = require('./models/MapEvent'); // Путь к вашей модели

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/patriot', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Тестовые данные
const mapEvents = [
    {
        title: "Военный конфликт в регионе А",
        description: "Столкновение между вооруженными группами.",
        type: "military",
        coordinates: [50.45, 30.52], // Координаты (широта, долгота)
        date: new Date("2023-10-15"),
        source: "Официальный источник 1",
        verified: true,
    },
    {
        title: "Гуманитарная помощь в регионе Б",
        description: "Доставка продовольствия и медикаментов.",
        type: "civilian",
        coordinates: [51.51, 31.30],
        date: new Date("2023-10-16"),
        source: "Официальный источник 2",
        verified: true,
    },
    {
        title: "Дорожная авария на трассе М-05",
        description: "Столкновение двух грузовиков.",
        type: "other",
        coordinates: [49.23, 28.48],
        date: new Date("2023-10-17"),
        source: "Официальный источник 3",
        verified: false,
    },
    {
        title: "Военные учения в регионе В",
        description: "Плановые учения с участием военной техники.",
        type: "military",
        coordinates: [48.38, 35.04],
        date: new Date("2023-10-18"),
        source: "Официальный источник 4",
        verified: true,
    },
    {
        title: "Открытие нового госпиталя",
        description: "Госпиталь начал принимать пациентов.",
        type: "civilian",
        coordinates: [47.85, 35.17],
        date: new Date("2023-10-19"),
        source: "Официальный источник 5",
        verified: true,
    },
];

// Функция для загрузки данных
const seedDatabase = async () => {
    try {
        // Очистка коллекции (опционально)
        await MapEvent.deleteMany({});
        console.log("Коллекция MapEvent очищена.");

        // Добавление тестовых данных
        await MapEvent.insertMany(mapEvents);
        console.log("Тестовые данные успешно добавлены.");

        // Закрытие соединения
        mongoose.connection.close();
        console.log("Соединение с базой данных закрыто.");
    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
    }
};

// Запуск скрипта
seedDatabase();
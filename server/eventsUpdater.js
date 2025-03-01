const mongoose = require("mongoose");
const Event = require("./models/Events"); // Модель для мероприятий

// Подключение к базе данных MongoDB
mongoose.connect("mongodb://localhost:27017/patriot", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Массив данных о мероприятиях
const events = [
    {
        name: "Мероприятие 1",
        description: "Описание первого мероприятия.",
        date: "2025-04-10T12:00:00Z", // Пример: 10 апреля 2025 года
        imgUrl: "https://example.com/event1.jpg",
        location: "Якутск",
    },
    {
        name: "Мероприятие 2",
        description: "Описание второго мероприятия.",
        date: "2025-05-15T14:30:00Z", // Пример: 15 мая 2025 года
        imgUrl: "https://example.com/event2.jpg",
        location: "Якутск",
    },
    {
        name: "Мероприятие 3",
        description: "Описание третьего мероприятия.",
        date: "2025-06-20T16:00:00Z", // Пример: 20 июня 2025 года
        imgUrl: "https://example.com/event3.jpg",
        location: "Якутск",
    },
];

// Функция для добавления мероприятий в базу данных
const seedDatabase = async () => {
    try {
        // Удаляем все старые записи в коллекции Event перед добавлением новых
        // await Event.deleteMany({});

        // Добавляем новые мероприятия в базу данных
        for (const eventData of events) {
            const newEvent = new Event({
                name: eventData.name,
                description: eventData.description,
                date: new Date(eventData.date),
                imgUrl: eventData.imgUrl,
                location: eventData.location,
            });

            // Сохраняем мероприятие в базе
            await newEvent.save();
        }

        console.log("База данных мероприятий успешно заполнена!");
    } catch (error) {
        console.error("Ошибка при заполнении базы данных мероприятий:", error);
    } finally {
        // Закрываем соединение с базой данных
        mongoose.connection.close();
    }
};

// Запуск функции заполнения базы
seedDatabase();

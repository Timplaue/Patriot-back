const mongoose = require("mongoose");
const News = require("./models/News");

// Подключение к базе данных MongoDB
mongoose.connect("mongodb://localhost:27017/patriot", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const news = [
    {
        title: "Россия и наши союзники. Проблем меньше не будет",
        content: "Читать далее",
        imgUrl: "/images/news4.png",
    },
    {
        title: "28 февраля: какой сегодня праздник, что отмечают в России и мире?",
        content: "Читать далее",
        imgUrl: "/images/news5.png",
    },
    {
        title: "Отключение Skype официально подтвердили в Microsoft",
        content: "Читать далее",
        imgUrl: "/images/news6.png",
    },
];

const seedDatabase = async () => {
    try {
        // Удаляем все старые записи в коллекции News перед добавлением новых
        // await News.deleteMany({});

        // Добавляем новые новости в базу данных
        for (const newsData of news) {
            const newNews = new News({
                title: newsData.title,
                content: newsData.content,
                imgUrl: newsData.imgUrl,
            });

            // Сохраняем новость в базе
            await newNews.save();
        }

        console.log("База данных успешно заполнена!");
    } catch (error) {
        console.error("Ошибка при заполнении базы данных:", error);
    } finally {
        // Закрываем соединение с базой данных
        mongoose.connection.close();
    }
};

seedDatabase();

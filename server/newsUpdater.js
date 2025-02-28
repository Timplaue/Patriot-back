const mongoose = require("mongoose");
const News = require("./models/News");

// Подключение к базе данных MongoDB
mongoose.connect("mongodb://localhost:27017/patriot", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const news = [
    {
        title: "Новая новость 1",
        content: "Это содержимое первой новости.",
        imgUrl: "https://avatars.mds.yandex.net/i?id=679720f2a94327342bb6a0e160ce7bb8_l-8497208-images-thumbs&n=13",
    },
    {
        title: "Новая новость 2",
        content: "Это содержимое второй новости.",
        imgUrl: "https://example.com/image2.jpg",
    },
    {
        title: "Новая новость 3",
        content: "Это содержимое третьей новости.",
        imgUrl: "https://example.com/image3.jpg",
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

const mongoose = require("mongoose");
const Humans = require("./models/Humans");

// Подключение к базе данных MongoDB
mongoose.connect("mongodb://localhost:27017/patriot", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const news = [
    {
        name: "Николай",
        surname: "Егоров",
        patronymic: "Дмитриевич",
        imgUrl: "/images/human1.png",
        location: "Якутск",
        post: "Рядовой гвардии / снайпер, стрелок",
        date: "15.02.1923 - 20.06.1983",
    },
    {
        name: "Саввин",
        surname: "Власий",
        patronymic: "Васильевич",
        imgUrl: "/images/human2.png",
        location: "Якутск",
        post: "Был призван на службу 7 сентября 1941 года, служил в 398-м комбате 79-й дивизии",
        date: "15.02.1923 - 20.06.1983",
    },
];

const seedDatabase = async () => {
    try {
        await Humans.deleteMany({});

        // Добавляем новые новости в базу данных
        for (const humansData of news) {
            const newHumans = new Humans({
                name: humansData.name,
                surname: humansData.surname,
                patronymic: humansData.patronymic,
                imgUrl: humansData.imgUrl,
                location: humansData.location,
                post: humansData.post,
                date: humansData.date,
            });

            // Сохраняем новость в базе
            await newHumans.save();
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

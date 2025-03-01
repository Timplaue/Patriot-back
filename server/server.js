const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./authService');
const newsRouter = require('./newsService');
const forumRouter = require('./forumService');
const eventsRouter = require('./eventsService');
const humansRouter = require('./humansService');
const mapEventsRouter = require('../routes/mapEvents');
const path = require('path');
const app = express();
const PORT = 5000;

mongoose.connect('mongodb://localhost:27017/patriot', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB подключено")).catch(err => console.error("Ошибка:", err));

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRouter);
app.use('/api/humans', humansRouter);
app.use('/api/news', newsRouter);
app.use('/api/forum', forumRouter);
app.use('/api/events', eventsRouter);
app.use('/api/map-events', mapEventsRouter);

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});

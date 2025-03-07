const mongoose = require('mongoose');

const ForumPostSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, // Ссылка на пользователя
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    images: [{
        type: String // Ссылки на изображения (хранятся в облаке или на сервере)
    }],
    rating: {
        type: Number,
        default: 0
    }, // Рейтинг поста
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }], // Ссылки на комментарии
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }, // Дата последнего обновления
});

module.exports = mongoose.model('ForumPost', ForumPostSchema);
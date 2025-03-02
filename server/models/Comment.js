const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, // Ссылка на пользователя
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ForumPost',
        required: true
    }, // Ссылка на пост
    content: {
        type: String,
        required: true
    }, // Текст комментария
    rating: {
        type: Number,
        default: 0
    }, // Рейтинг комментария
    images: [{
        type: String
    }], // Ссылки на изображения
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }, // Дата последнего обновления
});

module.exports = mongoose.model('Comment', CommentSchema);
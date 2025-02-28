const mongoose = require('mongoose');

const ForumPostSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ссылка на пользователя
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ForumPost', ForumPostSchema);

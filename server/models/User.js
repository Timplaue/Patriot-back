const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    birthDate: Date,
    username: { type: String, unique: true },
    password: { type: String, required: true },
    avatarUrl: String,
    registrationDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);

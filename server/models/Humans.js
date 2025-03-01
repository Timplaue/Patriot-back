const mongoose = require("mongoose");

const HumansSchema = new mongoose.Schema(
    {
        name: {type: String, required: true,},
        surname: {type: String, required: true,},
        patronymic: {type: String, required: true,},
        imgUrl: {type: String, required: true,},
        location: {type: String, required: true,},
        post: {type: String, required: true,},
        date: {type: String, required: true,},
    }
);
module.exports = mongoose.model("Humans", HumansSchema);

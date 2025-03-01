// models/MapEvent.js
const mongoose = require('mongoose');

const MapEventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    type: {
        type: String,
        required: true,
        enum: ['military', 'civilian', 'other'],
        default: 'other'
    },
    coordinates: {
        type: [Number],
        required: true,
        validate: {
            validator: function(v) {
                return v.length === 2;
            },
            message: props => `${props.value} must be exactly 2 elements!`
        }
    },
    date: { type: Date, default: Date.now },
    source: { type: String, required: true },
    verified: { type: Boolean, default: false }
});

module.exports = mongoose.model('MapEvent', MapEventSchema);
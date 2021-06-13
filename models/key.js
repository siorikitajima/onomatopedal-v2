const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const keySchema = new Schema({
    pedal: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        required: true
    },
    pitch: {
        type: String,
        required: true
    },
    newSound: {
        type: Boolean,
        required: true
    },
    fileName: {
        type: String
    }
}, { timestamps: false });

const Key = mongoose.model('Key', keySchema);
module.exports = Key;
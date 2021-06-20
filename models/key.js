const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const keySchema = new Schema({
    name: {
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
    sample: {
        type: String
    }
}, { timestamps: true });

const Key = mongoose.model('Key', keySchema);
module.exports = Key;
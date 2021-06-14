const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sampleSchema = new Schema({
    pedal: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    pitch: {
        type: String,
        required: true
    }
}, { timestamps: false });

const Sample = mongoose.model('Sample', sampleSchema);
module.exports = Sample;
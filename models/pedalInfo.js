const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pedalSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    pedalFull: {
        type: String
    },
    onomato: {
        type: String,
        required: true
    },
    onoMeaning: {
        type: String,
        required: true
    },
    trackName: {
        type: String
    },
    artist: {
        type: String
    },
    website: {
        type: String
    },
    animation: {
        type: String
    },
    color: {
        type: String
    },
    tempo: {
        type: String
    }
}, { timestamps: true });

const PedalInfo = mongoose.model('PedalInfo', pedalSchema);
module.exports = PedalInfo;
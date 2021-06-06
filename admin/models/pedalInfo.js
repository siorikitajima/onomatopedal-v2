const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pedalSchema = new Schema({
    pedal: {
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
    }
}, { timestamps: true });

const PedalInfo = mongoose.model('PedalInfo', pedalSchema);
module.exports = PedalInfo;
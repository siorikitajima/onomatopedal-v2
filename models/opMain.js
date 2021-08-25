const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const keySchema = new Schema({
    key: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        required: true
    },
    pitch: {
        type: String
    },
    sample: {
        type: String
    }
});
const sampleSchema = new Schema({
    samplename: {
        type: String,
        required: true
    },
    pitch: {
        type: String,
        required: true
    }
});
const padSchema = new Schema({
    pad: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        required: true
    },
    pitch: {
        type: String
    },
    sample: {
        type: String
    }
});

const opSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    pedalFull: {
        type: String
    },
    onomato: {
        type: String
    },
    onoMeaning: {
        type: String
    },
    trackName: {
        type: String
    },
    trackOnline: {
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
    },
    keys: [ keySchema ],
    pads: [ padSchema ],
    samples: [ sampleSchema ],
    cover: {
        coverPedal: {
            type: String
        },
        coverAnima: {
            type: String
        },
        coverCol: {
            type: String
        },
        coverOno: {
            type: String
        }
    }
}, { timestamps: true });

const OpMain = mongoose.model('opMain', opSchema);
module.exports = OpMain;
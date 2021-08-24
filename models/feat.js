const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const featSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    header: [{}],
    body: [{}],
    published: {
        type: Boolean,
        required: true
    },
    featimg: {
        type: String
    },
    title: {
        type: String
    },
    subtitle: {
        type: String
    },
    desc: {
        type: String
    }
}, { timestamps: true });

const Feat = mongoose.model('Feat', featSchema);
module.exports = Feat;
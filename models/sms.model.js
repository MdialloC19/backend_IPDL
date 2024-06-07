const mongoose = require("mongoose");

const SMSSchema = new mongoose.Schema({
    intitule: {
        type: String,
        required: true,
    },
    contenu: {
        type: String,
        required: true,
    },
    idReceiver: [
        {
            type: Number,
            required: true,
        },
    ],
    date: {
        type: Date,
        default: Date.now,
    },
});

const SMS = mongoose.model("SMS", SMSSchema);

module.exports = SMS;

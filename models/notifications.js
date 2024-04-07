const mongoose = require("mongoose")
const notificationsModel = new mongoose.Schema({

    userFrom: {
        type: Object,
        required: true
    },
    userTo: {
        type: Object,
        required: true
    },
    isShown: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("notifications", notificationsModel)
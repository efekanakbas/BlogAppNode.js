const mongoose = require("mongoose")
const messageModel = new mongoose.Schema({

    user: {
        type: Object,
        required: true
    },
    message: {
       text: {
        type: String,
        required: true
       },
       createAt: {
        type: Date,
        default: Date.now
       }
    }

})

module.exports = mongoose.model("message", messageModel)
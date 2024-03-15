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
       },
       receiver: {
            userId: {
                type: String,
                required: true
            },
            username: {
                type: String,
                required: true
            },
            avatar: {
                type: String,
                default: null
            }
       }
    },
    roomId: {
        type: String,
        required: true
       }

})

module.exports = mongoose.model("message", messageModel)
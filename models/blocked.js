const mongoose = require("mongoose");
const blockedModel = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: null,
  },
  username: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    default: "You have blocked",
  },
});

module.exports = mongoose.model("blocked", blockedModel);

const mongoose = require("mongoose");
const { Schema } = mongoose;

function limitArray(limit){
    return function(value){
        return value.length <= limit;
    }
}

const feedModel = new Schema({
    user: {
        type: Object,
        required: true
    },
    feed: {
        text: {
            type: String,
            required: true
        },
        images: {
            type: Array,
            default: [],
            validate: [limitArray(5), 'Cannot have more than then 5 images']

        },
        liked: {
            type:Boolean,
            default: false
        },
        likeCount: {
            type: Number,
            default: 0
        },
        likePerson: {
            type: [
                {
                     
                 type: Object,
                required: true
                    
                }
            ],
            default: []
        },
        commentsCount: {
            type: Number,
            default: 0
        },
        comments: {
            type: [
                {
                    user: {
                        avatar: {
                            type: String,
                        },
                        username: {
                            type: String,
                            required: true
                        }
                    },
                    comment: {
                        text: {
                            type: String,
                            required: true
                        },
                        liked: {
                            type: Boolean,
                            default: false
                        },
                        likesCount: {
                            type: Number,
                            default: 0
                        }
                    }
                }
            ],
            default: []
        },
        hashtags: {
            type: Array,
            default: []
        },
        mentions: {
            type: Array,
            default: []
        },
        location: {
            type: String,
            default: null
        },
        createAt: {
            type: Date,
            default: Date.now
        }
    }
});

module.exports = mongoose.model("feed", feedModel);

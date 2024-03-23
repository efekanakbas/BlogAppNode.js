const mongoose = require("mongoose")
const authModel = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: null
    },
    cover: {
        type: String,
        default: null
    },
    isLogged: {
        type: Boolean,
        default: false
    },
    userDetails: {
        followers: {
            type: [
                {
                   type: Object,
                   default: null
                }
            ],
            default: []
        },
        followersCount:{
            type: String,
            default: 0
        },
        followings:{
            type: [
                {
                   type: Object,
                   default: null
                }
            ],
            default: []
        },
        followingsCount:{
            type: String,
            default: 0
        },
        intro: {
            type: String,
            default: null
        },
        location: {
            type: String,
            default: null
        },
        job: {
            type: String,
            default: null
        },
        mainSkills:{
            type: [
                {
                   type: String,
                   default: null
                }
            ],
            default: []
        },
        complementarySkills:{
            type: [
                {
                   type: String,
                   default: null
                }
            ],
            default: []
        },
        interests:{
            type: [
                {
                   type: String,
                   default: null
                }
            ],
            default: []
        },
        experiences:{
            type: [
                {
                   company: {
                    type: String,
                    default: null
                   },
                   title: {
                    type: String,
                    default: null
                   },
                   contractType: {
                    type: String,
                    default: null
                   },
                   startDate: {
                    type: String,
                    default: null
                   },
                   endDate: {
                    type: String,
                    default: null
                   },
                   current: {
                    type: Boolean,
                    default: false
                   },
                   missions: {
                    type: String,
                    default: null
                   }
                }
            ],
            default: []
        },
        educations:{
            type: [
                {
                   school: {
                    type: String,
                    default: null
                   },
                   degree: {
                    type: String,
                    default: null
                   },
                   startDate: {
                    type: String,
                    default: null
                   },
                   endDate: {
                    type: String,
                    default: null
                   },
                   current: {
                    type: Boolean,
                    default: false
                   },
                   description: {
                    type: String,
                    default: null
                   }
                }
            ],
            default: []
        },
        languages:{
            type: [
                {
                   language: {
                    type: String,
                    default: null
                   },
                   level: {
                    type: String,
                    default: null
                   },
                }
            ],
            default: []
        },
    }
})

module.exports = mongoose.model("auth", authModel)
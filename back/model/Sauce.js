const mongoose = require('mongoose')

const sauceSchema = new mongoose.Schema({
    userId: {
        type: String, 
        required: true,
        max: 255, 
        min: 6
    },
    name: {
        type: String, 
        required: true,
        max: 1024,
        min: 6
    },
    manufacturer: {
        type: String, 
        required: true,
        max: 1024,
        min: 6
    },
    description: {
        type: String, 
        required: true,
        max: 1024,
        min: 6
    },
    mainPepper: {
        type: String, 
        required: true,
        max: 1024,
        min: 6
    },
    imageUrl: {
        type: String, 
        required: true,
    },
    heat: {
        type: Number, 
        required: true,
        max: 10,
        min: 1
    },
    likes: {
        type: Number
    },
    dislikes: {
        type: Number
    },
    usersLiked: {
        type: [String]
    },
    usersDisliked: {
        type: [String]
    }
})

module.exports = mongoose.model('Sauce', sauceSchema)
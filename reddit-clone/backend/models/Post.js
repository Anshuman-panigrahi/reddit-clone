const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
{
    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community"
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    upvotes: {
        type: Number,
        default: 0
    },

    downvotes: {
        type: Number,
        default: 0
    },

    imageUrl: {
        type: String,
        default: ""
    },

    savedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
},
{
    timestamps: true
}
);

module.exports = mongoose.model(
    "Post",
    postSchema
);
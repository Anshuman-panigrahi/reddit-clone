const mongoose = require("mongoose");

const communitySchema = mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String,
        required: true
    },

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model(
    "Community",
    communitySchema
);
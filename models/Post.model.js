const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    author_id: String,
    status: {
        type: String,
        enum: ["musician", "band"]
    }, 
    name: {
        tpype: String,
        required: true
    },
    lookingForTitle: {
        type: String,
        required: true
    },
    instrument: {
        type: [String], // add enum later
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    experience : {
        type: String,
        enum: ["rookie", "medium", "advanced", "professional", "expert"],
        required: true
    },
    location: String,
    creationDate: Date,
    image: String,
  },
  {
    timestamps: true,
  }

);

const User = model("Post", postSchema);

module.exports = Post;
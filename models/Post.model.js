const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    author_id: String,
    status: {
        type: String,
        enum: ["musician", "band"]
    }, 
    name: {
        type: String,
        required: true
    },
    title: {
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
    email: {
        type: String,
        //required: true
    },
    experience : {
        type: String,
        enum: ["anyexp", "beginner", "intermediate", "moderate", "advanced", "expert"],
        required: true
    },
    location: String,
    image: String,
  },
  {
    timestamps: true,
  }

);

const Post = model("Post", postSchema);

module.exports = Post;
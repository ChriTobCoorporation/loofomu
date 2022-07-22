const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    author_id: {
        type: Schema.Types.ObjectId, 
        ref: 'User'},
    status: {
        type: String,
        enum: ["Musician", "Band"]
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
    genre: {
        type: String,
        enum: ["Rock", "Pop", "Classic"],
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
    image: {
        type: String,
        default: "/images/noImageAvailable.png"
    }
  },
  {
    timestamps: true,
  }

);

const Post = model("Post", postSchema);

module.exports = Post;
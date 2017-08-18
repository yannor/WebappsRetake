var mongoose = require("mongoose"),
    CommentSchema = new mongoose.Schema({
        body: String,
        author: String,
        upvotes: {
            type: Number,
            default: 0
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    });
CommentSchema.methods.upvote = function(a) {
    this.upvotes += 1, this.save(a)
}, CommentSchema.methods.downvote = function(a) {
    this.upvotes -= 1, this.save(a)
}, mongoose.model("Comment", CommentSchema);

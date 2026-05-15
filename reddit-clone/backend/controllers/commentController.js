const Comment = require("../models/Comment");

const createComment = async (req, res) => {

    try {

        const { text, post } = req.body;

        const comment = await Comment.create({
            text,
            post,
            author: req.user.id
        });

        res.status(201).json(comment);

    } catch(error){

        res.status(500).json({
            message: error.message
        });

    }

};

const getComments = async (req, res) => {

    try {

        const comments = await Comment.find()
        .populate("author", "username")
        .populate("post", "title");

        res.status(200).json(comments);

    } catch(error){

        res.status(500).json({
            message: error.message
        });

    }

};

const getCommentsByPost = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate("author", "username")
            .sort({ createdAt: -1 });

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if the user is the author
        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to delete this comment" });
        }

        await Comment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createComment,
    getComments,
    getCommentsByPost,
    deleteComment
};
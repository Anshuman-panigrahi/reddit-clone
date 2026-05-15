const Post = require("../models/Post");

const createPost = async (req, res) => {

    try {

        const {
            title,
            content,
            community
        } = req.body;

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

        const post = await Post.create({
            title,
            content,
            community,
            imageUrl,
            author: req.user.id
        });

        res.status(201).json(post);

    } catch(error){

        res.status(500).json({
            message: error.message
        });

    }

};

const getPosts = async (req, res) => {

    try {
        const { search, sort } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { content: { $regex: search, $options: "i" } }
                ]
            };
        }

        let sortOption = { createdAt: -1 };
        if (sort === "top") sortOption = { upvotes: -1 };
        if (sort === "hot") sortOption = { upvotes: -1 }; // Simplified
        if (sort === "new") sortOption = { createdAt: -1 };
        if (sort === "rising") sortOption = { createdAt: -1 }; // Simplified

        const posts = await Post.find(query)
        .populate("author", "username")
        .populate("community", "name")
        .sort(sortOption);

        res.status(200).json(posts);

    } catch(error){

        res.status(500).json({
            message: error.message
        });

    }

};

const votePost = async (req, res) => {
    try {
        const { type } = req.body; // "up" or "down"
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (type === "up") {
            post.upvotes += 1;
        } else if (type === "down") {
            post.downvotes += 1;
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const savePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const userId = req.user.id.toString();
        const isSaved = post.savedBy.some(id => id.toString() === userId);
        
        if (isSaved) {
            post.savedBy = post.savedBy.filter(id => id.toString() !== userId);
        } else {
            post.savedBy.push(req.user.id);
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the user is the author
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to delete this post" });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPost,
    getPosts,
    votePost,
    savePost,
    deletePost
};
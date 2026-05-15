const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createPost,
    getPosts,
    votePost,
    savePost,
    deletePost
} = require("../controllers/postController");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post("/", protect, upload.single("image"), createPost);

router.get("/", getPosts);

router.patch("/:id/vote", protect, votePost);

router.patch("/:id/save", protect, savePost);

router.delete("/:id", protect, deletePost);

module.exports = router;
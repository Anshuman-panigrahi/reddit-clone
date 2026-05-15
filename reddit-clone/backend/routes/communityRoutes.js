const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createCommunity,
    getCommunities
} = require("../controllers/communityController");

router.post("/", protect, createCommunity);

router.get("/", getCommunities);

module.exports = router;
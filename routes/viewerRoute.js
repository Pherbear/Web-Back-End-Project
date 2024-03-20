const express = require('express');
const router = express.Router();
const Post = require('../model/post');
const Comment = require('../model/comment');

// Get all posts
router.get("/posts", async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json({status: 'Ok', data: posts});
    } catch (err) {
        res.status(500).json({status: 'error', error: 'Server error'});
    }
});

// Get a specific post by ID and its comments
router.get("/posts/:postId", async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({status: 'error', error: 'Post not found'});
        }
        const comments = await Comment.find({postId: postId});
        res.status(200).json({status: 'Ok', data: {post, comments}});
    } catch (err) {
        res.status(500).json({status: 'error', error: 'Server error'});
    }
});

module.exports = router;

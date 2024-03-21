const express = require('express');
const router = express.Router();
const Post = require('../model/post');
const Comment = require('../model/comment');
const User = require('../model/user');

// Get all posts
router.get("/posts", async (req, res) => {
    try {
        const posts = await Post.find();
        const map = new Map()
        let new_posts = []
        let index = 0
        for (let post of posts) {
            let username
            if (map.has(post.userId)) {
                username = map.get(post.userId)
            } else {
                const user = await User.findOne({_id: post.userId})
                username = user.name
                map.set(post.userId, username)
            }
            new_posts.push({...post._doc, name: username})
        }
        res.status(200).json({status: 'Ok', data: new_posts});
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

        const user = await User.findOne({_id: post.userId})
        const username = user.name
        const new_post = {...post._doc, name: username}

        const comments = await Comment.find({postId: postId});
        let new_comments = []
        let username_map = new Map()
        for (const comment of comments) {
            let comment_username
            if (username_map.has(comment.userId)) {
                comment_username = username_map.get(comment.userId)
            } else {
                const comment_user = await User.findOne({_id: comment.userId})
                comment_username = comment_user.name
                username_map.set(comment.userId, comment_username)
            }
            new_comments.push({...comment._doc, name: comment_username})
        }
        res.status(200).json({status: 'Ok', data: {post: new_post, comments: new_comments}});
    } catch (err) {
        res.status(500).json({status: 'error', error: 'Server error'});
    }
});

module.exports = router;

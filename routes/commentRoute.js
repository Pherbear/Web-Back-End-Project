// This file has our API endpoints that deal with user comments
// Users will be able to post and delete
const express = require('express');
const router = express.Router();
const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Post = require('../model/post');
const Comment = require('../model/comment');


// comment on a specific post from user (only for authorized user)
router.post('/', async (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ status: 'error', error: 'Authorization header missing' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ status: 'error', error: 'Bearer token missing' });

    try {
        const decoded = jwt.verify(token, 'secret123');
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).json({ status: 'error', error: 'User not found' });
        }

        if (user.status == 'banned') {
            return res.json({ status: 'error', error: 'User is banned'})
        }

        const comment = new Comment({
            postId: req.body.postId,
            userId: user._id,
            body: req.body.body
        });

        comment.save()

        return res.json({ status: 'Ok', comment });
    } catch (error) {
        console.error(error);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ status: 'error', error: 'Invalid Token' });
        }
        return res.status(500).json({ status: 'error', error: 'Server error during token verification' });
    }
});

// comment on a specific post from user (only for authorized user)
router.delete('/:id', async (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ status: 'error', error: 'Authorization header missing' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ status: 'error', error: 'Bearer token missing' });

    try {
        const decoded = jwt.verify(token, 'secret123');
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).json({ status: 'error', error: 'User not found' });
        }

        if (user.status == 'banned') {
            return res.json({ status: 'error', error: 'User is banned' })
        }

        const comment = await Comment.findOne({_id: req.params.id})
        
        if (!comment){
            return res.json({ status: 'error', error: 'Comment not found' });
        }
        
        if (comment.userId.toString() !== user._id.toString()) {
            return res.json({ status: 'error', error: 'Not a authorized User' });
        }
        
        await Comment.deleteOne({_id: req.params.id})

        return res.json({ status: 'Ok', message: `comment ${req.params.id} deleted` });
    } catch (error) {
        console.error(error);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ status: 'error', error: 'Invalid Token' });
        }
        return res.status(500).json({ status: 'error', error: error });
    }
});

module.exports = router;

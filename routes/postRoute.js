const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const Post = require('../model/post');
const Comment = require('../model/comment');

// Creating a new post for user(only for authorized user)
router.post('/', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, 'secret123');
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.json({ status: 'error', error: 'Not a authorized User' });
        }

        if (user.status == 'banned') {
            return res.json({ status: 'error', error: 'User is banned'})
        }

        const post = new Post({
            userId: user._id,
            title: req.body.title,
            subTitle: req.body.subTitle,
            description: req.body.description
        });

        await post.save();
        
        return res.json({ status: 'Ok', post });
    } catch (error) {
        return res.json({ status: 'error', error: 'Invalid Token' });
    }
});


// edit a specific post from user (only for authorized user)
router.put('/:id', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, 'secret123');
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.json({ status: 'error', error: 'Not a authorized User' });
        }

        if (user.status == 'banned') {
            return res.json({ status: 'error', error: 'User is banned'})
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.json({ status: 'error', error: 'Post not found' });
        }

        if (post.userId.toString() !== user._id.toString()) {
            return res.json({ status: 'error', error: 'Not a authorized User' });
        }

        post.title = req.body.title;
        post.subTitle = req.body.subTitle;
        post.description = req.body.description;

        await post.save();

        return res.json({ status: 'Ok', post });
    } catch (error) {
        return res.json({ status: 'error', error: 'Invalid Token' });
    }
});

// delete a specific post from user (only for authorized user)
router.delete('/:id', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, 'secret123');
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.json({ status: 'error', error: 'Not a authorized User' });
        }

        if (user.status == 'banned') {
            return res.json({ status: 'error', error: 'User is banned'})
        }

        const post = await Post.findOne({_id: req.params.id});
        
        if (!post) {
            return res.json({ status: 'error', error: 'Post not found' });
        }

        if (post.userId.toString() !== user._id.toString()) {
            return res.json({ status: 'error', error: 'Not a authorized User' });
        }
  
        await Post.deleteOne({_id: req.params.id})
        await Comment.deleteMany({ postId: req.params.id })

        return res.json({ status: 'Ok', post });
    } catch (error) {
        return res.json({ status: 'error', error: error });
    }
});


module.exports = router;

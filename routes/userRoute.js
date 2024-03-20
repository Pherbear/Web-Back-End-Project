const express = require('express');
const router = express.Router();
const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Post = require('../model/post');
const Comment = require('../model/comment');

// Register new user 
router.post("/register", async (req, res) => {
    try{
        const newPassword = await bcrypt.hash(req.body.password, 10)
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: newPassword
        })

        res.status(200).send("User Added to the Database")
    }
    catch(err){
        res.json({staus:'error', error: 'Duplicate email'})
    }
})

// User login
router.post('/login', async (req, res) => {
    const user = await User.findOne({
        email: req.body.email
    })

    if(!user){
        return res.json({status: 'error', error: 'Invalid Login'})
    }

    const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
    )

    if(isPasswordValid){
        const token = jwt.sign(
            {
                name: user.name,
                email: user.email
            },
            'secret123'
        )

        return res.json({status:'Ok', user:token})
    }else{
        return res.json({status: 'error', user: false})
    }

})

// Creating a new post for user(only for authorized user)
router.post('/post', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, 'secret123');
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.json({ status: 'error', error: 'Not a authorized User' });
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
router.put('/post/:id', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, 'secret123');
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.json({ status: 'error', error: 'Not a authorized User' });
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
router.delete('/post/:id', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, 'secret123');
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.json({ status: 'error', error: 'Not a authorized User' });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.json({ status: 'error', error: 'Post not found' });
        }

        if (post.userId.toString() !== user._id.toString()) {
            return res.json({ status: 'error', error: 'Not a authorized User' });
        }

        await post.remove();

        return res.json({ status: 'Ok', post });
    } catch (error) {
        return res.json({ status: 'error', error: 'Invalid Token' });
    }
});

// get all posts from user (only for authorized user)
router.get('/post', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, 'secret123');
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.json({ status: 'error', error: 'Not a authorized User' });
        }

        const posts = await Post.find({ userId: user._id });

        return res.json({ status: 'Ok', posts });
    } catch (error) {
        return res.json({ status: 'error', error: 'Invalid Token' });
    }
});

// comment on a specific post from user (only for authorized user)
router.post('/comment', async (req, res) => {
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

        const comment = new Comment({
            postId: req.body.postId,
            userId: user._id,
            body: req.body.body
        });

        await comment.save();
        return res.json({ status: 'Ok', comment });
    } catch (error) {
        console.error(error);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ status: 'error', error: 'Invalid Token' });
        }
        return res.status(500).json({ status: 'error', error: 'Server error during token verification' });
    }
});

module.exports = router;
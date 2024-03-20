const express = require('express');
const router = express.Router();
const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

// // Adding a post to user
// router.post("/post", async (req, res) => {
//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]

//     console.log(token)
//     if (token == null) return res.sendStatus(401)

//     try{
//         const decoded = jwt.verify(token, 'secret123')

//         const user = await User.findOne({
//             email: decoded.email
//         })

//         if(!user){
//             return res.json({status:'error', error:'Not a authorized User'})
//         }

//         await User.updateOne(
//             {email: decoded.email},
//             {$set: {post: req.body.post}}
//             )
        
//         return res.json({status: 'Ok'})
//     }catch(error){
//         return res.json({status:'error', error:'Invalid Token'})
//     }
// })

// Creating a new post for user 
router.post("/user_id/posts", async (req, res) => {
    const { user_id } = req.params;

    try {
        // Find the user by user_id
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ status: 'error', error: 'User not found' });
        }

        // Create the new post
        const newPost = {
            title: req.body.title,
            subTitle: req.body.subTitle,
            description: req.body.description
        };
        user.posts.push(newPost);
        await user.save();

        res.status(201).json({ status: 'Ok', message: 'Post created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: 'Server error' });
    }
})

// Adding a comment to a post 
router.post('/', async (req, res) => {
    const {postId} = req.params;
    const comment = new Comment(req.body);
    if(!comment)
    {
        return res.status(400).json({error: 'Comment is required'})
    }
    
    const post = post.find(post => post_id === postId);
    if(!post)
    {
        return res.status(404).json({error: 'Post not found'})
    }
    
    const newComment = {
        id: user_id,
        comment,
        createdAt: new Date()
    };
    res.status(201).json(newComment)
})

module.exports = router;
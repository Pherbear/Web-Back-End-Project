// The API endpoints for users to register a new account and login 
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

    if (!user){
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

router.post('/add/:userId', async (req, res) => {
    const {userId} = req.params
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
        
        const target_user = await User.findOne({ _id: userId})

        if (user._id == userId){
            return res.json({ status: 'error', error: 'Cannot Add Yourself'})
        }

        if (!target_user) {
            return res.json({ status: 'error', error: 'Target User Does Not exist'})
        }

        if (user.friends.includes(userId)) {
            return res.json({ status: 'error', error: 'Target User Already in Friends List'})
        }

        user.friends.push(userId)
        await user.save()

        return res.json({ status: 'Ok', message: `friend id: ${userId} added` });

    } catch (error) {
        return res.json({ status: 'error', error: 'Invalid Token' });
    }
})

router.post('/unadd/:userId', async (req, res) => {
    const {userId} = req.params
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
        
        const target_user = await User.findOne({ _id: userId})

        if (!target_user) {
            return res.json({ status: 'error', error: 'Target User Does Not exist'})
        }

        if (!user.friends.includes(userId)) {
            return res.json({ status: 'error', error: 'Target User Not in Friends List'})
        }

        const index = user.friends.indexOf(userId)
        user.friends.splice(index, 1)

        await user.save()

        return res.json({ status: 'Ok', message: `friend id: ${userId} removed` });

    } catch (error) {
        return res.json({ status: 'error', error: 'Invalid Token' });
    }
})


module.exports = router;
const express = require('express');
const router = express.Router();
const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

router.post("/quote", async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    console.log(token)
    if (token == null) return res.sendStatus(401)

    try{
        const decoded = jwt.verify(token, 'secret123')

        const user = await User.findOne({
            email: decoded.email
        })

        if(!user){
            return res.json({status:'error', error:'Not a authorized User'})
        }

        await User.updateOne(
            {email: decoded.email},
            {$set: {quote: req.body.quote}}
            )
        
        return res.json({status: 'Ok'})
    }catch(error){
        return res.json({status:'error', error:'Invalid Token'})
    }
})

module.exports = router;
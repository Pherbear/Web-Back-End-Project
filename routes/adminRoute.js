const express = require('express');
const router = express.Router();
const Admin = require('../model/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

// register admin
router.post("/register", async (req, res) => {
    try{
        const newPassword = await bcrypt.hash(req.body.password, 10)
        await Admin.create({
            name: req.body.name,
            email: req.body.email,
            password: newPassword
        })

        res.status(200).send("Admin Added to the Database")
    }
    catch(err){
        res.json({staus:'error', error: 'Duplicate email'})
    }
})

// login admin
router.post('/login', async (req, res) => {
    const admin = await Admin.findOne({
        email: req.body.email
    })

    if(!admin){
        return {status: 'error', error: 'Invalid Login'}
    }

    const isPasswordValid = await bcrypt.compare(
        req.body.password,
        admin.password
    )

    if(isPasswordValid){
        const token = jwt.sign(
            {
                name: admin.name,
                email: admin.email
            },
            'secret123'
        )

        return res.json({status:'Ok', admin:token})
    }else{
        return res.json({status: 'error', admin: false})
    }

})

router.put('/ban/:userId', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, 'secret123');
        const admin = await Admin.findOne({ email: decoded.email });

        if (!admin) {
            return res.json({ status: 'error', error: 'Not a authorized Admin' });
        }

        const user = await User.findOne({ _id : req.params.userId})

        console.log(user)

        if (!user) {
            return res.json({ status: 'error', error: 'User Not Found'})
        }

        user.status = 'banned'
        await user.save()

        return res.json({ status: 'ok', user})

    } catch (error) {
        return res.json({status: 'error', error: error})
    }
})

router.put('/unban/:userId', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, 'secret123');
        const admin = await Admin.findOne({ email: decoded.email });

        if (!admin) {
            return res.json({ status: 'error', error: 'Not a authorized Admin' });
        }

        const user = await User.findOne({ _id : req.params.userId})

        console.log(user)

        if (!user) {
            return res.json({ status: 'error', error: 'User Not Found'})
        }

        user.status = 'unbanned'
        await user.save()

        return res.json({ status: 'ok', user})

    } catch (error) {
        return res.json({status: 'error', error: error})
    }
})

module.exports = router;
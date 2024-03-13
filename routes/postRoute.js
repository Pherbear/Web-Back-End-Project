const express = require('express');
const router = express.Router();
const Post = require('../model/post');



router.post('/', async (req, res)=>{
    const post = new Post(req.body)
    try{
        await post.save()
        res.status(201).send(post)
    } catch(error){
        res.status(500).send(error)
    }

})


router.get('/', async (req, res)=>{
    try{
        const blogs = await Post.find({})
        res.status(200).send(blogs)
    }catch(error){
        res.status(500).send(error)
    }
})


router.delete('/:id', async (req, res) => {
    try{
        const post = await Post.findByIdAndDelete(req.params.id)
        if(!post){
            res.status(404).send()
        }
        res.send(post)
        
    }catch(error){
        res.status(500).send(error)
    }
})

router.patch('/:id', async (req, res) => {
    try{
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {new:true})
        if(!post){
            res.status(404).send()
        }
        res.status(200).send(post)
        
    }catch(error){
        res.status(500).send(error)
    }
})

module.exports = router;
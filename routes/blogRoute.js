const express = require('express');
const router = express.Router();
const Blog = require('../model/blog');



router.post('/', async (req, res)=>{
    const blog = new Blog(req.body)
    try{
        await blog.save()
        res.status(201).send(blog)
    } catch(error){
        res.status(500).send(error)
    }

})


router.get('/', async (req, res)=>{
    try{
        const blogs = await Blog.find({})
        res.status(200).send(blogs)
    }catch(error){
        res.status(500).send(error)
    }
})


router.delete('/:id', async (req, res) => {
    try{
        const blog = await Blog.findByIdAndDelete(req.params.id)
        if(!blog){
            res.status(404).send()
        }
        res.send(blog)
        
    }catch(error){
        res.status(500).send(error)
    }
})

router.patch('/:id', async (req, res) => {
    try{
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {new:true})
        if(!blog){
            res.status(404).send()
        }
        res.status(200).send(blog)
        
    }catch(error){
        res.status(500).send(error)
    }
})

module.exports = router;
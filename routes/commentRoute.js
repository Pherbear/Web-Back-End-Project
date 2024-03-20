const express = require('express');
const router = express.Router();
const Comment = require('../model/comment');



//POST (/${user_id}/posts) (body: post body) (authentication: user token)

router.post('/:id', (req, res) => {
    const comment = new Comment(req.body);
    if (!token)
        return res.status(400).json({ error: 'Token is required' });

    const user = user.find(user => user.token === token);
    if (!user)
        return res.status(400).json({ error: 'Invalid Token' });
    res.json({ message: 'Authentication Successful, user' })
})

//Get all comments
router.get(`/`, async (req, res) => {
    res.json(comments)
})

//POST (/posts/${post_id}) (will comment on the post with id: post_id) (authentication: user token)
router.post(`/`, async (req, res) => {
    const { text, author } = req.body;
    if (!text || !author)
        return res.status(400).json({ error: 'No Comment' });

    const newComment = {
        id: post_id,
        text,
        author,
        createAt: new Date()
    };
    comments.push(newComment);
    res.status(201).json(newComment);
}
);

//DELETE (/posts/${post_id}/comment/${comment_id}) (will delete comment with id: comment_id on post with id: post_id) (authentication: user token)
router.delete(`/:id`, (req, res) => {
    const commentId = parseInt(req.params.id);
    const commentIndex = comments.findIndex(comment => comment.id === commentId);
    if (commentIndex == -1)
        return res.status(404).json({ error: 'Comment not found' })
    comments.splice(commentIndex, 1);
    res.sendStatus(204)
})

module.exports = router

// router.post(`${user_id}/posts`, async (req, res) => {
//     const {text, author} = req.body;
//     if(!text || !author)
//         return res.status(400).json({error: 'No Comment'});

//         const newComment = {
//             id: comments.length + 1,
//             text,
//             author,
//             createAt: new Date()
//         };
//         comments.push(newComment);
//         res.status(201).json(newComment);
//     }
// );


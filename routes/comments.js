// THIRD PARTY MODULES
const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
// CUSTOM MODULES FILES
const { Post } = require('./../models/Post');
const { Comment } = require('./../models/Comment');
const { auth } = require('./../middleware/auth');

const Op = Sequelize.Op;

// ROUTES
router.post('/', auth, (req, res) => {
    Comment.create({
        text: req.body.commentText.trim(),
        userId: req.user.id,
        postId: req.query.postId
    })
    .then(() => {
        res.redirect(`/posts/${req.query.postId}`);
    })
    .catch(Sequelize.ValidationError, (err) => {
        req.flash('error_msg', err.message);
        res.redirect(`/posts/${req.query.postId}`);
    });
});

router.delete('/:commentId', auth, (req, res) => {
    Comment.findOne({
        include: [{
            model: Post
        }],
        where: {
            id: req.params.commentId
        }
    })
    .then((comment) => {
        return comment.destroy({
            where: {
                [Op.or]: [
                    {userId: req.user.id},
                    {'post.userId': req.user.id}
                ]
            }
        });
    })
    .then(() => {
        res.redirect(`/posts/${req.query.postId}`);
    })
    .catch((err) => {
        req.flash("error_msg", err.message);
        res.redirect(`/posts/${req.query.postId}`);
    });
});
// EXPORT ROUTER;
module.exports = router;
// THIRD PARTY MODULES
const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
// CUSTOM MODULES FILES
const { Post } = require('./../models/Post');
const { User } = require('./../models/User');
const { Comment } = require('./../models/Comment');
const { auth } = require('./../middleware/auth');

const Op = Sequelize.Op;

// ROUTES
router.get('/', (req, res) => {
    const pageNo = parseInt(req.query.pageNo);
    let offset = 0;
    let size = 9;
    let prev = 1;
    let next = 2;

    if (pageNo) {
        offset = size * (pageNo - 1);
        prev = pageNo - 1;
        next = pageNo + 1;
    }
    if (pageNo === 0) {
        offset = 0;
        prev = 1;
        next = 2;
    }
    if (pageNo < 0) {
        req.flash('error_msg', "Page No Cannot Be Negative");
        return res.redirect('/posts');
    }

    Post.findAndCountAll({
        where: {
            published: true
        }
    })
        .then((data) => {
            Post.findAll({
                limit: size,
                offset: offset,
                order: [
                    ['createdAt', 'DESC']
                ],
                include: [{
                    model: User,
                    attributes: {
                        exclude: ["password"]
                    }
                }],
                where: {
                    published: true
                }
            })
                .then(posts => {
                    const pages = Math.ceil(data.count / size);
                    res.render('posts/posts', { 
                        posts,
                        pages,
                        currentPage: pageNo,
                        prev,
                        next 
                    });
                })
                .catch(err => {
                    throw err;
                });
        })
        .catch(err => {
            req.flash('error_msg', err.message);
            res.redirect('/');
        })
});

router.post('/', (req, res) => {
    const title = req.body.title;
    const body = req.body.body;
    const checked = req.body.published;
    let published;

    if (checked === 'on') {
        published = true;
    } else {
        published = false;
    }

    Post.create({
        title,
        body,
        published,
        userId: req.user.id
    })
        .then(() => {
            req.flash('success_msg', "Post Added Successfully");
            res.redirect('/dashboard');
        })
        .catch(Sequelize.ValidationError, (err) => {
            res.render('posts/add', {
                local_error: err.errors[0].message,
                title,
                body
            })
        });
});

router.get('/add', auth, (req, res) => {
    res.render('posts/add');
});

router.get('/users/:userId', (req, res) => {
    const pageNo = parseInt(req.query.pageNo);
    let offset = 0;
    let size = 9;
    let prev = 1;
    let next = 2;

    if (pageNo) {
        offset = size * (pageNo - 1);
        prev = pageNo - 1;
        next = pageNo + 1;
    }
    if (pageNo === 0) {
        offset = 0;
        prev = 1;
        next = 2;
    }

    if (pageNo < 0) {
        req.flash('error_msg', "Page No Cannot Be Negative");
        return res.redirect(`/posts/users/${req.params.userId}`);
    }

    Post.findAndCountAll({
        where: {
            published: true,
            userId: req.params.userId
        }
    })
        .then((data) => {
            Post.findAll({
                limit: size,
                offset: offset,
                order: [
                    ['createdAt', 'DESC']
                ],
                include: [{
                    model: User,
                    attributes: {
                        exclude: ["password"]
                    }
                }],
                where: {
                    published: true,
                    userId: req.params.userId
                }
            })
                .then(posts => {
                    const pages = Math.ceil(data.count / size);
                    res.render('posts/posts', { 
                        posts,
                        pages,
                        currentPage: pageNo,
                        prev,
                        next,
                        postCreatorName: posts[0] ? posts[0].user.name : null
                    });
                })
                .catch(err => {
                    throw err;
                });
        })
        .catch(err => {
            req.flash('error_msg', err.message);
            res.redirect('/');
        })
});

router.get('/:postId', (req, res) => {
    const opArgs = {
        or: [{ published: true }]
    };

    if (req.user) {
        opArgs.or = [...opArgs.or, { userId: req.user.id }]
    }

    Post.findOne({
        order: [
            [Comment, 'createdAt', 'DESC']
        ],
        include: [{
            model: User,
            attributes: {
                exclude: ["password"]
            }
        }, {
            model: Comment,
            include: [{
                model: User
            }]
        }],
        where: {
            id: req.params.postId,
            [Op.or]: opArgs.or
        }
    }).then(post => {
        if (!post) {
            req.flash("error_msg", "Post Not Found");
            return res.redirect('/pagenotfound');
        }
        res.render('posts/show', { post })
    })
        .catch(err => {
            req.flash('error_msg', err.message);
            res.redirect('/posts');
        });
});

router.get("/edit/:postId", auth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.postId,
            userId: req.user.id
        }
    })
        .then(post => {
            if (!post) {
                req.flash("error_msg", "Post Not Found")
                return res.redirect('/pagenotfound');
            }
            res.render('posts/edit', { post });
        })
        .catch(err => {
            req.flash("error_msg", err.message);
            res.redirect('/dashboard');
        })
});

router.put("/edit/:postId", auth, (req, res) => {
    let published;

    if (req.body.published === 'on') {
        published = "true";
    } else {
        published = "false";
    }

    Post.update({
        title: req.body.title,
        body: req.body.body,
        published
    }, {
            where: {
                id: req.params.postId,
                userId: req.user.id
            }
        })
        .then(() => {
            res.redirect(`/posts/${req.params.postId}`);
        })
        .catch(Sequelize.ValidationError, (err) => {
            req.flash("error_msg", err.message);
            res.redirect(`/posts/edit/${req.params.postId}`);
        })
        .catch(err => {
            res.json({ err })
        });
});

router.delete('/:postId', auth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.postId,
            userId: req.user.id
        }
    })
        .then(() => {
            req.flash("success_msg", "Post Deleted Successfully");
            res.redirect("/dashboard");
        })
        .catch(err => {
            req.flash("error_msg", err.message)
            res.redirect("/dashboard");
        });
});

// EXPORT ROUTER;
module.exports = router;
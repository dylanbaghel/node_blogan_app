// THIRD PARTY MODULES
const express = require('express');
const router = express.Router();
const passport = require('passport');
// CUSTOM MODULES FILES
const { User } = require('./../models/User');
const { guest } = require('./../middleware/auth');
// ROUTES

router.get('/register', guest, (req, res) => {
    return res.render('users/register');
});

router.get('/login', guest, (req, res) => {
    res.render('users/login');
});

router.post('/', (req, res) => {
    const name = req.body.fullName;
    const email = req.body.email;
    const password = req.body.password;
    
    User.create({
        name,
        email,
        password
    }).then(() => {
        req.flash('success_msg', "Successfully Registered, Now Log In");
        res.redirect('/users/login');
    })
    .catch(err => {
        res.render('users/register', {
            local_error: err.errors[0].message,
            name,
            email
        });
    });
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: true
}), (req, res) => {
    req.flash('success_msg', "Successfully Logged In");
    res.redirect('/dashboard');
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', "Successfully Logged Out");
    res.redirect('/users/login');
});

router.delete('/danger', (req, res) => {
    User.destroy({
        where: {
            id: req.user.id
        }
    })
    .then(() => {
        req.logOut();
        req.flash('success_msg', "Successfully Deleted Account");
        res.redirect('/');
    })
    .catch((err) => {
        req.flash("error_msg", err.message);
        res.redirect('/dashboard');
    });
});

// EXPORT ROUTER;
module.exports = router;
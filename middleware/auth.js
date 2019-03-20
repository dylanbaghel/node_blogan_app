module.exports = {
    auth(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        req.flash('error_msg', "Not Authorized");
        res.redirect('/users/login');
    },
    guest(req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard');
        } else {
            return next();
        }

    }
};
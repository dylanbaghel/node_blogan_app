const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');

const { User } = require('./../models/User');

const passportLocal = (passport) => {
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        User.findOne({
            where: {
                email
            }
        })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: "No User With This Email Registered" });
                }

                return bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: "Incorrect Password" });
                        }
                    })
                    .catch(err => {
                        throw err;
                    });
            })
            .catch(err => {
                throw err;
            })
    }));

    passport.serializeUser((user, done) => {
        return done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findByPk(id)
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                done(err, false);
            });
    });
};

module.exports = { passportLocal };
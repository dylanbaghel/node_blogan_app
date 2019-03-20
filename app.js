require('./config/config');
// System Modules
const path = require('path');
// THIRD PARTY MODULES
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
// CUSTOM MODULE FILES
const sequelize = require('./db/db');
const users = require('./routes/users');
const posts = require('./routes/posts');
const comments = require('./routes/comments');
const { truncate, formateDateTime, modifyPost, addComment, deleteComment, showNext, showPrev, itemCount, pageCounter } = require('./helpers');
const { auth } = require('./middleware/auth');
const { Post } = require('./models/Post');
// PASSPORT SETTINGS
require('./config/passport').passportLocal(passport);

// APP SETTINGS
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: {
        truncate,
        formateDateTime,
        modifyPost,
        addComment,
        deleteComment,
        showNext,
        showPrev,
        itemCount,
        pageCounter
    }
}));
app.set('view engine', 'handlebars');
// MIDDLEWARES
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    saveUninitialized: false,
    resave: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// GLOBAL VARIABLES
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// ROUTES
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/dashboard', auth, (req, res) => {
    const pageNo = parseInt(req.query.pageNo);
    let offset = 0;
    let size = 10;
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
        return res.redirect('/dashboard');
    }

    Post.findAndCountAll({
        where: {
            userId: req.user.id
        }
    })
        .then((data) => {
            Post.findAll({
                limit: size,
                offset: offset,
                order: [
                    ['createdAt', 'DESC']
                ],
                where: {
                    userId: req.user.id
                }
            })
                .then(posts => {
                    const pages = Math.ceil(data.count / size);
                    res.render('dashboard', { 
                        posts, 
                        pages, 
                        prev, 
                        next,
                        currentPage: pageNo
                    });
                })
                .catch(err => {
                    throw err;
                });
        })
        .catch(err => {
            req.flash('error_msg', err.message);
            res.redirect("/");
        })
});

app.get('/pagenotfound', (req, res) => {
    res.render('404');
});

// DB VALIDATION    
sequelize.validate()
    .then(() => {
        return sequelize.sync();
    })
    .then(() => {
        console.log('Database is Up')
    })
    .catch(err => {
        console.log(err);
    });

// ROUTE MAPPING
app.use('/users', users);
app.use('/posts', posts);
app.use('/comments', comments);
// SERVER LISTENING
app.get("*", (req, res) => {
    res.redirect('/pagenotfound');
});
app.listen(process.env.SERVER_PORT, () => {
    console.log('Server is Up');
});
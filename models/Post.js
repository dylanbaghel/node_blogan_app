const Sequelize = require('sequelize');
const sequelize = require('./../db/db');

const { User } = require('./User');

const Post = sequelize.define('posts', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Please Enter Title"
            },
            isLengthOk(value) {
                if (value.length <= 3) {
                    throw new Error("Title is Too Short");
                }
                if (value.length > 220) {
                    throw new Error("Title is Too Long")
                }
            }
        }
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Please Enter Body"
            }
        }
    },
    published: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

Post.belongsTo(User, { onDelete: 'CASCADE' });
User.hasMany(Post, {as: 'posts'});

module.exports = { Post };
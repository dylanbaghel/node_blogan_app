const Sequelize = require('sequelize');
const sequelize = require('./../db/db');

const { Post } = require('./Post');
const { User } = require('./User');

const Comment = sequelize.define('comments', {
    text: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Please Enter Comment"
            }
        }
    },
    postId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

Comment.belongsTo(Post, { onDelete: 'CASCADE' });
Post.hasMany(Comment);
Comment.belongsTo(User, { onDelete: 'CASCADE' });
User.hasMany(Comment);

module.exports = { Comment };
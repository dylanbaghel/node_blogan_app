const Sequelize = require('sequelize');
const sequelize = require('./../db/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('users', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [3, 200],
                msg: "Name Must Be Between 3 & 200 Chars"
            }
        }
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
            msg: "Email Already Exists"
        },
        validate: {
            isEmail: {
                msg: "Email is Required"
            },
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [6, 1000],
                msg: "Password Must Be More Than 6 Chars"
            }
        }
    }
}, {
    hooks: {
        beforeSave: (user) => {
            user.password = bcrypt.hashSync(user.password, 10);
        }
    }
}, {
    instanceMethods: {
        toJSON() {
            let values = {...this.get()};
            delete values.password;
            return values;
        }
    }
});

module.exports = { User };
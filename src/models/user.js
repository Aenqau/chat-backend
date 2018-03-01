import mongoose from 'mongoose';
import validate from 'mongoose-validator';
import bcrypt from 'bcrypt';
import env from '../lib/env';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        validate: validate({
            validator: 'isEmail',
            message: 'is not valid',
        }),
    },
    password: {
        type: String,
    }
});
/*
userSchema.pre('save', function preSave (next) {
    const user = this;

    if (!user.isModified('password')) {
        return next()
    }

    new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) { return reject(err) }
            resolve(salt)
        })
    })
        .then(salt => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) { throw new Error(err) }

                user.password = hash;

                next(null)
            })
        })
        .catch(err => next(err))
});

userSchema.methods.validatePassword = function validatePassword (password) {
    const user = this;

    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) { return reject(err) }

            resolve(isMatch)
        })
    })
};

userSchema.methods.generateToken = function generateToken () {
    const user = this;
    return jwt.sign({ id: user.id }, env.TOKEN)
};
*/
export default mongoose.model('User', userSchema);

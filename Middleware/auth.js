const jwt = require('jsonwebtoken');
const { User } = require('../Models');
const createError = require('http-errors');
const redis = require('redis');

module.exports = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return next(createError(401, 'Access denied. No token provided.'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req._user_id = decoded._id;
        next();
    } catch (error) {
        console.error('Error occurred:', error);
        return next(createError(500, 'Redis error or invalid token.'));
    }
};
